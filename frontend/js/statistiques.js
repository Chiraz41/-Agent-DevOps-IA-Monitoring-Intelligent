/* =============================================================
   statistiques.js — charge /stats au chargement de la page,
   puis sur clic de "Rafraîchir".
   ============================================================= */

let chartSeverity, chartMetric;

function baseChartOptions(){
  return {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
      x:{ ticks:{ color:'#7A8593', font:{ family:'IBM Plex Mono', size:11 } }, grid:{ color:'#232A33' } },
      y:{ ticks:{ color:'#7A8593', font:{ family:'IBM Plex Mono', size:11 } }, grid:{ color:'#232A33' } }
    }
  };
}

function colorForSeverity(sev){
  const c = classifySeverity(sev);
  return c === 'critical' ? '#E5484D' : c === 'warning' ? '#E8A33D' : '#3DDBD9';
}

async function loadStats(){
  const status = document.getElementById('loadStatus');
  status.textContent = 'Chargement…';
  status.className = 'status-msg';

  let stats;
  try{
    stats = await API.getStats();
    status.textContent = '';
  }catch(e){
    status.textContent = `Impossible de charger les statistiques : ${e.message}`;
    status.className = 'status-msg error';
    stats = { total_anomalies:0, par_severite:{}, score_moyen:0, metrique_la_plus_touchee:null, repartition_metriques:{} };
  }

  document.getElementById('stat-total').textContent = stats.total_anomalies ?? 0;
  document.getElementById('stat-score').textContent = stats.score_moyen ?? '—';
  document.getElementById('stat-metric').textContent = stats.metrique_la_plus_touchee ?? '—';
  document.getElementById('stat-sevcount').textContent = Object.keys(stats.par_severite || {}).length;

  const sevEntries = Object.entries(stats.par_severite || {});
  if(chartSeverity) chartSeverity.destroy();
  chartSeverity = new Chart(document.getElementById('chartSeverity'), {
    type:'bar',
    data:{
      labels: sevEntries.map(([k]) => k),
      datasets:[{ data: sevEntries.map(([,v]) => v), backgroundColor: sevEntries.map(([k]) => colorForSeverity(k)), borderRadius:4 }]
    },
    options: baseChartOptions()
  });

  const metricEntries = Object.entries(stats.repartition_metriques || {});
  if(chartMetric) chartMetric.destroy();
  chartMetric = new Chart(document.getElementById('chartMetric'), {
    type:'bar',
    data:{
      labels: metricEntries.map(([k]) => k),
      datasets:[{ data: metricEntries.map(([,v]) => v), backgroundColor:'#3DDBD9', borderRadius:4 }]
    },
    options: baseChartOptions()
  });
}

document.getElementById('refreshBtn').addEventListener('click', loadStats);
loadStats();
