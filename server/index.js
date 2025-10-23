import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({
  origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// In-memory data stores (replace with a real DB for production)
const users = new Map(); // key: email, value: { id, email, passwordHash, createdAt }
let nextUserId = 1;

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice('Bearer '.length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from the backend! 🎉' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (users.has(email)) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: String(nextUserId++), email, passwordHash, createdAt: new Date().toISOString() };
  users.set(email, user);
  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = users.get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/api/me', authMiddleware, (req, res) => {
  const email = req.user.email;
  const user = users.get(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email });
});

// Simple questions and game endpoints (single-player for now)
function generateQuestions(count = 10) {
  const qs = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let answer;
    switch (op) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
    }
    qs.push({ id: `${i+1}`, a, b, op, answer });
  }
  return qs;
}

const games = new Map(); // gameId -> { ownerUserId, questions }
let nextGameId = 1;

app.post('/api/game/start', authMiddleware, (req, res) => {
  const { count = 10 } = req.body || {};
  const questions = generateQuestions(Math.min(Number(count) || 10, 50)).map(q => ({ id: q.id, a: q.a, b: q.b, op: q.op }));
  const gameId = String(nextGameId++);
  games.set(gameId, { ownerUserId: req.user.sub, questions });
  res.json({ gameId, questions });
});

app.post('/api/game/submit', authMiddleware, (req, res) => {
  const { gameId, answers } = req.body || {};
  if (!gameId || !Array.isArray(answers)) return res.status(400).json({ error: 'gameId and answers[] required' });
  const game = games.get(gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });

  // Rebuild answers to score
  const qsFull = generateQuestions(game.questions.length); // different from start; for demo scoring, compute from sent questions
  // Instead, compute using ops we sent
  let correct = 0;
  for (let i = 0; i < game.questions.length; i++) {
    const q = game.questions[i];
    let real;
    if (q.op === '+') real = q.a + q.b;
    else if (q.op === '-') real = q.a - q.b;
    else real = q.a * q.b;
    if (Number(answers[i]) === real) correct++;
  }
  const total = game.questions.length;
  res.json({ correct, total });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
