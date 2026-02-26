import nodemailer from 'nodemailer';
import process from 'node:process';

type TransportMode = 'smtp' | 'ethereal' | 'resend';

let cachedTransporterPromise:
  | Promise<{ transporter: nodemailer.Transporter; mode: TransportMode }>
  | null = null;

async function createSmtpTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify early so we can fall back in development.s
  await transporter.verify();
  return transporter;
}

async function createEtherealTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
}

async function getTransporter(): Promise<{ transporter: nodemailer.Transporter; mode: TransportMode }> {
  if (cachedTransporterPromise) return cachedTransporterPromise;

  cachedTransporterPromise = (async () => {
    const hasSmtpCreds = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
    const isProd = process.env.NODE_ENV === 'production';

    if (hasSmtpCreds) {
      try {
        const transporter = await createSmtpTransporter();
        return { transporter, mode: 'smtp' };
      } catch (error) {
        console.error('SMTP configuration failed:', error);
        if (!isProd) {
          console.warn('Falling back to Ethereal email for development. Check terminal logs for preview URLs.');
          const transporter = await createEtherealTransporter();
          return { transporter, mode: 'ethereal' };
        }
        // In production, keep failing rather than silently using a test inbox.
        throw error;
      }
    }

    if (!isProd) {
      console.warn('SMTP credentials not set. Using Ethereal email for development.');
      const transporter = await createEtherealTransporter();
      return { transporter, mode: 'ethereal' };
    }

    throw new Error('SMTP credentials are required in production (set SMTP_USER and SMTP_PASS).');
  })();

  return cachedTransporterPromise;
}

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@hjfashion.com';
const APP_NAME = 'HJ Fashion';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function sendViaResend(params: { to: string; subject: string; html: string }) {
// Removed Resend-specific constants and sending path; relying solely on nodemailer transports.

async function sendHtmlEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
    // Removed Resend sending logic; now only using nodemailer transports.

  const { transporter, mode } = await getTransporter();
  if (mode === 'smtp') {
    console.log(`Email transport: SMTP (${process.env.SMTP_HOST || 'smtp.gmail.com'})`);
  }
  const info = await transporter.sendMail({
    from: `"${APP_NAME}" <${FROM_EMAIL}>`,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (mode === 'ethereal') {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Ethereal email preview URL: ${previewUrl}`);
    }
  }
}

// Email templates
function getEmailTemplate(content: string, preheader: string = ''): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #1c1917;
      margin: 0;
      padding: 0;
      background-color: #fafaf9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #ffffff;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #1c1917;
      text-decoration: none;
      margin-bottom: 32px;
      display: block;
    }
    .logo span {
      color: #a8a29e;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1c1917;
    }
    p {
      margin: 0 0 16px;
      color: #44403c;
    }
    .button {
      display: inline-block;
      background-color: #1c1917;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 50px;
      font-weight: 600;
      margin: 24px 0;
    }
    .button:hover {
      background-color: #292524;
    }
    .link {
      word-break: break-all;
      color: #78716c;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e7e5e4;
      color: #a8a29e;
      font-size: 14px;
    }
    .preheader {
      display: none;
      max-width: 0;
      max-height: 0;
      overflow: hidden;
      font-size: 1px;
      line-height: 1px;
      color: #fafaf9;
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="container">
    <div class="card">
      <a href="${APP_URL}" class="logo">HJ <span>Fashion</span></a>
      ${content}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        <p>This email was sent to you as a registered member of ${APP_NAME}.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  firstName?: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const name = firstName || 'there';

  const content = `
    <h1>Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password for your ${APP_NAME} account. Click the button below to create a new password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>Or copy and paste this link in your browser:</p>
    <p class="link">${resetUrl}</p>
    <p><strong>This link will expire in 1 hour.</strong></p>
    <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;

  try {
    await sendHtmlEmail({
      to: email,
      subject: `Reset your ${APP_NAME} password`,
      html: getEmailTemplate(content, 'Reset your password for HJ Fashion'),
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

// Send email verification email
export async function sendEmailVerificationEmail(
  email: string,
  token: string,
  firstName?: string
): Promise<boolean> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  const name = firstName || 'there';

  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi ${name},</p>
    <p>Welcome to ${APP_NAME}! Please verify your email address by clicking the button below:</p>
    <a href="${verifyUrl}" class="button">Verify Email</a>
    <p>Or copy and paste this link in your browser:</p>
    <p class="link">${verifyUrl}</p>
    <p><strong>This link will expire in 24 hours.</strong></p>
    <p>If you didn't create an account with ${APP_NAME}, you can safely ignore this email.</p>
    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;

  try {
    await sendHtmlEmail({
      to: email,
      subject: `Verify your ${APP_NAME} email address`,
      html: getEmailTemplate(content, 'Please verify your email address'),
    });
    return true;
  } catch (error) {
    console.error('Error sending email verification:', error);
    return false;
  }
}

// Send welcome email
export async function sendWelcomeEmail(
  email: string,
  firstName?: string
): Promise<boolean> {
  const name = firstName || 'there';

  const content = `
    <h1>Welcome to ${APP_NAME}!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for joining ${APP_NAME}. We're excited to have you as part of our community!</p>
    <p>Here's what you can do now:</p>
    <ul style="color: #44403c; margin: 16px 0; padding-left: 20px;">
      <li>Browse our exclusive collections</li>
      <li>Save your favorite items to your wishlist</li>
      <li>Enjoy a faster checkout experience</li>
      <li>Track your orders easily</li>
    </ul>
    <a href="${APP_URL}/shop" class="button">Start Shopping</a>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;

  try {
    await sendHtmlEmail({
      to: email,
      subject: `Welcome to ${APP_NAME}! 🎉`,
      html: getEmailTemplate(content, 'Welcome to HJ Fashion!'),
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

// Send password changed notification
export async function sendPasswordChangedEmail(
  email: string,
  firstName?: string
): Promise<boolean> {
  const name = firstName || 'there';

  const content = `
    <h1>Password Changed Successfully</h1>
    <p>Hi ${name},</p>
    <p>This is a confirmation that the password for your ${APP_NAME} account has been successfully changed.</p>
    <p>If you did not make this change, please contact our support team immediately or reset your password:</p>
    <a href="${APP_URL}/forgot-password" class="button">Reset Password</a>
    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;

  try {
    await sendHtmlEmail({
      to: email,
      subject: `Your ${APP_NAME} password has been changed`,
      html: getEmailTemplate(content, 'Your password has been changed'),
    });
    return true;
  } catch (error) {
    console.error('Error sending password changed email:', error);
    return false;
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { transporter } = await getTransporter();
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
