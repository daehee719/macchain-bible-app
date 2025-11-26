# Copilot instructions — MacChain Bible App

Short, actionable guidance for AI coding agents working in this repo.

**Big picture**
- Frontend: `macchain-frontend/` — React + TypeScript + Vite. Dev: `cd macchain-frontend && npm install && npm run dev`.
- Backend (serverless): `backend/cloudflare-workers/` — Cloudflare Workers, D1 (binding name `DB`), Cloudflare AI (`env.AI`).
- Local integrator: `docker-compose.yml` spins up Postgres/Mongo/Redis and a legacy Java backend for local full-stack testing.

**Key commands**
- Frontend dev: `cd macchain-frontend && npm run dev`
- Frontend build: `cd macchain-frontend && npm run build` (runs `tsc && vite build`)
- Unit tests: `cd macchain-frontend && npm run test` (Vitest)
- E2E tests: `cd macchain-frontend && npm run test:e2e` (Playwright)
- Workers local: `cd backend/cloudflare-workers && wrangler dev`
- Workers deploy: `cd backend/cloudflare-workers && wrangler deploy`
- Docker full-stack: `docker-compose up --build` from repo root

**Project conventions**
- Frontend env vars: prefer `VITE_` prefix for Vite runtime variables (see `frontend/wrangler.toml`).
- API surface: Cloudflare Workers expose `/api/*`; frontend calls live in `macchain-frontend/src/services` (single `ApiService`).
- State: React Contexts under `macchain-frontend/src/contexts` (Context + hooks pattern).
- DB binding: Cloudflare D1 binding name is `DB` (defined in `backend/cloudflare-workers/wrangler.toml`) — code expects `env.DB`.

**Concrete examples & important names**
- Frontend API usage (see `macchain-frontend/src/services/api.ts`):
  ```ts
  const API_BASE_URL = 'https://macchain-api-public.daeheuigang.workers.dev';
  await fetch(`${API_BASE_URL}/api/mccheyne/today`);
  ```
- D1 usage (Cloudflare Workers):
  ```js
  const plan = await env.DB.prepare('SELECT ... FROM mccheyne_plan WHERE date = ?')
    .bind(today)
    .first();
  ```
- Cloudflare AI usage (see `api/ai-analysis.js`):
  ```js
  const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages, max_tokens: 1000 });
  ```

**CI/CD specifics & secrets**
- Workflows trigger on `main` and `develop` (see `.github/workflows/cloudflare-deploy.yml`, `frontend-ci.yml`, `backend-ci.yml`).
- `cloudflare-deploy.yml` filters changes to `cloudflare-workers/**` and `macchain-frontend/**` before deploying.
- Common secrets referenced in workflows:
  - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
  - `GITHUB_TOKEN` (built-in)
  - `DOCKER_USERNAME`, `DOCKER_PASSWORD`
  - `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`
  - `FRONTEND_URL`, `BACKEND_URL`, `OPENAI_API_KEY`, `JWT_SECRET`

**Gotchas / quick checks for edits**
- When changing API shapes: update Workers under `backend/cloudflare-workers/api/*` and client calls in `macchain-frontend/src/services` together.
- If you change the D1 binding name, update `wrangler.toml` and all `env.DB` references.
- Many CI steps are currently guarded or skipped (lint/test steps echo as skipped); check workflow files before adjusting CI expectations.

If you want, I can: (A) insert request/response examples for important endpoints into this file, (B) list exact files that call `env.DB`, or (C) extract CI secret names into a dedicated section in `docs/`.
