/* =============================================================
   nav.js — barre latérale commune, injectée dans chaque page.
   Chaque page définit <body data-page="anomalies"> (ou "historique",
   "statistiques", "assistant") pour indiquer l'onglet actif.
   ============================================================= */

const PAGES = [
  { id: 'anomalies',    label: 'Anomalies',     href: 'anomalies.html' },
  { id: 'historique',   label: 'Historique',    href: 'historique.html' },
  { id: 'statistiques', label: 'Statistiques',  href: 'statistiques.html' },
  { id: 'assistant',    label: 'Assistant',     href: 'assistant.html' }
];

function renderSidebar(){
  const current = document.body.dataset.page;

  const nav = document.createElement('div');
  nav.className = 'sidebar';
  nav.innerHTML = `
    <div class="brand">
      <div class="brand-text">
        <div class="name">SENTINEL_</div>
        <div class="sub">console de surveillance</div>
      </div>
    </div>
    <div class="nav">
      ${PAGES.map(p => `
        <a href="${p.href}" class="${p.id === current ? 'active' : ''}">
          <span class="dot"></span>${p.label}
        </a>`).join('')}
    </div>
    <div class="sidebar-foot" id="statusFoot">Vérification API…</div>
  `;
  document.body.prepend(nav);

  document.getElementById('statusFoot').addEventListener('click', async () => {
    const url = prompt("URL de base de l'API (ex: http://localhost:8000)", CONFIG.baseUrl);
    if(url){ setBaseUrl(url); checkApiStatus(); }
  });
}

async function checkApiStatus(){
  const el = document.getElementById('statusFoot');
  try{
    await API.health();
    el.innerHTML = `<span style="color:var(--accent-green)">●</span> Connecté — ${CONFIG.baseUrl}`;
  }catch(e){
    el.innerHTML = `<span style="color:var(--sev-critical)">●</span> API injoignable — ${CONFIG.baseUrl}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  checkApiStatus();
});
