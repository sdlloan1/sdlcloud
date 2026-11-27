// Applies worker/migrations to a D1 database that has no schema yet.
//
// A fresh local D1 (preview sandbox, `wrangler dev`) and a brand-new deployed D1
// both start empty, and the API answered "The database has no tables yet" until
// someone ran `npm run db:migrate:local` / `npm run db:migrate` by hand. The
// migration files are idempotent, so the Worker applies them itself the first
// time it sees an empty database.
import initSql from "../migrations/0001_init.sql";
import seedSql from "../migrations/0002_app_settings_seed.sql";

// D1 runs one statement per prepare(), so the migration files are split here.
function statements(sql) {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

const MIGRATIONS = [...statements(initSql), ...statements(seedSql)];

// Checked once per isolate; reset on failure so a later request can retry.
let ready;

async function hasSchema(db) {
  try {
    await db.prepare("SELECT 1 FROM users LIMIT 1").first();
    return true;
  } catch (error) {
    if (/no such table/i.test(String(error?.message || ""))) return false;
    throw error;
  }
}

async function migrate(db) {
  if (await hasSchema(db)) return;
  for (const statement of MIGRATIONS) {
    await db.prepare(statement).run();
  }
}

export function ensureSchema(env) {
  // The Postgres path (SUPABASE_DB_URL) is set up from supabase/schema.sql.
  if (!env?.DB) return Promise.resolve();
  if (!ready) {
    ready = migrate(env.DB).catch((error) => {
      ready = undefined;
      throw error;
    });
  }
  return ready;
}
