type RenderFn = (params?: Record<string,string>) => Promise<string> | string;

const routes: Record<string, RenderFn> = {};
let appEl: HTMLElement;
let wrap: (inner: string) => string;

export function defineRoute(path: string, render: RenderFn) {
  routes[path] = render;
}

function parseHash() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [path] = hash.split('?');
  return { path };
}

export function navigate(path: string) {
  location.hash = `#${path}`;
}

export function initRouter(root: HTMLElement, layout: (inner: string) => string) {
  appEl = root;
  wrap = layout;
  async function render() {
    const { path } = parseHash();
    const renderFn = routes[path] || routes['/404'];
    const html = await (renderFn ? renderFn({}) : '<h1>Not found</h1>');
    appEl.innerHTML = wrap(html);
    // Allow page modules to bind events if they exposed a global binder
    const ev = new CustomEvent('page:rendered', { detail: { path } });
    window.dispatchEvent(ev);
  }
  window.addEventListener('hashchange', render);
  render();
}
