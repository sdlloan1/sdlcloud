// Transactional email for password resets. Uses Resend when RESEND_API_KEY is set;
// otherwise the message is written to the Worker log so local development works.
export async function sendMail(env, { to, subject, html }) {
  if (!env.RESEND_API_KEY) {
    console.log(`[mail:skipped] to=${to} subject=${subject}`);
    return { sent: false, reason: "RESEND_API_KEY is not configured" };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.MAIL_FROM || "SDL <no-reply@shubhdhanlakshmi.com>", to, subject, html }),
  });
  if (!response.ok) throw new Error(`Email provider error: ${response.status}`);
  return { sent: true };
}
