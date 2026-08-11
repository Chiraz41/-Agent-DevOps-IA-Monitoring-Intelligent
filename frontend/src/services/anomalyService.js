import { api } from "./api";

export async function detectAnomaly() {
  const result = await api.get("/anomalies");

  const anomalies = (result.anomalies || []).map((a) => ({
    metrics: a.metrics,
    gravite: a.severity,
    anomaly_score: a.score,
    llm_explanation: a.explanation,
    description: a.explanation, // pas de champ "description" distinct côté backend
  }));

  return {
    is_anomaly: result.total_anomalies > 0,
    total_anomalies: result.total_anomalies,
    total_points: result.total_points,
    anomalies, // <-- la liste complète, transformée
  };
}