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

// A flag, not a cached promise: with the handle_cross_request_promise_resolution
// compatibility flag (default since 2024-10-14) a promise that outlives its
// request can never settle, so awaiting it from a later request fails with
// "This promise was created by a request that has since ended". An interrupted
// run therefore leaves the flag false and the next request retries; the
// migrations are idempotent, so concurrent runs are harmless.
let schemaReady = false;

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

export async function ensureSchema(env) {
  // The Postgres path (SUPABASE_DB_URL) is set up from supabase/schema.sql.
  if (!env?.DB || schemaReady) return;
  await migrate(env.DB);
  schemaReady = true;
}
