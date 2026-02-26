# hj-fashion (monorepo)

This repo is split into two apps:

- `frontend/` – Next.js storefront + admin UI
- `backend/` – Next.js API backend (all `/api/*` routes)

## Run (dev)

1. Install dependencies (both apps):

```bash
npm run install:all
```

2. Start both apps:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

Note: `npm run dev` uses `npx concurrently`, so you do not need to install dependencies at the repo root.

The frontend proxies all `/api/*` requests to the backend via a rewrite configured in `frontend/next.config.ts`.

## Environment

- Backend secrets (DB/email/JWT) live in `backend/.env.local`.
- Frontend uses `frontend/.env.local` with `BACKEND_URL` (defaults to `http://localhost:3001`).

### GitHub / Git ignore

This repo intentionally ignores real env files (like `.env`, `.env.local`) so secrets are not committed.

- Use the committed templates:
	- `backend/.env.example`
	- `frontend/.env.example`
- Create your local files by copying:
	- `backend/.env.example` → `backend/.env.local`
	- `frontend/.env.example` → `frontend/.env.local`

For production, set env vars in your hosting provider dashboards (Render for backend, Vercel for frontend) rather than committing them to GitHub.

#### Example production configuration
- **Backend deployment**: https://h-jfashion0.vercel.app (set `DATABASE_URL`, `JWT_SECRET`, `SMTP_*`, `NEXT_PUBLIC_APP_URL="https://h-jfasion.vercel.app"`, etc.)
- **Frontend deployment**: https://h-jfasion.vercel.app (set `BACKEND_URL="https://h-jfashion0.vercel.app"` and any public keys).

Email templates and reset/verify links are built using `NEXT_PUBLIC_APP_URL` on the backend, so ensure it points at the frontend site.
