/* Apenas alternância de tema e ano no rodapé. */
(() => {
  const html = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const year = document.getElementById('year');
  const themeKey = 'arnz-labs-theme';

  if (year) year.textContent = String(new Date().getFullYear());

  function readTheme() {
    try { return localStorage.getItem(themeKey); } catch { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(themeKey, theme); } catch { /* Armazenamento indisponível. */ }
  }

  function applyTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    html.dataset.theme = next;
    if (toggle) {
      toggle.setAttribute('aria-label', next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      toggle.setAttribute('aria-pressed', String(next === 'light'));
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0b1220' : '#f5f7fb');
  }

  applyTheme(readTheme() || 'dark');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  }
})();
