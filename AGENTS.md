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
- `worker/src/`: Cloudflare Worker API (auth, entities, functions, files) on D1/R2.
- `vite.config.js`: Vite config; `/api` is proxied to the Worker dev server.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- The backend runs on Cloudflare Workers. Local development is `npm run dev:api` (Worker on :8787, local D1) plus `npm run dev` (Vite on :3000, proxies `/api`).
- Apply schema changes with `npm run db:migrate:local`; regenerate the schema from `base44/entities/` with `npm run entities:generate`.
- `AUTH_SECRET` must be supplied to the Worker for sessions to work (`--var AUTH_SECRET:...` or `worker/.dev.vars`).
- Reuse the existing API client in `src/api/base44Client.js` before adding new API paths.
- Run the relevant checks from `package.json` before finishing code changes.
