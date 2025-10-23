import './style.css';

async function bootstrap() {
  const app = document.getElementById('app');
  if (!app) return;

  let apiMessage = 'Loading...';
  try {
    const res = await fetch('/api/hello');
    if (res.ok) {
      const data = await res.json();
      apiMessage = data.message ?? JSON.stringify(data);
    } else {
      apiMessage = `API error: ${res.status}`;
    }
  } catch (err) {
    apiMessage = 'Backend not reachable. Did you start the server?';
  }

  app.innerHTML = `
    <main style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 2rem">
      <h1>Math Rush Arena</h1>
      <p>A head-to-head math puzzle race. Solve 10 questions before your opponent.</p>
      <ul>
        <li>Time controls: e.g., 5 min for 5 Qs; at least 10 presets</li>
        <li>Levels: Beginner → Advanced (and in-between)</li>
        <li>Rating: IQ-style points</li>
      </ul>
      <p>Dev server: <code>npm run dev</code></p>
      <section style="margin-top:1rem; padding:0.75rem; background:#f6f6f6; border:1px solid #ddd; border-radius:8px;">
        <strong>Backend says:</strong>
        <pre style="white-space:pre-wrap">${apiMessage}</pre>
      </section>
    </main>
  `;
}

bootstrap();
