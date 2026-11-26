// Cloudflare Worker entry point: the app's API (auth, entities, functions, files)
// and its built SPA assets, served from one origin.
import { EntityStore, entityDef } from "./store.js";
import { createDbClient } from "./db-client.js";
import {
  clearedCookie,
  createSession,
  currentUser,
  findUserByEmail,
  findUserRow,
  generateTotpSecret,
  hashPassword,
  hashRecoveryCode,
  httpError,
  publicUser,
  randomCode,
  requireUser,
  totpUri,
  verifyPassword,
  verifyTotp,
} from "./auth.js";
import { sendMail } from "./mailer.js";
import * as exportToGoogleSheet from "./functions/exportToGoogleSheet.js";
import * as generateLandingPage from "./functions/generateLandingPage.js";
import * as getReferralDashboard from "./functions/getReferralDashboard.js";
import * as lookupPincode from "./functions/lookupPincode.js";
import * as sendAppUpdate from "./functions/sendAppUpdate.js";
import * as sendLimitAssignedEmail from "./functions/sendLimitAssignedEmail.js";
import * as sendLoanEmail from "./functions/sendLoanEmail.js";
import * as sendPromotionalEmail from "./functions/sendPromotionalEmail.js";
import * as sendRepaymentReminders from "./functions/sendRepaymentReminders.js";
import * as submitKyc from "./functions/submitKyc.js";
import * as submitPartnerRequest from "./functions/submitPartnerRequest.js";
import * as submitRepaymentProof from "./functions/submitRepaymentProof.js";
import * as systemHealthCheck from "./functions/systemHealthCheck.js";
import * as verifyReferrer from "./functions/verifyReferrer.js";

const functions = {
  exportToGoogleSheet,
  generateLandingPage,
  getReferralDashboard,
  lookupPincode,
  sendAppUpdate,
  sendLimitAssignedEmail,
  sendLoanEmail,
  sendPromotionalEmail,
  sendRepaymentReminders,
  submitKyc,
  submitPartnerRequest,
  submitRepaymentProof,
  systemHealthCheck,
  verifyReferrer,
};

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (!url.pathname.startsWith("/api/")) {
        if (env.ASSETS) return env.ASSETS.fetch(request);
        return json({ error: "Not found" }, 404);
      }
      return await handleApi(request, env, url);
    } catch (error) {
      const status = error.status || 500;
      if (status >= 500) console.error(error);
      return json({ error: error.message || "Server error" }, status);
    }
  },

  // Nightly reminder run (see "triggers" in wrangler.jsonc).
  async scheduled(_event, env, ctx) {
    const user = { id: "scheduler", role: "admin" };
    const db = createDbClient(env, { user, serviceRole: true });
    const request = new Request("https://internal/functions/sendRepaymentReminders", { method: "POST", body: "{}" });
    await sendRepaymentReminders.default(request, { db, env, user });
    ctx.waitUntil(Promise.resolve());
  },
};

async function handleApi(request, env, url) {
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const method = request.method;

  if (parts[0] === "health") return json({ ok: true, time: new Date().toISOString() });
  if (parts[0] === "auth") return handleAuth(request, env, parts.slice(1));
  if (parts[0] === "files") return handleFiles(request, env, parts.slice(1));
  if (parts[0] === "entities") return handleEntities(request, env, url, parts.slice(1));

  if (parts[0] === "functions") {
    const handler = functions[parts[1]];
    if (!handler) throw httpError(404, `Unknown function: ${parts[1]}`);
    const user = await currentUser(env, request);
    const db = createDbClient(env, { user });
    return handler.default(request, { db, env, user });
  }

  throw httpError(404, "Not found");
}

