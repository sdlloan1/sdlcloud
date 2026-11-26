// Creates (or updates the password of) an app account and prints the SQL to run.
//
//   node worker/scripts/create-user.mjs --email owner@example.com --password 'secret123' --role admin
//   node worker/scripts/create-user.mjs --email owner@example.com --password 'secret123' --role admin --apply
//
// Without --apply the INSERT is printed; with it the statement is executed against the
// local D1 database through wrangler (add --remote to target production).
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const option = (name, fallback = "") => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};

const email = option("email").trim().toLowerCase();
const password = option("password");
const role = option("role", "user");
const fullName = option("full_name", email.split("@")[0]);

if (!email || !password) {
  console.error("Usage: node worker/scripts/create-user.mjs --email <email> --password <password> [--role admin] [--apply]");
  process.exit(1);
}

const base64url = (buffer) => buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
const passwordHash = `pbkdf2$100000$${base64url(salt)}$${base64url(hash)}`;

const now = new Date().toISOString();
const id = crypto.randomUUID();
const sql = `INSERT INTO users (id, created_date, updated_date, email, full_name, role, status, kyc_status, password_hash, terms_accepted)
VALUES ('${id}', '${now}', '${now}', '${email}', '${fullName.replace(/'/g, "''")}', '${role}', 'active', 'not_submitted', '${passwordHash}', 0)
ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role, updated_date = excluded.updated_date;`;

if (!args.includes("--apply")) {
  console.log(sql);
  process.exit(0);
}

const remote = args.includes("--remote") ? ["--remote"] : ["--local"];
execFileSync("npx", ["wrangler", "d1", "execute", "DB", ...remote, "--config", "worker/wrangler.jsonc", "--command", sql], {
  stdio: "inherit",
});
