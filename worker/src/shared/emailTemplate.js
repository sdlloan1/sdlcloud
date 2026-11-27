// Shared HTML email helpers used by SDL email-sending backend functions.

const LOGO_URL = "https://media.base44.com/images/public/6a65ccde323b932e9e9dc990/42c50083d_applogo.png";

export function logoImg(size = 76) {
  return `<img src="${LOGO_URL}" alt="SDL" width="${size}" height="${size}" style="border-radius:18px; display:block; margin:0 auto 10px auto;" />`;
}

export function emailHeader() {
  return `<tr>
    <td style="background: linear-gradient(135deg, #ff4d2e 0%, #ff8a3d 100%); padding: 28px 32px; text-align:center;">
      ${logoImg(76)}
      <div style="font-size: 30px; font-weight: 800; color:#ffffff; letter-spacing: 1px; margin-bottom: 4px;">SDL</div>
      <div style="font-size: 13px; color:#ffe8dc; font-weight:500; letter-spacing: 0.5px;">India's No. 1 Friendly Loan</div>
    </td>
  </tr>`;
}

export function emailFooter(closingLine) {
  return `<tr>
    <td style="background-color:#2b1810; padding: 24px 32px; text-align:center;">
      ${logoImg(56)}
      <div style="font-size:16px; font-weight:800; color:#ffffff; margin-bottom:4px;">SDL</div>
      <div style="font-size:12px; color:#d8b8a8; margin-bottom:12px;">India's No. 1 Friendly Loan</div>
      <div style="font-size:11px; color:#9a7d70; line-height:1.6;">${closingLine}<br>Warm regards, Team SDL</div>
    </td>
  </tr>`;
}

export function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function buildRawMessage(to, from, subject, htmlBody) {
  const encodedSubject = /[^\x00-\x7F]/.test(subject)
    ? `=?utf-8?B?${base64UrlEncode(subject)}?=`
    : subject;
  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlBody,
  ].join("\r\n");
  return base64UrlEncode(mime);
}
// One-time code email used for passwordless login and password resets.
export function otpEmail({ code, purpose = "login" }) {
  const action = purpose === "reset" ? "reset your SDL password" : "sign in to your SDL account";
  return `<!DOCTYPE html><html lang="en"><body style="margin:0; padding:0; background-color:#fdf1e9; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdf1e9; padding: 30px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        ${emailHeader()}
        <tr><td style="padding: 32px;">
          <p style="font-size:16px; color:#2b2b2b; margin: 0 0 12px 0;">Hello,</p>
          <p style="font-size:15px; color:#4a4a4a; line-height:1.6; margin: 0 0 24px 0;">Use the code below to ${action}. It expires in 10 minutes and can be used once.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
            <tr><td style="background-color:#fff4ee; border-radius: 10px; padding: 20px 24px; text-align:center; border: 1px solid #ffd3b8;">
              <div style="font-size:12px; color:#a15c3f; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:8px;">Your one-time code</div>
              <div style="font-size:34px; font-weight:800; color:#ff4d2e; letter-spacing:8px;">${code}</div>
            </td></tr>
          </table>
          <p style="font-size:13px; color:#8a8a8a; line-height:1.6; margin: 0;">If you did not request this code, you can ignore this email — your account stays safe.</p>
        </td></tr>
        ${emailFooter("Thank you for choosing us for your financial needs.")}
      </table>
    </td></tr>
  </table>
</body></html>`;
}