async function handleAuth(request, env, parts) {
  const method = request.method;
  const route = `${method} ${parts[0] || ""}${parts[1] ? `/${parts[1]}` : ""}`;

  if (route === "POST register") {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw httpError(400, "Enter a valid email address");
    if (String(body.password || "").length < 8) throw httpError(400, "Password must be at least 8 characters");
    if (await findUserByEmail(env, email)) throw httpError(400, "This email is already registered");
    const now = new Date().toISOString();
    const row = await env.DB.prepare(
      `INSERT INTO users (id, created_date, updated_date, email, full_name, role, status, kyc_status, password_hash, terms_accepted)
       VALUES (?, ?, ?, ?, ?, 'user', 'active', 'not_submitted', ?, 0) RETURNING *`,
    ).bind(crypto.randomUUID(), now, now, email, String(body.full_name || "").trim(), await hashPassword(body.password)).first();
    const session = await createSession(publicUser(row), env);
    return json({ access_token: session.token, user: publicUser(row) }, 200, { "Set-Cookie": session.cookie });
  }

  if (route === "POST login") {
    const body = await request.json().catch(() => ({}));
    const row = await findUserByEmail(env, body.email);
    if (!row) throw httpError(401, "Invalid email or password");
    if (!row.password_hash) {
      throw httpError(403, "This account has no password yet. Use the password reset link to set one.");
    }
    if (!(await verifyPassword(body.password, row.password_hash))) {
      throw httpError(401, "Invalid email or password");
    }
    if (row.totp_enabled) {
      if (!body.totp_code) return json({ error: "Two-factor code required", code: "mfa_required" }, 401);
      const recoveryCodes = JSON.parse(row.recovery_codes || "[]");
      const recoveryHash = await hashRecoveryCode(body.totp_code);
      const recoveryIndex = recoveryCodes.indexOf(recoveryHash);
      if (!(await verifyTotp(row.totp_secret, body.totp_code)) && recoveryIndex < 0) {
        throw httpError(401, "Invalid two-factor code");
      }
      if (recoveryIndex >= 0) {
        recoveryCodes.splice(recoveryIndex, 1);
        await env.DB.prepare("UPDATE users SET recovery_codes = ? WHERE id = ?").bind(JSON.stringify(recoveryCodes), row.id).run();
      }
    }
    const session = await createSession(publicUser(row), env);
    return json({ access_token: session.token, user: publicUser(row) }, 200, { "Set-Cookie": session.cookie });
  }

  if (route === "POST logout") {
    return json({ ok: true }, 200, { "Set-Cookie": clearedCookie });
  }

  if (route === "GET me") {
    return json({ user: await requireUser(env, request) });
  }

  if (route === "PATCH me" || route === "PUT me") {
    const user = await requireUser(env, request);
    const body = await request.json().catch(() => ({}));
    const store = new EntityStore(env.DB, user);
    return json({ user: await store.update("User", user.id, body) });
  }

  if (route === "POST password-reset/request") {
    const body = await request.json().catch(() => ({}));
    const row = await findUserByEmail(env, body.email);
    // Same response whether or not the account exists.
    if (row) {
      const token = [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, "0")).join("");
      const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await env.DB.prepare("INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)")
        .bind(token, row.id, expires).run();
      const link = `${env.APP_BASE_URL}/reset-password?token=${token}`;
      await sendMail(env, {
        to: row.email,
        subject: "Reset your SDL password",
        html: `<p>Use this link within an hour to set a new password:</p><p><a href="${link}">${link}</a></p>`,
      });
      if (!env.RESEND_API_KEY) console.log(`[password-reset] ${row.email} -> ${link}`);
    }
    return json({ ok: true });
  }

  if (route === "POST password-reset/confirm") {
    const body = await request.json().catch(() => ({}));
    if (String(body.password || "").length < 8) throw httpError(400, "Password must be at least 8 characters");
    const reset = await env.DB.prepare("SELECT * FROM password_resets WHERE token = ?").bind(String(body.token || "")).first();
    if (!reset || reset.used_at || reset.expires_at < new Date().toISOString()) {
      throw httpError(400, "This reset link is invalid or has expired");
    }
    await env.DB.prepare("UPDATE users SET password_hash = ?, updated_date = ? WHERE id = ?")
      .bind(await hashPassword(body.password), new Date().toISOString(), reset.user_id).run();
    await env.DB.prepare("UPDATE password_resets SET used_at = ? WHERE token = ?")
      .bind(new Date().toISOString(), reset.token).run();
    const row = await findUserRow(env, reset.user_id);
    const session = await createSession(publicUser(row), env);
    return json({ access_token: session.token, user: publicUser(row) }, 200, { "Set-Cookie": session.cookie });
  }

  if (route === "GET mfa/status") {
    const user = await requireUser(env, request);
    const row = await findUserRow(env, user.id);
    return json({ enabled: Boolean(row.totp_enabled) });
  }

  if (route === "POST mfa/enroll") {
    const user = await requireUser(env, request);
    const secret = generateTotpSecret();
    await env.DB.prepare("UPDATE users SET totp_secret = ?, totp_enabled = 0 WHERE id = ?").bind(secret, user.id).run();
    return json({ secret, otpauth_url: totpUri(secret, user.email) });
  }

  if (route === "POST mfa/activate") {
    const user = await requireUser(env, request);
    const body = await request.json().catch(() => ({}));
    const row = await findUserRow(env, user.id);
    if (!(await verifyTotp(row.totp_secret, body.code))) throw httpError(400, "That code is not valid");
    const codes = Array.from({ length: 8 }, () => randomCode());
    const hashes = await Promise.all(codes.map((code) => hashRecoveryCode(code)));
    await env.DB.prepare("UPDATE users SET totp_enabled = 1, recovery_codes = ? WHERE id = ?")
      .bind(JSON.stringify(hashes), user.id).run();
    return json({ enabled: true, recovery_codes: codes });
  }

  if (route === "POST mfa/disable") {
    const user = await requireUser(env, request);
    const body = await request.json().catch(() => ({}));
    const row = await findUserRow(env, user.id);
    if (!(await verifyPassword(body.password, row.password_hash))) throw httpError(401, "Wrong password");
    await env.DB.prepare("UPDATE users SET totp_enabled = 0, totp_secret = NULL, recovery_codes = NULL WHERE id = ?")
      .bind(user.id).run();
    return json({ enabled: false });
  }

  throw httpError(404, "Not found");
}

