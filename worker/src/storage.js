// File storage: Supabase Storage when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// are set, otherwise the R2 binding (used for local development).
import { httpError } from "./auth.js";

const bucket = (env) => env.SUPABASE_STORAGE_BUCKET || "sdl-files";

export function storageConfigured(env) {
  return Boolean((env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) || env.FILES);
}

const supabaseConfigured = (env) => Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

// A Worker whose SUPABASE_URL is a file path or a bare host makes every storage
// call throw "Invalid URL" and the upload screen only shows that raw text. Fail
// with the actual problem instead, and tolerate a trailing slash.
const supabaseBaseUrl = (env) => {
  const base = String(env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  if (!/^https?:\/\/[^/\s]+/i.test(base)) {
    throw httpError(
      503,
      "File storage is misconfigured: SUPABASE_URL must be the Supabase project URL (https://<project>.supabase.co).",
    );
  }
  return base;
};

export async function putFile(env, key, file) {
  const contentType = file.type || "application/octet-stream";
  if (supabaseConfigured(env)) {
    const response = await fetch(
      `${supabaseBaseUrl(env)}/storage/v1/object/${bucket(env)}/${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": contentType,
          "x-upsert": "true",
        },
        // Buffered so the same code works in Workers and under Node.
        body: await file.arrayBuffer(),
      },
    );
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[storage] upload failed ${response.status}: ${detail.slice(0, 300)}`);
      throw httpError(502, "File upload failed. Check the Supabase storage bucket.");
    }
    return;
  }
  if (env.FILES) {
    await env.FILES.put(key, file.stream(), { httpMetadata: { contentType } });
    return;
  }
  throw httpError(503, "File storage is not configured");
}

export async function getFile(env, key) {
  if (supabaseConfigured(env)) {
    const response = await fetch(
      `${supabaseBaseUrl(env)}/storage/v1/object/${bucket(env)}/${encodeURIComponent(key)}`,
      { headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } },
    );
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`[storage] download failed ${response.status}`);
      throw httpError(502, "File download failed.");
    }
    return {
      body: response.body,
      contentType: response.headers.get("content-type") || "application/octet-stream",
    };
  }
  if (env.FILES) {
    const object = await env.FILES.get(key);
    if (!object) return null;
    return {
      body: object.body,
      contentType: object.httpMetadata?.contentType || "application/octet-stream",
    };
  }
  throw httpError(503, "File storage is not configured");
}
