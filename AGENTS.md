# AGENTS.md

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.db.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.db.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend client for the app's own Worker API.
- `worker/src/`: Cloudflare Worker API (auth, entities, functions, files) on D1 for data and Supabase Storage for files.
- `vite.config.js`: Vite config; `/api` is proxied to the Worker dev server.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- The backend runs on Cloudflare Workers. Local development is `npm run dev:api` (Worker on :8787, local D1) plus `npm run dev` (Vite on :3000, proxies `/api`).
- Apply schema changes with `npm run db:migrate:local`; regenerate the schema from `base44/entities/` with `npm run entities:generate`.
- The Worker also applies `worker/migrations` by itself the first time it hits a database without
  tables (`worker/src/schema-bootstrap.js`, SQL files imported as text via the `rules` entry in
  `worker/wrangler.jsonc`), so a fresh local D1 or a new deployment never shows "no tables yet".
- `AUTH_SECRET` must be supplied to the Worker for sessions to work (`--var AUTH_SECRET:...` or `worker/.dev.vars`).
- Reuse the existing API client in `src/api/base44Client.js` before adding new API paths.
- Accounts exported from the old Base44 app are loaded with `node worker/scripts/import-legacy-users.mjs <users.csv> [--remote]`. They carry no password (Base44 never exported them), so each user sets one from **Forgot password?**; without `RESEND_API_KEY` the Worker only logs the reset link.
- Run the relevant checks from `package.json` before finishing code changes.

## Deployment Notes

- Deploy with `npx wrangler deploy --config worker/wrangler.jsonc` (or `npm run deploy`). Without
  `--config` Wrangler finds no root config and deploys the SPA only, so `/api/health` returns the
  app's HTML instead of JSON.
- Data lives in D1 (binding `DB`). Do not point the Worker at Supabase Postgres: Supabase's database
  endpoints present a self-signed certificate and Workers verify every certificate, so the
  connection fails with `TLS handshake failed: invalid peer certificate: UnknownIssuer`. Hyperdrive
  does not help either — its default `require` mode validates against public roots. `worker/src/
  database.js` therefore prefers the D1 binding; the `pg` path only serves hosts that trust the
  certificate.
- Supabase is used for Storage only (`sdl-files` bucket, private, reached over HTTPS with the
  service role key). `supabase/schema.sql` and `supabase/seed.sql` are generated but unused by the
  Worker.
- Remote schema changes need `npm run db:migrate`, or the SQL pasted into the D1 console in the
  Cloudflare dashboard when no terminal is available. Both migration files are idempotent.
