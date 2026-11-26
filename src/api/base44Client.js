// Client for the app's own Cloudflare Worker API.
// It keeps the call surface the screens already use: db.entities.X.*, db.auth.*,
// db.functions.invoke() and db.integrations.Core.UploadFile().
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "sdl_access_token";

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const storage = {
  get: () => (typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY)),
  set: (value) => {
    if (typeof window === "undefined") return;
    if (value) window.localStorage.setItem(TOKEN_KEY, value);
    else window.localStorage.removeItem(TOKEN_KEY);
  },
};

let token = storage.get();

async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: form ? form : body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || "Request failed", response.status, data.code);
  return data;
}

const query = (params) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
};

const entity = (name) => ({
  list: async (sort, limit) => (await request(`/entities/${name}${query({ sort, limit })}`)).data,
  filter: async (filter, sort, limit) =>
    (await request(`/entities/${name}${query({ q: JSON.stringify(filter || {}), sort, limit })}`)).data,
  get: async (id) => (await request(`/entities/${name}/${id}`)).data,
  create: async (data) => (await request(`/entities/${name}`, { method: "POST", body: data })).data,
  update: async (id, data) => (await request(`/entities/${name}/${id}`, { method: "PATCH", body: data })).data,
  delete: async (id) => (await request(`/entities/${name}/${id}`, { method: "DELETE" })).data,
  count: async (filter) => (await request(`/entities/${name}/count${query({ q: JSON.stringify(filter || {}) })}`)).count,
  aggregate: (options) => request(`/entities/${name}/aggregate`, { method: "POST", body: options }),
  bulkCreate: async (items) => (await request(`/entities/${name}/bulk`, { method: "POST", body: { items } })).data,
  bulkUpdate: async (items) => (await request(`/entities/${name}/bulk`, { method: "PATCH", body: { items } })).data,
  deleteMany: async (filter) => (await request(`/entities/${name}/delete-many`, { method: "POST", body: { query: filter } })).deleted,
});

export const db = {
  entities: new Proxy({}, { get: (_target, name) => entity(String(name)) }),

  auth: {
    setToken(value) {
      token = value || null;
      storage.set(token);
    },

    async me() {
      const data = await request("/auth/me");
      return data.user;
    },

    async isAuthenticated() {
      try {
        await this.me();
        return true;
      } catch {
        return false;
      }
    },

    async loginViaEmailPassword(email, password, totpCode) {
      const data = await request("/auth/login", { method: "POST", body: { email, password, totp_code: totpCode } });
      this.setToken(data.access_token);
      return data.user;
    },

    async register({ email, password, full_name }) {
      const data = await request("/auth/register", { method: "POST", body: { email, password, full_name } });
      this.setToken(data.access_token);
      return data.user;
    },

    async updateMe(data) {
      const result = await request("/auth/me", { method: "PATCH", body: data });
      return result.user;
    },

    logout(returnTo) {
      request("/auth/logout", { method: "POST" }).catch(() => {});
      this.setToken(null);
      if (typeof window !== "undefined" && typeof returnTo === "string") window.location.href = returnTo;
    },

    redirectToLogin(returnTo) {
      if (typeof window === "undefined") return;
      const target = typeof returnTo === "string" ? `?from_url=${encodeURIComponent(returnTo)}` : "";
      window.location.href = `/login${target}`;
    },

    async resetPasswordRequest(email) {
      return request("/auth/password-reset/request", { method: "POST", body: { email } });
    },

    async resetPassword({ resetToken, newPassword }) {
      const data = await request("/auth/password-reset/confirm", {
        method: "POST",
        body: { token: resetToken, password: newPassword },
      });
      this.setToken(data.access_token);
      return data.user;
    },

    async mfaStatus() {
      return request("/auth/mfa/status");
    },

    async mfaEnroll() {
      return request("/auth/mfa/enroll", { method: "POST" });
    },

    async mfaActivate(code) {
      return request("/auth/mfa/activate", { method: "POST", body: { code } });
    },

    async mfaDisable(password) {
      return request("/auth/mfa/disable", { method: "POST", body: { password } });
    },
  },

  functions: {
    invoke: (name, body) => request(`/functions/${name}`, { method: "POST", body: body || {} }),
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const form = new FormData();
        form.append("file", file);
        return request("/files", { method: "POST", form });
      },
    },
  },
};

export const base44 = db;
export default db;
