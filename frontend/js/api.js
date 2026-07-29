/* =============================================================
   api.js — client API centralisé + utilitaires partagés
   (formatage, classification de sévérité, notifications toast).
   Toutes les pages passent par ce fichier pour parler au backend
   FastAPI. Si une route change côté backend, c'est le seul
   fichier à modifier.
   ============================================================= */

const CONFIG = {
  // Modifiable en cliquant sur le pied de la barre latérale (voir nav.js)
  baseUrl: (window.localStorage && localStorage.getItem('api_base_url')) || 'http://localhost:8000'
};

function setBaseUrl(url){
  CONFIG.baseUrl = url.replace(/\/$/, '');
  try{ localStorage.setItem('api_base_url', CONFIG.baseUrl); }catch(e){}
}

async function apiGet(path){
  const res = await fetch(CONFIG.baseUrl + path);
  if(!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

async function apiPost(path, body){
  const res = await fetch(CONFIG.baseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

const API = {
  health: () => apiGet('/health'),

  // GET /api/history?limit=N → tableau d'anomalies historisées
  // Forme d'un élément : { timestamp, severity, score, explanation, metrics:{cpu,ram,disk,network} }
  getHistory: (limit) => apiGet(`/api/history${limit ? `?limit=${limit}` : ''}`),

  // GET /stats → { total_anomalies, par_severite, score_moyen, metrique_la_plus_touchee, repartition_metriques }
  getStats: () => apiGet('/stats'),

  // GET /anomalies?n_points=N → déclenche un cycle de détection
  // Retour : { total_points, total_anomalies, anomalies:[ {metrics,severity,score,explanation,timestamp} ] }
  runDetectionCycle: (nPoints) => apiGet(`/anomalies?n_points=${nPoints}`),

  // POST /agent/ask { question } → { question, answer }
  askAgent: (question) => apiPost('/agent/ask', { question })
};

/* =============================================================
   Aides communes (formatage, classification de sévérité)
   ============================================================= */

// La liste exacte des valeurs de sévérité renvoyées par calculate_severity()
// n'est pas connue à l'avance : on classe donc par mot-clé pour choisir la
// couleur, tout en affichant toujours le texte brut renvoyé par l'API.
function classifySeverity(sev){
  const s = String(sev ?? '').toLowerCase();
  if(/(crit|high|élev|haute|severe|sévère)/.test(s)) return 'critical';
  if(/(moy|warn|medium|modér)/.test(s)) return 'warning';
  return 'info';
}

function severityBadge(sev){
  if(sev === undefined || sev === null || sev === '') return '<span class="sev info">—</span>';
  return `<span class="sev ${classifySeverity(sev)}">${sev}</span>`;
}

function formatTimestamp(v){
  if(!v) return '—';
  const d = new Date(v);
  if(isNaN(d.getTime())) return String(v);
  return d.toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

function formatMetrics(m){
  if(!m) return '—';
  return `cpu ${m.cpu ?? '—'} · ram ${m.ram ?? '—'} · disk ${m.disk ?? '—'} · net ${m.network ?? '—'}`;
}

// Identifiant stable d'une anomalie, utilisé pour éviter de notifier
// deux fois la même anomalie lors des actualisations automatiques.
function anomalyKey(a){
  return [a.timestamp, a.severity, a.score, JSON.stringify(a.metrics || {})].join('|');
}

/* =============================================================
   Notifications toast — utilisées pour signaler une anomalie dès
   qu'elle est détectée, avec l'explication et la recommandation
   fournies par l'agent de monitoring IA (champ `explanation`,
   ou `recommendation` si le backend l'expose séparément).
   Cliquer sur un toast fait défiler jusqu'à la carte correspondante
   dans la liste (si présente sur la page) et la met en surbrillance.
   ============================================================= */

const TOAST_ICONS  = { critical: '⛔', warning: '⚠', info: 'ℹ' };
const TOAST_LABELS = { critical: 'Anomalie critique', warning: 'Anomalie détectée', info: 'Information' };
const TOAST_AUTO_DISMISS_MS = { critical: 0, warning: 14000, info: 9000 }; // 0 = ne se ferme pas seul

function ensureToastContainer(){
  let el = document.querySelector('.toast-container');
  if(!el){
    el = document.createElement('div');
    el.className = 'toast-container';
    document.body.appendChild(el);
  }
  return el;
}

function showToast(anomaly){
  const cls = classifySeverity(anomaly.severity);
  const container = ensureToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${cls}`;
  toast.dataset.key = anomalyKey(anomaly);

  const reco = anomaly.recommendation || anomaly.explanation || "Aucune recommandation fournie par l'agent.";
  const duration = TOAST_AUTO_DISMISS_MS[cls];

  toast.innerHTML = `
    <div class="toast-head">
      <div class="toast-title"><span class="icon">${TOAST_ICONS[cls]}</span>${TOAST_LABELS[cls]}${anomaly.severity ? ` — ${anomaly.severity}` : ''}</div>
      <button class="toast-close" aria-label="Fermer" type="button">✕</button>
    </div>
    <div class="toast-meta">${formatTimestamp(anomaly.timestamp)} · ${formatMetrics(anomaly.metrics)}</div>
    <div class="toast-reco">Explication &amp; recommandation de l'agent</div>
    <div class="toast-body">${reco}</div>
    <div class="toast-hint">Cliquer pour voir le détail</div>
    ${duration ? `<div class="toast-progress" style="animation-duration:${duration}ms;"></div>` : ''}
  `;

  const dismiss = (ev) => {
    if(ev) ev.stopPropagation();
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 220);
  };
  toast.querySelector('.toast-close').addEventListener('click', dismiss);

  toast.addEventListener('click', () => {
    const card = document.querySelector(`[data-key="${CSS.escape(toast.dataset.key)}"].anomaly-card`);
    if(card){
      card.scrollIntoView({ behavior:'smooth', block:'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 1600);
    }
    dismiss();
  });

  if(duration) setTimeout(dismiss, duration);

  container.appendChild(toast);
  return toast;
}
