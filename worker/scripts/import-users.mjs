// Imports the existing user export (CSV) into the Worker's D1 database.
//
//   node worker/scripts/import-users.mjs users.csv > users.sql
//   npx wrangler d1 execute DB --remote --config worker/wrangler.jsonc --file users.sql
//
// Imported accounts have no password: each user sets one through the
// "Forgot password" flow, or an admin sets one with worker/scripts/create-user.mjs.
// The CSV itself stays outside the repository (it holds personal data).
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node worker/scripts/import-users.mjs <users.csv>");
  process.exit(1);
}

const parse = (line) => {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        cell += '"';
        index++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
};

const escape = (value) => `'${String(value ?? "").replace(/'/g, "''")}'`;
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((line) => line.trim());
const header = parse(lines[0]);

// Entity fields that are copied as-is; auth columns are handled separately.
const FIELDS = header.filter((column) => !["email", "full_name", "role", "status", "created_date", "updated_date"].includes(column));

console.log("BEGIN;");
for (const line of lines.slice(1)) {
  const cells = parse(line);
  const row = Object.fromEntries(header.map((column, index) => [column, cells[index]]));
  if (!row.email) continue;
  const columns = ["id", "created_date", "updated_date", "email", "full_name", "role", "status", ...FIELDS];
  const values = [
    escape(row.email),
    escape(row.created_date || new Date().toISOString()),
    escape(row.updated_date || new Date().toISOString()),
    escape(row.email),
    escape(row.full_name || row.display_name || ""),
    escape(row.role === "admin" ? "admin" : "user"),
    escape(row.status || "active"),
    ...FIELDS.map((column) => {
      const value = row[column];
      return value === "" ? "NULL" : escape(value);
    }),
  ];
  console.log(
    `INSERT INTO users (${columns.join(", ")}) VALUES (${values.join(", ")}) ON CONFLICT(email) DO NOTHING;`,
  );
}
console.log("COMMIT;");
