/* =============================================================
   historique.js — charge /api/history (bouton Rafraîchir ou
   changement de filtre).
   ============================================================= */

let fullHistory = [];

function applyFiltersAndRender(){
  const severity = document.getElementById('filterSev').value;
  const search = document.getElementById('searchInput').value.toLowerCase();

  let rows = [...fullHistory].reverse(); // plus récent en premier
  if(severity) rows = rows.filter(a => classifySeverity(a.severity) === severity);
  if(search) rows = rows.filter(a =>
    String(a.severity).toLowerCase().includes(search) ||
    String(a.explanation || '').toLowerCase().includes(search)
  );

  document.getElementById('countLabel').textContent = `${rows.length} / ${fullHistory.length} entrées`;

  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = rows.length ? rows.map(a => `
    <tr>
      <td class="ts">${formatTimestamp(a.timestamp)}</td>
      <td>${severityBadge(a.severity)}</td>
      <td class="ts">${a.score ?? '—'}</td>
      <td class="ts">${formatMetrics(a.metrics)}</td>
      <td title="${(a.explanation || '').replace(/"/g,'&quot;')}">
        ${(a.explanation || '—').slice(0,160)}${(a.explanation||'').length > 160 ? '…' : ''}
      </td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="empty-state">Aucune entrée ne correspond aux filtres.</td></tr>';
}

async function loadHistory(){
  const status = document.getElementById('loadStatus');
  const limit = parseInt(document.getElementById('limitInput').value, 10) || 200;

  status.textContent = 'Chargement…';
  status.className = 'status-msg';
  try{
    const data = await API.getHistory(limit);
    fullHistory = Array.isArray(data) ? data : [];
    status.textContent = '';
    applyFiltersAndRender();
  }catch(e){
    status.textContent = `Impossible de charger l'historique : ${e.message}`;
    status.className = 'status-msg error';
    fullHistory = [];
    applyFiltersAndRender();
  }
}

document.getElementById('refreshBtn').addEventListener('click', loadHistory);
document.getElementById('limitInput').addEventListener('change', loadHistory);
document.getElementById('filterSev').addEventListener('change', applyFiltersAndRender);
document.getElementById('searchInput').addEventListener('input', applyFiltersAndRender);

loadHistory();
