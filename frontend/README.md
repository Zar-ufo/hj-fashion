This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email Setup (Resend preferred)

- Preferred: Resend (free tier)
	- Set `RESEND_API_KEY` and optionally `RESEND_FROM` (defaults to `FROM_EMAIL` or `onboarding@resend.dev`).
	- No SMTP needed; the app will use Resend automatically when the API key is present.

- SMTP fallback (if you do not want Resend):
	- Env Vars: SMTP_HOST, SMTP_PORT ("587" or "465"), SMTP_SECURE ("false" or "true"), SMTP_USER, SMTP_PASS, FROM_EMAIL.
	- Gmail: enable 2‑Step Verification, create an App Password, use smtp.gmail.com:465 with secure=true.
	- Outlook: smtp.office365.com:587 with secure=false.

- Dev preview without creds: leave SMTP unset and RESEND_API_KEY unset; the app will use Ethereal and print a preview URL in your terminal.

- Verify email sending:
	- Start the dev server and register a new account (verification email).
	- Use the Forgot Password page to trigger reset emails.

