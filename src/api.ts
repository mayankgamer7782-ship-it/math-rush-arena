export const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

function toUrl(path: string) {
  if (API_BASE) {
    return API_BASE.replace(/\/$/, '') + path;
  }
  return path;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(t: string | null) {
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(toUrl(path), { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  hello: () => request('/api/hello'),
  register: (email: string, password: string) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/api/me'),
  startGame: (count: number) => request('/api/game/start', { method: 'POST', body: JSON.stringify({ count }) }),
  submitGame: (gameId: string, answers: number[]) => request('/api/game/submit', { method: 'POST', body: JSON.stringify({ gameId, answers }) }),
};
