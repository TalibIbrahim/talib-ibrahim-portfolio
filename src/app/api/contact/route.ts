import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { ContactFormData, ContactApiResponse } from "@/data/types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request): Promise<NextResponse<ContactApiResponse>> {
  try {
    let body: Partial<ContactFormData>;
    try {
      body = (await request.json()) as Partial<ContactFormData>;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Malformed request payload: Body must be valid JSON.",
          error: "Invalid JSON format",
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: A valid email address is required.",
          error: "Invalid or missing email address.",
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: Message cannot be empty.",
          error: "Missing or empty message.",
        },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration missing: Please add EMAIL_USER and EMAIL_PASS to .env.local",
          error: "Missing email server credentials.",
        },
        { status: 500 }
      );
    }

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = email.trim();
    const trimmedSubject = typeof subject === "string" ? subject.trim() : "";
    const trimmedMessage = message.trim();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipient = process.env.EMAIL_USER || "talibibrahim04@gmail.com";
    const subjectLine = `Portfolio Contact: [${trimmedSubject || "General Inquiry"}] from ${trimmedName || trimmedEmail}`;

    const textBody = `Name: ${trimmedName || "N/A"}
Email: ${trimmedEmail}
Subject: ${trimmedSubject || "General Inquiry"}

Message:
${trimmedMessage}`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subjectLine)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #121212; border: 1px solid #262626; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: left;">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #181818; border-bottom: 2px solid #ccff00; padding: 24px 32px;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #ccff00; font-family: ui-monospace, SFMono-Regular, Consolas, monospace;">
                Transmission Protocol // Portfolio Contact
              </p>
              <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                ${escapeHtml(trimmedSubject || "General Inquiry")}
              </h1>
            </td>
          </tr>
          <!-- Sender Details -->
          <tr>
            <td style="padding: 24px 32px 16px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 6px 0; width: 90px; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.08em; font-family: ui-monospace, SFMono-Regular, Consolas, monospace;">Sender:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #ffffff; font-weight: 500;">${escapeHtml(trimmedName || "N/A")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.08em; font-family: ui-monospace, SFMono-Regular, Consolas, monospace;">Email:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #ccff00;">
                    <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #ccff00; text-decoration: none; font-weight: 500;">${escapeHtml(trimmedEmail)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.08em; font-family: ui-monospace, SFMono-Regular, Consolas, monospace;">Subject:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${escapeHtml(trimmedSubject || "General Inquiry")}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <hr style="border: none; border-top: 1px solid #222222; margin: 8px 0;" />
            </td>
          </tr>
          <!-- Message Body -->
          <tr>
            <td style="padding: 16px 32px 28px 32px;">
              <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #888888; font-family: ui-monospace, SFMono-Regular, Consolas, monospace;">
                Message Content:
              </p>
              <div style="background-color: #080808; border: 1px solid #1f1f1f; border-left: 3px solid #ccff00; border-radius: 4px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #e5e5e5; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${escapeHtml(trimmedMessage)}</div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px; background-color: #0f0f0f; border-top: 1px solid #1a1a1a; font-size: 11px; color: #555555; text-align: center;">
              Dispatched securely via portfolio contact API endpoint
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      replyTo: trimmedEmail,
      subject: subjectLine,
      text: textBody,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
