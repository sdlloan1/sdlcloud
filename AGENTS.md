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
  It caches a boolean, never a promise: the `handle_cross_request_promise_resolution` flag (default
  since compatibility date 2024-10-14) makes a promise that outlives its request unusable, and
  awaiting it in a later request throws "This promise was created by a request that has since ended".
- `AUTH_SECRET` must be supplied to the Worker for sessions to work (`--var AUTH_SECRET:...` or `worker/.dev.vars`).
- Reuse the existing API client in `src/api/base44Client.js` before adding new API paths.
- Accounts exported from the old Base44 app are loaded with `node worker/scripts/import-legacy-users.mjs <users.csv> [--remote]`. They carry no password (Base44 never exported them), so each user sets one from **Forgot password?**; without `RESEND_API_KEY` the Worker only logs the reset link.
- Run the relevant checks from `package.json` before finishing code changes.

## Email and One-Time Codes

- Every transactional email (login codes, password resets, loan-limit, loan, promotional and
  repayment-reminder emails) goes through `sendMail()` in `worker/src/mailer.js`. It uses Resend
  when `RESEND_API_KEY` is set, otherwise the Gmail API when `GMAIL_CLIENT_ID`,
  `GMAIL_CLIENT_SECRET` and `GMAIL_REFRESH_TOKEN` are set. With no provider the message (including
  the code or reset link) is written to the Worker log as `[mail:skipped] …` and the call throws, so
  admin emails report the failure instead of a false success. `MAIL_FROM` overrides the sender.
- Emailed one-time codes live in the `email_otps` table (`worker/migrations/0003_email_otp.sql`).
  `POST /api/auth/otp/request` and `POST /api/auth/otp/verify` take `{ email, code, purpose }` with
  purpose `login` or `reset`. Codes are six digits, expire in 10 minutes, allow 5 attempts, are
  single use, and are capped at three sends per address per 10 minutes. A `reset` verification
  returns a `reset_token` for `POST /api/auth/password-reset/confirm`.
- The login screen offers emailed-code sign-in next to the password form, and Forgot Password uses
  the code flow. The emailed reset link (`/reset-password?token=…`) still works; it is built from
  the request's `Origin`, falling back to `APP_BASE_URL`.
- Existing databases need `npm run db:migrate:local` (or `npm run db:migrate` for the deployed D1)
  to create `email_otps`; a fresh database gets it from the schema bootstrap.

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
