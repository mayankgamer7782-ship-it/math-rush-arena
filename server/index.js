import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from the backend! 🎉' });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
