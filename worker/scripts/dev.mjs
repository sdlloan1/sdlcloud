// Dev runner for `npm run dev`.
//
// Always starts the Vite dev server (port 3000, proxies /api to the Worker).
// Inside the Base44 preview sandbox (BASE44_PREVIEW_MODE=1) it also starts the
// Worker API on port 8787, loading the platform-managed secrets from
// /run/base44/app.env with Wrangler's --env-file, so no secret value is ever
// copied into the repository. With the flag unset it behaves exactly like the
// previous `vite` command and the Worker is started separately (`npm run dev:api`).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const PREVIEW_ENV_FILE = "/run/base44/app.env";
const preview = process.env.BASE44_PREVIEW_MODE === "1";

const children = [];

function run(command, args) {
  const child = spawn(command, args, { stdio: "inherit", env: process.env });
  children.push(child);
  return child;
}

function stopAll(signal = "SIGTERM") {
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill(signal);
  }
}

process.on("SIGINT", () => {
  stopAll("SIGINT");
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopAll("SIGTERM");
  process.exit(143);
});

if (preview && existsSync(PREVIEW_ENV_FILE)) {
  // Wrangler refuses to start when the configured assets directory is missing.
  // Vite serves the SPA in development, so an empty directory is enough here.
  mkdirSync("dist", { recursive: true });
  const api = run("npx", [
    "wrangler",
    "dev",
    "--config",
    "worker/wrangler.jsonc",
    "--port",
    "8787",
    "--env-file",
    PREVIEW_ENV_FILE,
  ]);
  api.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[dev] Worker API exited with code ${code}; /api requests will fail.`);
    }
  });
}

const vite = run("npx", ["vite", ...process.argv.slice(2)]);
vite.on("exit", (code) => {
  stopAll();
  process.exit(code ?? 0);
});
