
import { sendMail } from "../mailer.js";

export default async function (req, ctx) {
  const db = ctx.db;
  try {
        const user = await db.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { recipientType, userId, subject, htmlBody, fromName } = body;
    if (!recipientType || !subject || !htmlBody) {
      return Response.json({ error: "recipientType, subject, and htmlBody are required" }, { status: 400 });
    }

    // Resolve recipients based on type
    let recipients = [];

    if (recipientType === "single") {
      if (!userId) return Response.json({ error: "userId required for single recipient" }, { status: 400 });
      const u = await db.asServiceRole.entities.User.get(userId);
      if (u && u.email) {
        recipients = [{ email: u.email, name: u.display_name || u.full_name || "User" }];
      }
    } else if (recipientType === "kyc_incomplete") {
      const users = await db.asServiceRole.entities.User.filter({
        kyc_status: { $nin: ["approved"] },
        role: "user",
      });
      recipients = users
        .filter((u) => u.email)
        .map((u) => ({ email: u.email, name: u.display_name || u.full_name || "User" }));
    } else if (recipientType === "active_loans") {
      // "Active users" — only accounts marked active in the app.
      const users = await db.asServiceRole.entities.User.filter({ role: "user", account_status: "active" });
      recipients = users
        .filter((u) => u.email)
        .map((u) => ({ email: u.email, name: u.display_name || u.full_name || "User" }));
    } else if (recipientType === "all") {
      // "All users" — every registered user account.
      const users = await db.asServiceRole.entities.User.filter({ role: "user" });
      recipients = users
        .filter((u) => u.email)
        .map((u) => ({ email: u.email, name: u.display_name || u.full_name || "User" }));
    } else {
      return Response.json({ error: "Invalid recipientType" }, { status: 400 });
    }

    if (recipients.length === 0) {
      return Response.json({ error: "No recipients found with email addresses" }, { status: 400 });
    }

    let sent = 0;
    let failed = 0;
    const failedEmails = [];

    for (const r of recipients) {
      try {
        const personalizedBody = htmlBody.replace(/\{\{name\}\}/g, r.name);
        await sendMail(ctx.env, { to: r.email, subject, html: personalizedBody, fromName });
        sent++;
      } catch (e) {
        failed++;
        failedEmails.push(r.email);
      }
    }

    return Response.json({
      success: true,
      sent,
      failed,
      total: recipients.length,
      failedEmails: failedEmails.slice(0, 10),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}