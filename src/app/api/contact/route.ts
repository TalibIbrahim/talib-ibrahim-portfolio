import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { clientIp, limitContact } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot: hidden from people, filled by bots. */
  company?: unknown;
};

type ContactResponse = {
  success: boolean;
  message: string;
  error?: string;
};

const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Palette mirrors DESIGN.md.
const C = {
  bg: '#0B0B0C',
  panel: '#131315',
  fg: '#ECE8DF',
  muted: '#8F8A80',
  line: '#2A2926',
  accent: '#4D6BFF',
  accentText: '#8094FF',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fail(status: number, message: string, error: string) {
  return NextResponse.json<ContactResponse>({ success: false, message, error }, { status });
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  try {
    let body: ContactBody;
    try {
      body = (await request.json()) as ContactBody;
    } catch {
      return fail(400, 'Malformed request payload: Body must be valid JSON.', 'Invalid JSON format');
    }
    if (!body || typeof body !== 'object') {
      return fail(400, 'Malformed request payload: Body must be a JSON object.', 'Invalid JSON format');
    }

    const { name, email, subject, message, company } = body;

    // Honeypot filled: pretend it worked and send nothing.
    if (typeof company === 'string' && company.trim().length > 0) {
      return NextResponse.json<ContactResponse>(
        { success: true, message: 'Email sent successfully!' },
        { status: 200 },
      );
    }

    // Rate limit: 3 per 10 minutes per visitor (and 30 a day site-wide when Upstash is configured).
    const limited = await limitContact(clientIp(request));
    if (!limited.ok) {
      const minutes = Math.max(1, Math.ceil(limited.retryAfter / 60));
      return NextResponse.json<ContactResponse>(
        {
          success: false,
          message: `Too many messages. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}, or email directly.`,
          error: 'Rate limited',
        },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
      );
    }

    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return fail(400, 'Validation failed: A valid email address is required.', 'Invalid or missing email address.');
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return fail(400, 'Validation failed: Message cannot be empty.', 'Missing or empty message.');
    }

    if (message.trim().length > MAX_MESSAGE) {
      return fail(
        400,
        `Validation failed: Message must be ${MAX_MESSAGE} characters or fewer.`,
        'Message too long.',
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return fail(
        500,
        'Server configuration missing: Please add EMAIL_USER and EMAIL_PASS to .env.local',
        'Missing email server credentials.',
      );
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = email.trim();
    const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
    const trimmedMessage = message.trim();
    const subjectText = trimmedSubject || 'General Inquiry';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipient = process.env.EMAIL_USER;
    const subjectLine = `Portfolio Contact: [${subjectText}] from ${trimmedName || trimmedEmail}`;

    const textBody = `Name: ${trimmedName || 'N/A'}
Email: ${trimmedEmail}
Subject: ${subjectText}

Message:
${trimmedMessage}`;

    const mono = "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace";
    const serif = "Georgia, 'Times New Roman', serif";
    const label = `padding: 6px 0; width: 90px; font-size: 11px; color: ${C.muted}; text-transform: uppercase; letter-spacing: 0.06em; font-family: ${mono}; vertical-align: top;`;
    const value = `padding: 6px 0; font-size: 14px; color: ${C.fg}; font-family: ${mono};`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>${escapeHtml(subjectLine)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${C.bg}; color: ${C.fg}; font-family: ${mono};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${C.bg}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: ${C.panel}; border: 1px solid ${C.line}; text-align: left;">
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 2px solid ${C.accent};">
              <p style="margin: 0; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.accentText}; font-family: ${mono};">
                New message from muhammad-talib.dev
              </p>
              <h1 style="margin: 10px 0 0 0; font-size: 26px; font-weight: 400; color: ${C.fg}; line-height: 1.15; font-family: ${serif};">
                ${escapeHtml(subjectText)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px 12px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="${label}">Name</td>
                  <td style="${value}">${escapeHtml(trimmedName || 'N/A')}</td>
                </tr>
                <tr>
                  <td style="${label}">Email</td>
                  <td style="${value}">
                    <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: ${C.accentText}; text-decoration: underline;">${escapeHtml(trimmedEmail)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="${label}">Subject</td>
                  <td style="${value}">${escapeHtml(subjectText)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 32px 32px 32px;">
              <p style="margin: 0 0 10px 0; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.muted}; font-family: ${mono};">
                Message
              </p>
              <div style="border-left: 2px solid ${C.accent}; padding: 4px 0 4px 18px; font-size: 15px; line-height: 1.6; color: ${C.fg}; white-space: pre-wrap; font-family: ${mono};">${escapeHtml(trimmedMessage)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 14px 32px; border-top: 1px solid ${C.line}; font-size: 11px; color: ${C.muted}; font-family: ${mono};">
              Reply to this email to answer ${escapeHtml(trimmedName || trimmedEmail)} directly.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      replyTo: trimmedEmail,
      subject: subjectLine,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json<ContactResponse>(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return fail(
      500,
      'Failed to send email',
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
}
