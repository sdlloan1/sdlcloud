// Picks the database for a request: Supabase Postgres when SUPABASE_DB_URL is
// set, otherwise the D1 binding (used for local development).
import { createPgDatabase } from "./pg.js";
import { httpError } from "./auth.js";

export function createDatabase(env) {
  if (env.SUPABASE_DB_URL) {
    const db = createPgDatabase(env.SUPABASE_DB_URL);
    return { db, close: () => db.end() };
  }
  if (env.DB) return { db: env.DB, close: async () => {} };
  throw httpError(503, "Database is not configured. Add the SUPABASE_DB_URL secret.");
}
