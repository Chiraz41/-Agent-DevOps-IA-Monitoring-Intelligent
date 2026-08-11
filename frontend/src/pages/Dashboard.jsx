import { useState } from "react";

import MetricsGrid from "../components/dashboard/MetricsGrid";
import AnomalyStatus from "../components/dashboard/AnomalyStatus";
import DetectionControls from "../components/dashboard/DetectionControls";
import Loader from "../components/common/Loader";

import { useAnomalyDetection } from "../hooks/useAnomalyDetection";
import { useRealtimeDetection } from "../hooks/useRealtimeDetection";

import { getHistory } from "../services/historyService";

export default function Dashboard() {
  const {
    data,
    loading,
    error,
    runDetection,
  } = useAnomalyDetection();

  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const result = await getHistory({
        limit: 5,
        anomaliesOnly: false,
      });

      setHistory(result.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResult = () => {
    loadHistory();
  };

  const realtime = useRealtimeDetection(handleResult);

  const handleDetect = async () => {
    try {
      await runDetection();
      await loadHistory();
    } catch {
      // erreur déjà gérée par le hook
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Surveillance et détection des anomalies
            en temps réel.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-box">
          Impossible de contacter le backend :{" "}
          {error}
        </div>
      )}

      <section className="dashboard-card">
        <div className="section-header">
          <h2>Métriques en temps réel</h2>
        </div>

        {loading && !data ? (
          <Loader text="Analyse en cours..." />
        ) : (
          <>
            <MetricsGrid metrics={data?.metrics} />

            <AnomalyStatus data={data} />

            <DetectionControls
              onDetect={handleDetect}
              loading={loading}
              realtime={realtime.enabled}
              countdown={realtime.countdown}
              onToggleRealtime={realtime.toggle}
            />

            {realtime.enabled && (
              <div className="realtime-info">
                Prochaine détection dans{" "}
                <strong>
                  {realtime.countdown}s
                </strong>
              </div>
            )}
          </>
        )}
      </section>

      <section className="dashboard-card">
        <div className="section-header">
          <h2>Dernières détections</h2>
        </div>

        {history.length === 0 ? (
          <p className="muted">
            Aucune détection pour le moment.
          </p>
        ) : (
          <div className="mini-history">
            {history.map((item, index) => (
              <div
                className="history-row"
                key={`${item.timestamp}-${index}`}
              >
                <span>
                  {new Date(
                    item.timestamp
                  ).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <strong
                  className={
                    item.is_anomaly
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  {item.is_anomaly
                    ? "ANOMALIE"
                    : "NORMAL"}
                </strong>

                <span>
                  Score :{" "}
                  {item.anomaly_score != null
                    ? Number(
                        item.anomaly_score
                      ).toFixed(3)
                    : "--"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}