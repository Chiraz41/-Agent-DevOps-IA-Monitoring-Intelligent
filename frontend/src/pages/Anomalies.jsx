import { useState, useRef } from "react";

import { useAnomalyDetection } from "../hooks/useAnomalyDetection";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import AnomalyStatus from "../components/dashboard/AnomalyStatus";
import DetectionControls from "../components/dashboard/DetectionControls";
import AlertBanner from "../components/dashboard/AlertBanner";

export default function Anomalies() {
  const {
    data,
    loading,
    error,
    runDetection,
  } = useAnomalyDetection();

  const [lastDetection, setLastDetection] = useState(null);
  const anomalyRefs = useRef([]);

  const handleDetect = async () => {
    try {
      const result = await runDetection();
      setLastDetection(result);
    } catch {
      // géré par le hook
    }
  };

  const currentData = lastDetection || data;
  const anomaliesList = currentData?.anomalies || [];

  // Trouve l'index de l'anomalie la plus sévère (même logique que dans AlertBanner)
  const getMostSevereIndex = () => {
    if (anomaliesList.length === 0) return -1;
    let worstIndex = 0;
    let worstScore = anomaliesList[0]?.anomaly_score ?? -Infinity;
    anomaliesList.forEach((a, i) => {
      const score = a.anomaly_score ?? -Infinity;
      if (score > worstScore) {
        worstScore = score;
        worstIndex = i;
      }
    });
    return worstIndex;
  };

  const scrollToMostSevere = () => {
    const index = getMostSevereIndex();
    if (index === -1) return;
    anomalyRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="page">
      <div className="page-title">
        <h1>Détection des anomalies</h1>
        <p>Analyse des métriques par le modèle d'intelligence artificielle.</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {currentData?.is_anomaly && (
        <AlertBanner anomalies={anomaliesList} onClick={scrollToMostSevere} />
      )}

      <section className="dashboard-card">
        <MetricsGrid metrics={anomaliesList[0]?.metrics} />
        <AnomalyStatus data={currentData} />
        <DetectionControls
          onDetect={handleDetect}
          loading={loading}
          realtime={false}
          countdown={30}
          onToggleRealtime={() => {}}
        />
      </section>

      {currentData?.is_anomaly && anomaliesList.length > 0 && (
        <div className="anomalies-list">
          {anomaliesList.map((anomaly, index) => (
            <section
              key={index}
              ref={(el) => (anomalyRefs.current[index] = el)}
              className="dashboard-card anomaly-details-card"
            >
              <h2>Anomalie #{index + 1}</h2>

              <div className="detail-grid">
                <div>
                  <span>Gravité</span>
                  <strong>{anomaly.gravite || "--"}</strong>
                </div>

                <div>
                  <span>Score</span>
                  <strong>
                    {anomaly.anomaly_score != null
                      ? Number(anomaly.anomaly_score).toFixed(3)
                      : "--"}
                  </strong>
                </div>
              </div>

              <div className="description-block">
                <h3>Description</h3>
                <p>{anomaly.description || "Aucune description disponible."}</p>
              </div>

              <div className="description-block">
                <h3>Analyse IA et recommandations</h3>
                <p className="llm-text">
                  {anomaly.llm_explanation || "Aucune explication IA disponible."}
                </p>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}