import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "hello@rivalscope.com";

export async function sendAlertEmail({
  to,
  competitorName,
  alertTitle,
  summary,
  dashboardUrl,
}: {
  to: string;
  competitorName: string;
  alertTitle: string;
  summary: string;
  dashboardUrl: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `🔔 ${competitorName} just made a move — ${alertTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; font-size: 24px;">🔍 RivalScope Alert</h1>
        <p style="color: #444; font-size: 16px;">
          Your competitor <strong>${competitorName}</strong> just made a change.
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 8px;">${alertTitle}</h2>
          <p style="color: #555; font-size: 14px; margin: 0;">${summary}</p>
        </div>
        <a
          href="${dashboardUrl}"
          style="
            background: #6366f1;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
          "
        >
          View Full Details
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          You're receiving this because you're monitoring ${competitorName} on RivalScope.
          <a href="${dashboardUrl}/settings">Manage notifications</a>
        </p>
      </div>
    `,
  });
}
