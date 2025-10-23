import { defineRoute, navigate } from '../router';
import { api, setToken } from '../api';

function formTpl(title: string, submitText: string) {
  return `
  <section class="card">
    <h2>${title}</h2>
    <form id="auth-form">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" minlength="6" required />
      <button type="submit">${submitText}</button>
      <p id="error" style="color:#b00"></p>
    </form>
  </section>
  `;
}

export function registerLoginRoutes(kind: 'login' | 'signup') {
  defineRoute(kind === 'login' ? '/login' : '/signup', () => formTpl(kind === 'login' ? 'Login' : 'Create account', kind === 'login' ? 'Login' : 'Sign up'));
  window.addEventListener('page:rendered', (e: any) => {
    const path = e.detail?.path;
    if (path !== (kind === 'login' ? '/login' : '/signup')) return;
    const form = document.getElementById('auth-form') as HTMLFormElement | null;
    const err = document.getElementById('error') as HTMLParagraphElement | null;
    form?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      err!.textContent = '';
      const email = (document.getElementById('email') as HTMLInputElement).value.trim();
      const password = (document.getElementById('password') as HTMLInputElement).value;
      try {
        const data = kind === 'login' ? await api.login(email, password) : await api.register(email, password);
        setToken(data.token);
        navigate('/lobby');
      } catch (e: any) {
        err!.textContent = e.message || 'Failed';
      }
    });
  });
}
