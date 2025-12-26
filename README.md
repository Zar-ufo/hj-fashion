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
