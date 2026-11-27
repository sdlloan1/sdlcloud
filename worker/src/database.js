// Picks the database for a request: the D1 binding when it exists (production and
// local development), otherwise a Postgres connection from SUPABASE_DB_URL.
//
// Workers cannot open a TLS connection to Supabase's Postgres endpoints: they
// present a self-signed certificate and Workers verify every certificate, so the
// handshake fails with "invalid peer certificate: UnknownIssuer". D1 is therefore
// the database in production; the Postgres path only serves hosts that trust the
// certificate (for example a plain Node server or a local Postgres).
import { createPgDatabase } from "./pg.js";
import { httpError } from "./auth.js";

export function createDatabase(env) {
  if (env.DB) return { db: env.DB, close: async () => {} };
  if (env.SUPABASE_DB_URL) {
    const db = createPgDatabase(env.SUPABASE_DB_URL);
    return { db, close: () => db.end() };
  }
  throw httpError(503, "Database is not configured. Bind the D1 database in worker/wrangler.jsonc.");
}
