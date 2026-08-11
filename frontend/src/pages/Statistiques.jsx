import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";

import Loader from "../components/common/Loader";

export default function Statistiques() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistory({
          limit: 100,
          anomaliesOnly: false,
        });

        setHistory(data.history || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <Loader text="Calcul des statistiques..." />
      </div>
    );
  }

  const total = history.length;

  const anomalies = history.filter(
    (item) => item.is_anomaly
  ).length;

  const normal = total - anomalies;

  const anomalyRate =
    total > 0
      ? ((anomalies / total) * 100).toFixed(1)
      : "0";

  const scores = history
    .filter(
      (item) =>
        item.anomaly_score !== null &&
        item.anomaly_score !== undefined
    )
    .map((item) => Number(item.anomaly_score));

  const averageScore =
    scores.length > 0
      ? (
          scores.reduce(
            (sum, value) => sum + value,
            0
          ) / scores.length
        ).toFixed(3)
      : "--";

  return (
    <div className="page">
      <div className="page-title">
        <h1>Statistiques</h1>

        <p>
          Vue globale des analyses effectuées.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Analyses</span>
          <strong>{total}</strong>
        </div>

        <div className="stat-card danger">
          <span>Anomalies</span>
          <strong>{anomalies}</strong>
        </div>

        <div className="stat-card success">
          <span>Normal</span>
          <strong>{normal}</strong>
        </div>

        <div className="stat-card">
          <span>Taux d'anomalie</span>
          <strong>{anomalyRate}%</strong>
        </div>

        <div className="stat-card">
          <span>Score moyen</span>
          <strong>{averageScore}</strong>
        </div>
      </div>
    </div>
  );
}