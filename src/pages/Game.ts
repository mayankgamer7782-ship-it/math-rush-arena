import { defineRoute, navigate } from '../router';
import { api } from '../api';

export function registerGameRoute() {
  defineRoute('/game', () => {
    const saved = sessionStorage.getItem('mra:game');
    if (!saved) return '<p class="card">No game found. Go to Lobby.</p>';
    const game = JSON.parse(saved) as { gameId: string; questions: Array<{id:string,a:number,b:number,op:string}> };
    const qsHtml = game.questions.map((q, i) => `
      <div class="q">
        <label>#${i+1}: ${q.a} ${q.op} ${q.b} = <input type="number" data-idx="${i}" /></label>
      </div>
    `).join('');
    return `
      <section class="card">
        <h2>Practice Game</h2>
        <div>${qsHtml}</div>
        <button id="submit">Submit</button>
        <p id="msg"></p>
      </section>
    `;
  });

  window.addEventListener('page:rendered', (e: any) => {
    if (e.detail?.path !== '/game') return;
    const saved = sessionStorage.getItem('mra:game');
    if (!saved) return;
    const game = JSON.parse(saved) as { gameId: string; questions: Array<{id:string,a:number,b:number,op:string}> };
    const msg = document.getElementById('msg')!;
    document.getElementById('submit')?.addEventListener('click', async () => {
      const inputs = Array.from(document.querySelectorAll('input[data-idx]')) as HTMLInputElement[];
      const answers = inputs.map(i => Number(i.value || '0'));
      try {
        const res = await api.submitGame(game.gameId, answers);
        msg.textContent = `Score: ${res.correct}/${res.total}`;
      } catch (e: any) {
        msg.textContent = e.message || 'Submit failed';
      }
    });
  });
}
