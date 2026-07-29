/* =============================================================
   anomalies.js — page principale : analyse en temps réel.

   - Lance un premier cycle de détection dès l'ouverture de la
     page (aucun clic requis).
   - Ré-analyse automatiquement toutes les REFRESH_MS millisecondes
     tant que le mode "temps réel" est actif (bouton pour mettre
     en pause / reprendre).
   - Chaque anomalie critique ou avertissement nouvellement détectée
     déclenche une notification toast cliquable contenant
     l'explication et la recommandation de l'agent IA.
   ============================================================= */

const REFRESH_MS = 20000; // fréquence d'actualisation automatique (temps réel)

let realtimeTimer = null;
let realtimeEnabled = true;
let notifiedKeys = new Set(); // anomalies déjà notifiées, pour ne pas spammer à chaque cycle

function renderAnomalyCard(a){
  const cls = classifySeverity(a.severity);
  return `
    <div class="anomaly-card ${cls}" data-key="${anomalyKey(a)}">
      <div class="head">
        ${severityBadge(a.severity)}
        <span class="ts">${formatTimestamp(a.timestamp)} — score ${a.score ?? '—'}</span>
      </div>
      <div class="metrics">${formatMetrics(a.metrics)}</div>
      <div class="explanation">${a.explanation || "Pas d'explication fournie."}</div>
    </div>
  `;
}

function renderAnomalies(anomalies){
  const container = document.getElementById('anomalyList');
  if(!anomalies || anomalies.length === 0){
    container.innerHTML = '<div class="empty-state"><span class="icon">✓</span>Aucune anomalie détectée sur ce cycle — tout est normal.</div>';
    return;
  }
  container.innerHTML = anomalies.map(renderAnomalyCard).join('');
}

function renderSkeleton(){
  document.getElementById('anomalyList').innerHTML =
    Array.from({ length: 3 }).map(() => '<div class="skeleton-card"></div>').join('');
}

function notifyNewAnomalies(anomalies){
  (anomalies || [])
    .filter(a => ['critical', 'warning'].includes(classifySeverity(a.severity)))
    .filter(a => !notifiedKeys.has(anomalyKey(a)))
    .sort((a, b) => (classifySeverity(a.severity) === 'critical' ? -1 : 1))
    .forEach(a => {
      notifiedKeys.add(anomalyKey(a));
      showToast(a);
    });
}

function setLiveStatus(active){
  const dot = document.getElementById('liveDot');
  const label = document.getElementById('liveLabel');
  const btn = document.getElementById('liveToggle');
  if(active){
    dot.classList.add('live-on');
    label.textContent = `Temps réel actif — actualisation toutes les ${REFRESH_MS / 1000}s`;
    btn.textContent = 'Mettre en pause';
  }else{
    dot.classList.remove('live-on');
    label.textContent = 'Temps réel en pause';
    btn.textContent = 'Reprendre';
  }
}

function startRealtime(){
  stopRealtime();
  realtimeEnabled = true;
  setLiveStatus(true);
  realtimeTimer = setInterval(() => runCycle({ silent: true }), REFRESH_MS);
}

function stopRealtime(){
  realtimeEnabled = false;
  setLiveStatus(false);
  if(realtimeTimer){ clearInterval(realtimeTimer); realtimeTimer = null; }
}

async function runCycle({ silent = false } = {}){
  const btn = document.getElementById('runBtn');
  const status = document.getElementById('cycleStatus');
  const nPoints = parseInt(document.getElementById('nPoints').value, 10) || 100;

  if(!silent){
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Analyse en cours…';
    renderSkeleton();
  }
  status.textContent = '';
  status.className = 'status-msg';

  try{
    const result = await API.runDetectionCycle(nPoints);

    const setKpi = (id, value) => {
      const el = document.getElementById(id);
      el.textContent = value;
      el.classList.remove('up-anim');
      void el.offsetWidth;
      el.classList.add('up-anim');
    };

    const anomalies = result.anomalies || [];
    setKpi('kpi-points', result.total_points ?? nPoints);
    setKpi('kpi-found', result.total_anomalies ?? anomalies.length);
    setKpi('kpi-crit', anomalies.filter(a => classifySeverity(a.severity) === 'critical').length);
    setKpi('kpi-lastrun', new Date().toLocaleTimeString('fr-FR'));

    renderAnomalies(anomalies);
    notifyNewAnomalies(anomalies);
  }catch(e){
    status.textContent = `Échec de la détection : ${e.message}. Vérifiez que le backend tourne et que CORS est activé.`;
    status.className = 'status-msg error';
    if(!silent){
      document.getElementById('anomalyList').innerHTML =
        '<div class="empty-state"><span class="icon">⚠</span>Impossible de charger les anomalies pour le moment.</div>';
    }
  }finally{
    btn.disabled = false;
    btn.innerHTML = 'Relancer maintenant';
  }
}

document.getElementById('runBtn').addEventListener('click', () => runCycle());
document.getElementById('liveToggle').addEventListener('click', () => {
  if(realtimeEnabled) stopRealtime(); else startRealtime();
});
document.getElementById('nPoints').addEventListener('change', () => runCycle());

// Lancement automatique dès l'ouverture de la page, puis actualisation
// continue en arrière-plan (temps réel) sans action de l'utilisateur.
renderSkeleton();
runCycle();
startRealtime();
