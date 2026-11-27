// Transactional email for the whole app (login codes, password resets and the
// admin emails). Uses Resend when RESEND_API_KEY is set, falls back to the Gmail
// API when the GMAIL_* OAuth secrets are present, and otherwise writes the
// message to the Worker log so local development works without a provider.
import { buildRawMessage } from "./shared/emailTemplate.js";

const DEFAULT_FROM = "SDL <onboarding@resend.dev>";
const GMAIL_SENDER = "shubhdhanlakshmifund@gmail.com";

const fromAddress = (env) => env.MAIL_FROM || DEFAULT_FROM;

async function sendWithResend(env, { to, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(env),
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Email provider error: ${response.status} ${detail.slice(0, 200)}`.trim());
  }
  return { sent: true, provider: "resend" };
}

async function gmailAccessToken(env) {
  if (!env.GMAIL_REFRESH_TOKEN) throw new Error("Gmail is not connected (GMAIL_REFRESH_TOKEN is missing)");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GMAIL_CLIENT_ID || "",
      client_secret: env.GMAIL_CLIENT_SECRET || "",
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("Gmail authorization failed. Reconnect the Google account.");
  return data.access_token;
}

async function sendWithGmail(env, { to, subject, html, fromName }) {
  const accessToken = await gmailAccessToken(env);
  const from = fromName ? `${fromName} <${GMAIL_SENDER}>` : GMAIL_SENDER;
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: buildRawMessage(to, from, subject, html) }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gmail send failed: ${detail.slice(0, 200)}`);
  }
  return { sent: true, provider: "gmail" };
}

export async function sendMail(env, { to, subject, html, text, fromName }) {
  if (env.RESEND_API_KEY) return sendWithResend(env, { to, subject, html, text });
  if (env.GMAIL_REFRESH_TOKEN) return sendWithGmail(env, { to, subject, html, fromName });
  // No provider: log the message (so local development can still read the code
  // or link) and fail loudly, so admin emails do not report a false success.
  console.log(`[mail:skipped] to=${to} subject=${subject}${text ? ` | ${text}` : ""}`);
  throw new Error("Email is not configured. Add RESEND_API_KEY (or the GMAIL_* OAuth secrets) to the Worker.");
}
