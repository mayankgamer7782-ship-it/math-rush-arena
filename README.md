# Math Rush Arena

A head-to-head math puzzle race inspired by chess.com's competitive modes.

Goal: Solve 10 questions before your opponent. Time controls like "5 minutes for 5 questions", with at least 10 presets. Skill levels from Beginner to Advanced (with intermediate tiers). Ratings expressed as IQ-style points.

## Getting started

- Install dependencies: `npm install`
- Start dev server (frontend + backend): `npm run dev`
- Backend only: `npm run server`
- Build (frontend): `npm run build`
- Preview (frontend): `npm run preview`

### Environment variables
Create a `.env` file (see `.env.example`).
- Frontend: `VITE_API_URL` should point to your deployed backend URL in production (e.g., `https://<railway-app>.up.railway.app`). Leave empty in dev.
- Backend: `JWT_SECRET` (required in prod), `ALLOWED_ORIGIN` (comma-separated list of origins or `*`).

## Deploy

### Frontend on Vercel
1. Push this repo to GitHub (done).
2. Import the repo in Vercel dashboard.
3. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
4. Set Environment Variables: `VITE_API_URL` to your Railway backend URL.
5. Deploy.

### Backend on Railway
1. Create a new Railway project → Deploy from GitHub → select this repo.
2. Configure service to run `npm start` (uses `server/index.js`).
3. Set Environment Variables: `PORT` (Railway sets), `JWT_SECRET`, `ALLOWED_ORIGIN` (your Vercel domain, e.g., `https://<project>.vercel.app`).
4. Deploy; note the public Railway URL and paste it into Vercel `VITE_API_URL`.

## App pages
- `/` Home shows backend connectivity.
- `/signup`, `/login` basic email/password auth (demo; in-memory users).
- `/lobby` start a practice game.
- `/game` answer questions and see score.

Note: Auth and data are in-memory on the server for demo purposes. Use a real database (e.g., Railway Postgres + Prisma) for persistence.

## Next steps

- Implement matchmaking and rooms (WebSocket/Socket.IO).
- Persist users/games with a database.
- Difficulty-tiered question bank.
- Time control presets configuration.
- Rating system design (IQ points).
