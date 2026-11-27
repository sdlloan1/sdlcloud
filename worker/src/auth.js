// App-owned authentication for the Worker: PBKDF2 passwords, HMAC-signed session
// tokens, one-time reset tokens and TOTP two-factor codes.
import { AUTH_COLUMNS, entityDef } from "./store.js";

const SESSION_COOKIE = "sdl_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PBKDF2_ITERATIONS = 100000;

const encoder = new TextEncoder();

export function httpError(status, message, code) {
  const error = new Error(message);
  error.status = status;
  if (code) error.code = code;
  return error;
}

const toBase64Url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)))
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

const fromBase64Url = (value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(bits)}`;
}

export async function verifyPassword(password, stored) {
  if (!stored) return false;
  const [scheme, iterations, salt, hash] = String(stored).split("$");
  if (scheme !== "pbkdf2") return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: fromBase64Url(salt), iterations: Number(iterations), hash: "SHA-256" },
    key,
    256,
  );
  return toBase64Url(bits) === hash;
}

async function hmacKey(secret) {
  // Without a secret every session token would be signed with an empty key; fail
  // with the fix instead of a raw WebCrypto error on the login screen.
  if (!secret) {
    throw httpError(500, "AUTH_SECRET is not configured for this Worker. Set it with `npx wrangler secret put AUTH_SECRET --config worker/wrangler.jsonc`.");
  }
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signToken(payload, secret) {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(signature)}`;
}

export async function verifyToken(token, secret) {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromBase64Url(signature), encoder.encode(body));
  if (!valid) return null;
  const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

export function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

// Secure cookies are only sent over https, so plain-http local development omits the flag.
const secureFlag = (env) => (String(env.APP_BASE_URL || "").startsWith("https://") ? "; Secure" : "");

export async function createSession(user, env) {
  const token = await signToken(
    { sub: user.id, role: user.role, exp: Date.now() + SESSION_TTL_SECONDS * 1000 },
    env.AUTH_SECRET,
  );
  return { token, cookie: `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secureFlag(env)}` };
}

export const clearedCookie = `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export function publicUser(row) {
  if (!row) return null;
  const def = entityDef("User");
  const user = {};
  for (const column of ["id", "created_date", "updated_date", ...Object.keys(def.fields)]) user[column] = row[column];
  user.email = row.email || "";
  user.full_name = row.full_name || "";
  user.status = row.status || "active";
  user.two_factor_enabled = Boolean(row.totp_enabled);
  for (const [field, spec] of Object.entries(def.fields)) {
    if (spec.type === "boolean") user[field] = Boolean(row[field]);
  }
  return user;
}

export function findUserRow(env, id) {
  const def = entityDef("User");
  return env.DB.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).bind(id).first();
}

export function findUserByEmail(env, email) {
  const def = entityDef("User");
  return env.DB.prepare(`SELECT * FROM ${def.table} WHERE lower(email) = ?`).bind(String(email || "").toLowerCase()).first();
}

// Resolves the signed-in user from the Authorization header or the session cookie.
export async function currentUser(env, request) {
  const header = request.headers.get("Authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = await verifyToken(bearer || readCookie(request, SESSION_COOKIE), env.AUTH_SECRET);
  if (!payload?.sub) return null;
  const row = await findUserRow(env, payload.sub);
  if (!row || row.status === "blocked") return null;
  return publicUser(row);
}

export async function requireUser(env, request) {
  const user = await currentUser(env, request);
  if (!user) throw httpError(401, "Authentication required");
  return user;
}

export async function requireAdmin(env, request) {
  const user = await requireUser(env, request);
  if (user.role !== "admin") throw httpError(403, "Admin access required");
  return user;
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  let bits = "";
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");
  let secret = "";
  for (let index = 0; index + 5 <= bits.length; index += 5) {
    secret += BASE32[parseInt(bits.slice(index, index + 5), 2)];
  }
  return secret;
}

function decodeBase32(secret) {
  let bits = "";
  for (const char of String(secret).toUpperCase().replace(/=+$/, "")) {
    const value = BASE32.indexOf(char);
    if (value < 0) continue;
    bits += value.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(parseInt(bits.slice(index, index + 8), 2));
  }
  return new Uint8Array(bytes);
}

async function totpCode(secret, offset = 0) {
  const counter = Math.floor(Date.now() / 1000 / 30) + offset;
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setUint32(4, counter);
  const key = await crypto.subtle.importKey("raw", decodeBase32(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));
  const offsetIndex = signature[19] & 0x0f;
  const binary = ((signature[offsetIndex] & 0x7f) << 24)
    | (signature[offsetIndex + 1] << 16)
    | (signature[offsetIndex + 2] << 8)
    | signature[offsetIndex + 3];
  return String(binary % 1000000).padStart(6, "0");
}

export async function verifyTotp(secret, code) {
  const candidate = String(code || "").replace(/\s/g, "");
  if (!secret || !/^\d{6}$/.test(candidate)) return false;
  for (const offset of [0, -1, 1]) {
    if ((await totpCode(secret, offset)) === candidate) return true;
  }
  return false;
}

export function totpUri(secret, email) {
  const label = encodeURIComponent(`SDL:${email || "account"}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=SDL&algorithm=SHA-1&digits=6&period=30`;
}

export async function hashRecoveryCode(code) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(String(code).toUpperCase()));
  return toBase64Url(digest);
}

export function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

// Six-digit code emailed for passwordless login and password resets.
export function generateOtp() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(value).padStart(6, "0");
}

// Codes are stored hashed, so a leaked database row cannot be replayed.
export async function hashOtp(env, email, code) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(env.AUTH_SECRET),
    encoder.encode(`${String(email || "").trim().toLowerCase()}:${String(code || "").trim()}`),
  );
  return toBase64Url(signature);
}

export function randomToken(bytes = 32) {
  return [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export { AUTH_COLUMNS };