async function handleFiles(request, env, parts) {
  if (!env.FILES) throw httpError(503, "File storage is not configured");

  if (request.method === "POST" && !parts[0]) {
    await requireUser(env, request);
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") throw httpError(400, "Attach a file");
    const key = `${crypto.randomUUID()}-${String(file.name || "upload").replace(/[^\w.-]+/g, "_")}`;
    await env.FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });
    return json({ file_url: `${env.APP_BASE_URL}/api/files/${key}`, file_name: file.name });
  }

  if (request.method === "GET" && parts[0]) {
    const object = await env.FILES.get(decodeURIComponent(parts.join("/")));
    if (!object) throw httpError(404, "File not found");
    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  throw httpError(404, "Not found");
}

async function handleEntities(request, env, url, parts) {
  const name = parts[0];
  const sub = parts[1];
  const def = entityDef(name);
  const user = await requireUser(env, request);
  const store = new EntityStore(env.DB, user);
  const method = request.method;

  if (method === "GET" && !sub) {
    const query = parseQuery(url);
    const rows = await store.filter(name, query.filter, query.sort, query.limit);
    return json({ data: rows });
  }

  if (method === "GET" && sub === "count") {
    return json({ count: await store.count(name, parseQuery(url).filter) });
  }

  if (method === "POST" && sub === "aggregate") {
    const body = await request.json().catch(() => ({}));
    return json(await store.aggregate(name, body));
  }

  if (method === "POST" && sub === "bulk") {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.bulkCreate(name, body.items || []) });
  }

  if ((method === "PATCH" || method === "PUT") && sub === "bulk") {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.bulkUpdate(name, body.items || []) });
  }

  if (method === "POST" && sub === "delete-many") {
    const body = await request.json().catch(() => ({}));
    return json({ deleted: await store.deleteMany(name, body.query || body) });
  }

  if (method === "POST" && !sub) {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.create(name, body) });
  }

  if (method === "GET" && sub) {
    const row = await store.get(name, sub);
    if (!row) throw httpError(404, `${name} not found`);
    return json({ data: row });
  }

  if ((method === "PATCH" || method === "PUT") && sub) {
    const body = await request.json().catch(() => ({}));
    return json({ data: await store.update(name, sub, body) });
  }

  if (method === "DELETE" && sub) {
    return json({ data: await store.delete(name, sub) });
  }

  if (def.rls === undefined) throw httpError(404, "Not found");
  throw httpError(405, "Method not allowed");
}

function parseQuery(url) {
  const params = url.searchParams;
  let filter = {};
  if (params.get("q")) filter = JSON.parse(params.get("q"));
  return {
    filter,
    sort: params.get("sort") || "-created_date",
    limit: params.get("limit") ? Number(params.get("limit")) : undefined,
  };
}
