// Imports the users exported from the previous (Base44) app into D1 so they can
// sign in to this app. Imported rows keep their profile and KYC data but get no
// password: each user sets one from "Forgot password?" on the login page.
//
//   node worker/scripts/import-legacy-users.mjs users.csv            # local D1
//   node worker/scripts/import-legacy-users.mjs users.csv --remote   # deployed D1
//   node worker/scripts/import-legacy-users.mjs users.csv --dry-run  # print the SQL
//
// Rows whose email is already in the table are left untouched, so it can be re-run.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entities } from "../src/entities.generated.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

const args = process.argv.slice(2);
const csvPath = args.find((arg) => !arg.startsWith("--"));
const remote = args.includes("--remote");
const dryRun = args.includes("--dry-run");
if (!csvPath) {
  console.error("Usage: node worker/scripts/import-legacy-users.mjs <users.csv> [--remote] [--dry-run]");
  process.exit(1);
}

// Minimal RFC 4180 reader: quoted fields may hold commas, escaped quotes ("") and newlines.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((line) => line.some((value) => value !== ""));
}

const [header, ...records] = parseCsv(readFileSync(csvPath, "utf8"));
const users = records.map((line) => Object.fromEntries(header.map((column, index) => [column.trim(), line[index] ?? ""])));

const literal = (value) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
};

const now = new Date().toISOString();

// Only fields the User entity knows about are copied, so the import follows the schema.
function rowValues(record) {
  const values = {
    id: crypto.randomUUID(),
    created_date: record.created_date || now,
    updated_date: record.updated_date || now,
  };
  for (const [field, spec] of Object.entries(entities.User.fields)) {
    const raw = record[field];
    if (raw === undefined || raw === "") continue;
    if (spec.type === "boolean") {
      values[field] = raw === "true" ? 1 : 0;
    } else if (spec.type === "number" || spec.type === "integer") {
      const number = Number(raw);
      if (!Number.isNaN(number)) values[field] = number;
    } else {
      values[field] = raw;
    }
  }
  values.email = String(record.email || "").trim().toLowerCase();
  if (!values.email) throw new Error(`Row without an email: ${JSON.stringify(record)}`);
  if (!values.status) values.status = "active";
  return values;
}

const statements = [];
for (const record of users) {
  const values = rowValues(record);
  const columns = Object.keys(values);
  statements.push(
    `INSERT INTO users (${columns.map((column) => `"${column}"`).join(", ")}) `
      + `VALUES (${columns.map((column) => literal(values[column])).join(", ")}) `
      + "ON CONFLICT(email) DO NOTHING;",
  );
}
// Referral ids exported from the old app point at ids that do not exist here, so
// re-point them at the account with the same mobile number when there is one.
statements.push(
  "UPDATE users SET referrer_id = (SELECT r.id FROM users r WHERE r.mobile_number = users.referrer_mobile LIMIT 1) "
    + "WHERE referrer_mobile IS NOT NULL AND referrer_mobile <> '' "
    + "AND EXISTS (SELECT 1 FROM users r WHERE r.mobile_number = users.referrer_mobile);",
);

const sql = statements.join("\n");
if (dryRun) {
  console.log(sql);
  process.exit(0);
}

const sqlFile = path.join(mkdtempSync(path.join(tmpdir(), "sdl-user-import-")), "import.sql");
writeFileSync(sqlFile, sql);
execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "DB", "--config", "worker/wrangler.jsonc", "--file", sqlFile, remote ? "--remote" : "--local"],
  { cwd: root, stdio: "inherit" },
);
console.log(`Imported ${users.length} users into the ${remote ? "deployed" : "local"} D1 database (existing emails were skipped).`);
