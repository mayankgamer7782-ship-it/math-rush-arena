import { defineRoute } from '../router';
import { api } from '../api';

export function registerHomeRoute() {
  defineRoute('/', async () => {
    let apiMessage = 'Loading...';
    try {
      const data = await api.hello();
      apiMessage = data.message ?? JSON.stringify(data);
    } catch (e: any) {
      apiMessage = e.message || 'Backend not reachable';
    }
    return `
      <section class="card">
        <h2>Welcome</h2>
        <p>Head-to-head math puzzle race. Login to start.</p>
        <strong>Backend says:</strong>
        <pre style="white-space:pre-wrap">${apiMessage}</pre>
      </section>
    `;
  });
}
