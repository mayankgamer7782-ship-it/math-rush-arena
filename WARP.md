# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Vite frontend (TypeScript, ESM) + Express backend (Node, ESM) in a single package.
- Entry HTML: index.html loads /src/main.ts. Backend lives in server/index.js.
- Vite dev server proxies /api/* to the backend to avoid CORS during development.
- Build tool: Vite (esbuild + Rollup) for frontend. Backend is plain Node (no build step).
- Tests/lint tooling are not configured yet.

Commands
- Install deps: npm install
- Start both frontend and backend (dev): npm run dev
- Start backend only: npm run server
- Build frontend: npm run build
- Preview built frontend: npm run preview
- Tests: none configured yet (npm test is a placeholder)

Code architecture
- Frontend
  - index.html: Declares #app and loads /src/main.ts.
  - src/main.ts: Bootstraps UI, imports style.css, fetches /api/hello, renders response.
  - vite.config.ts: Proxies /api -> http://localhost:5174 in dev.
- Backend
  - server/index.js: Express app on port 5174 with CORS enabled and a sample /api/hello endpoint.

Important from README
- Getting started: npm install; npm run dev to run FE + BE; npm run build/preview for frontend.
- Product direction (Next steps): matchmaking/rooms, difficulty-tiered question bank, time-control presets, IQ-style rating, WebSocket real-time gameplay.
