import './style.css';
import { initRouter, navigate } from './router';
import { registerLoginRoutes } from './pages/Auth';
import { registerLobbyRoute } from './pages/Lobby';
import { registerGameRoute } from './pages/Game';
import { registerHomeRoute } from './pages/Home';

function layout(inner: string) {
  return `
  <header class="navbar">
    <div class="container">
      <a href="#/" class="brand">Math Rush Arena</a>
      <nav>
        <a href="#/login">Login</a>
        <a href="#/signup">Sign up</a>
        <a href="#/lobby">Lobby</a>
        <a href="#/game">Practice</a>
      </nav>
    </div>
  </header>
  <main class="container">${inner}</main>
  `;
}

async function bootstrap() {
  const app = document.getElementById('app');
  if (!app) return;
  registerHomeRoute();
  registerLoginRoutes('login');
  registerLoginRoutes('signup');
  registerLobbyRoute();
  registerGameRoute();
  initRouter(app, layout);
  if (!location.hash) navigate('/');
}

bootstrap();
