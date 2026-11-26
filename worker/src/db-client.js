// Request-scoped client with the same surface the app's screens and backend
// functions already call: db.entities.X.*, db.asServiceRole.*, db.auth, db.functions,
// db.integrations.Core.UploadFile.
import { EntityStore } from "./store.js";
import { httpError } from "./auth.js";

// filter(query, sort, limit) also accepts the (query, { sort, limit }) form.
function options(sort, limit) {
  if (sort && typeof sort === "object") return { sort: sort.sort, limit: sort.limit ?? limit };
  return { sort, limit };
}

function entityApi(store, name) {
  return {
    list: (sort, limit) => store.list(name, sort, limit),
    filter: (query, sort, limit) => {
      const resolved = options(sort, limit);
      return store.filter(name, query, resolved.sort, resolved.limit);
    },
    get: (id) => store.get(name, id),
    create: (data) => store.create(name, data),
    update: (id, data) => store.update(name, id, data),
    updateMany: (query, patch) => store.updateMany(name, query, patch),
    bulkCreate: (items) => store.bulkCreate(name, items),
    bulkUpdate: (items) => store.bulkUpdate(name, items),
    delete: (id) => store.delete(name, id),
    deleteMany: (query) => store.deleteMany(name, query),
    count: (query) => store.count(name, query),
    aggregate: (options) => store.aggregate(name, options),
  };
}

const entityProxy = (store) => new Proxy({}, { get: (_target, name) => entityApi(store, String(name)) });

// Google connectors are replaced by OAuth refresh tokens held as Worker secrets.
async function getConnection(env, provider) {
  const config = {
    gmail: {
      clientId: env.GMAIL_CLIENT_ID,
      clientSecret: env.GMAIL_CLIENT_SECRET,
      refreshToken: env.GMAIL_REFRESH_TOKEN,
    },
    googlesheets: {
      clientId: env.GOOGLE_CLIENT_ID || env.GMAIL_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET || env.GMAIL_CLIENT_SECRET,
      refreshToken: env.GOOGLE_SHEETS_REFRESH_TOKEN || env.GMAIL_REFRESH_TOKEN,
    },
  }[provider];

  if (!config?.refreshToken) {
    throw httpError(503, `${provider} is not connected. Add the ${provider.toUpperCase()} OAuth secrets to the Worker.`);
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw httpError(502, `${provider} authorization failed. Reconnect the Google account.`);
  }
  return { accessToken: data.access_token };
}

export function createDbClient(env, { user = null, serviceRole = false } = {}) {
  const store = new EntityStore(env.DB, user, { serviceRole });

  return {
    env,
    entities: entityProxy(store),
    asServiceRole: {
      entities: entityProxy(new EntityStore(env.DB, user, { serviceRole: true })),
      connectors: { getConnection: (provider) => getConnection(env, provider) },
    },
    auth: {
      me: async () => user,
      isAuthenticated: async () => Boolean(user),
    },
    integrations: {
      Core: {
        UploadFile: async ({ file }) => {
          if (!file || !env.FILES) throw httpError(503, "File storage is not configured");
          const key = `${crypto.randomUUID()}-${String(file.name || "upload").replace(/[^\w.-]+/g, "_")}`;
          await env.FILES.put(key, file.stream(), {
            httpMetadata: { contentType: file.type || "application/octet-stream" },
          });
          return { file_url: `${env.APP_BASE_URL}/api/files/${key}`, file_name: file.name };
        },
      },
    },
  };
}
