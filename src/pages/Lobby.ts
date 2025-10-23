import { defineRoute, navigate } from '../router';
import { api, getToken, setToken } from '../api';

export function registerLobbyRoute() {
  defineRoute('/lobby', () => `
    <section class="card">
      <h2>Lobby</h2>
      <div id="user"></div>
      <div style="margin-top:1rem">
        <label>Questions: <input type="number" id="count" min="1" max="50" value="10" /></label>
        <button id="start">Start Practice</button>
        <button id="logout" style="margin-left:1rem">Logout</button>
      </div>
      <p id="error" style="color:#b00"></p>
    </section>
  `);

  window.addEventListener('page:rendered', async (e: any) => {
    if (e.detail?.path !== '/lobby') return;
    const userDiv = document.getElementById('user')!;
    const err = document.getElementById('error')!;
    try {
      const me = await api.me();
      userDiv.textContent = `Signed in as ${me.email}`;
    } catch {
      userDiv.textContent = 'You are not signed in.';
    }
    document.getElementById('logout')?.addEventListener('click', () => {
      setToken(null);
      navigate('/login');
    });
    document.getElementById('start')?.addEventListener('click', async () => {
      err.textContent = '';
      const count = Number((document.getElementById('count') as HTMLInputElement).value) || 10;
      try {
        const game = await api.startGame(count);
        sessionStorage.setItem('mra:game', JSON.stringify(game));
        navigate('/game');
      } catch (e: any) {
        err.textContent = e.message || 'Failed to start game';
      }
    });
  });
}
