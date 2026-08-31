import { useEffect, useState } from "react";
import { getStats } from "../services/statsService";
import Loader from "../components/common/Loader";

const REFRESH_INTERVAL_MS = 5000; // toutes les 5s, ajustable

export default function Statistiques() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats(isBackground) {
      if (cancelled) return;
      if (isBackground) setRefreshing(true);

      try {
        const data = await getStats();
        if (cancelled) return;
        setStats(data);
        setError(null);
      } catch (err) {
        console.error(err);
        if (!cancelled && !isBackground) {
          setError("Impossible de charger les statistiques.");
        }
      } finally {
        if (!cancelled) {
          if (isBackground) setRefreshing(false);
          setLoading(false);
        }
      }
    }

    // Déclenchement différé : évite d'appeler setState de façon
    // synchrone dans le corps de l'effet (warning React).
    const timeoutId = setTimeout(() => fetchStats(false), 0);

    const intervalId = setInterval(() => {
      fetchStats(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <Loader text="Calcul des statistiques..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  const {
    total_anomalies = 0,
    par_severite = {},
    score_moyen = 0,
    metrique_la_plus_touchee = null,
    repartition_metriques = {},
  } = stats || {};

  return (
    <div className="page">
      <div className="page-title">
        <h1>
          Statistiques
          {refreshing && (
            <span className="live-indicator" title="Mise à jour..." />
          )}
        </h1>

        <p>Vue globale des anomalies détectées.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card danger">
          <span>Total anomalies</span>
          <strong>{total_anomalies}</strong>
        </div>

        <div className="stat-card">
          <span>Score moyen</span>
          <strong>{score_moyen}</strong>
        </div>

        <div className="stat-card">
          <span>Métrique la plus touchée</span>
          <strong>{metrique_la_plus_touchee || "--"}</strong>
        </div>
      </div>

      {Object.keys(par_severite).length > 0 && (
        <div className="stats-section">
          <h2>Répartition par sévérité</h2>
          <div className="stats-grid">
            {Object.entries(par_severite).map(([severite, count]) => (
              <div className="stat-card" key={severite}>
                <span>{severite}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(repartition_metriques).length > 0 && (
        <div className="stats-section">
          <h2>Répartition par métrique</h2>
          <div className="stats-grid">
            {Object.entries(repartition_metriques).map(([metrique, count]) => (
              <div className="stat-card" key={metrique}>
                <span>{metrique}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}