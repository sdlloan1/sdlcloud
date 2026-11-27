# SDL — Shubh Dhan Lakshmi

Salary-backed lending app: a React single-page app served by a Cloudflare Worker, with
Cloudflare D1 (SQLite) for data and R2 for uploaded files.

## Repository layout

- `src/` — React app (Vite). `src/api/base44Client.js` is the client for the app's own API.
- `worker/src/` — the Cloudflare Worker: `/api/*` routes (auth, entities, functions, files),
  entity store, D1 access, email.
- `worker/migrations/` — D1 schema, generated from the entity definitions.
- `base44/entities/` — entity definitions (source of the schema).
- `public/` — static files copied into `dist/` at build time (e.g. `manifest.json`).

## Run locally

Install dependencies once, apply the D1 migrations to the local SQLite database, then run the
Worker API and the Vite dev server:

```bash
npm install
npm run db:migrate:local   # apply worker/migrations to the local D1 database
npm run dev:api            # Worker API on http://localhost:8787 (local D1 + R2 emulation)
npm run dev                # Vite on http://localhost:3000, proxies /api to :8787
```

`AUTH_SECRET` signs session tokens and is required for login. Pass a development value to the
Worker (or put it in an untracked `worker/.dev.vars`):

```bash
npx wrangler dev --config worker/wrangler.jsonc --port 8787 --var AUTH_SECRET:$(openssl rand -hex 32)
```

Cron triggers (nightly repayment reminders) do not fire in local development. Run one by hand:

```bash
curl "http://localhost:8787/cdn-cgi/local/scheduled"
```

To preview the production bundle exactly as deployed, build and let the Worker serve `dist/`:

```bash
npm run build
npx wrangler dev --config worker/wrangler.jsonc --port 3000
```

## Checks

```bash
npm run lint
```

## Deploy to Cloudflare

1. `npx wrangler login`
2. Create the database and bucket, then put their ids/names in `worker/wrangler.jsonc`:
   ```bash
   npx wrangler d1 create sdl
   npx wrangler r2 bucket create sdl-files
   ```
3. Apply the schema to the remote database: `npm run db:migrate`
4. Add the secrets the Worker reads:
   ```bash
   npx wrangler secret put AUTH_SECRET --config worker/wrangler.jsonc
   npx wrangler secret put RESEND_API_KEY --config worker/wrangler.jsonc      # transactional email
   npx wrangler secret put GMAIL_CLIENT_ID --config worker/wrangler.jsonc     # Gmail send-as integration
   npx wrangler secret put GMAIL_CLIENT_SECRET --config worker/wrangler.jsonc
   npx wrangler secret put GMAIL_REFRESH_TOKEN --config worker/wrangler.jsonc
   npx wrangler secret put GOOGLE_CLIENT_ID --config worker/wrangler.jsonc    # Sheets export
   npx wrangler secret put GOOGLE_CLIENT_SECRET --config worker/wrangler.jsonc
   npx wrangler secret put GOOGLE_SHEETS_REFRESH_TOKEN --config worker/wrangler.jsonc
   ```
   `APP_BASE_URL` and `MAIL_FROM` are plain variables in `worker/wrangler.jsonc`.
5. Deploy the Worker together with the built assets: `npm run deploy`
6. Attach the domain under Workers → `sdlcloud` → Custom domains.

Without `RESEND_API_KEY` the Worker logs outgoing mail instead of sending it, so the app stays
usable while email is not configured.

### Deploy from a phone (no computer)

Everything below happens in a mobile browser (Cloudflare dashboard + github.com) — no terminal.

1. **Create the database and file bucket.** Dashboard → *Storage & Databases* → *D1 SQL database* →
   **Create**, name it `sdl`, then copy the **Database ID** from the database page. Then
   *R2 Object Storage* → **Create bucket** → `sdl-files` (R2 asks to enable billing once; the free
   tier is enough. Without it uploads return 503, the rest of the app works).
2. **Connect the repo to Workers Builds.** Workers & Pages → **Create** → **Import a repository** →
   this repo, branch `main`. Build command `npm ci && npm run build`, deploy command
   `npx wrangler deploy --config worker/wrangler.jsonc`. The `--config` flag matters: without it
   Wrangler finds no root config and deploys the SPA only, with no `/api`.
3. **Point the config at your resources.** On github.com edit `worker/wrangler.jsonc`: replace the
   placeholder `database_id` with the ID from step 1 and set `APP_BASE_URL` to your public URL
   (`https://<worker-name>.<subdomain>.workers.dev`, or a custom domain). Commit to `main` — that
   push builds and deploys.
4. **Load the schema once.** D1 → `sdl` → *Console*: paste all of `worker/migrations/0001_init.sql`,
   run it, then do the same with `0002_app_settings_seed.sql`.
5. **Add the login secret.** Worker → Settings → *Variables and Secrets* → **Add** → Secret
   `AUTH_SECRET`, value = a long random string from any password generator (keep it stable, changing
   it signs everyone out). Optional: `RESEND_API_KEY`, `GMAIL_*`, `GOOGLE_*`.
6. **Check it.** `https://<your-url>/api/health` must return `{"ok":true,...}`. The app's HTML there
   means the deploy command from step 2 is not in place.
7. **Custom domain (optional).** Worker → Settings → *Domains & Routes* → **Add custom domain**,
   then set `APP_BASE_URL` to it.

## Data cutover from Base44

The Worker no longer talks to the Base44 backend. To move production data:

1. Regenerate the schema after any entity change: `npm run entities:generate` (rewrites
   `worker/migrations/0001_init.sql` and `worker/src/entities.generated.js` from `base44/entities/`).
2. Export each entity from the Base44 dashboard as JSON, map it to the table columns, and load it
   with `npx wrangler d1 execute DB --remote --config worker/wrangler.jsonc --file <file.sql>`.
3. Re-upload files that lived in Base44 storage (loan agreements, screenshots) to the R2 bucket.
4. Set `AUTH_SECRET` once and keep it stable — changing it signs every user out.

## Legacy Base44 workflow

The Base44 CLI (`base44 dev`, publishing through the dashboard) belongs to the previous hosting
setup and is not used by this Worker-based app.
