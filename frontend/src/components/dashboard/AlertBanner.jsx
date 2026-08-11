import { AlertTriangle } from "lucide-react";

export default function AlertBanner({ anomalies, onClick }) {
  if (!anomalies || anomalies.length === 0) return null;

  const mostSevere = anomalies.reduce((worst, current) => {
    const currentScore = current.anomaly_score ?? -Infinity;
    const worstScore = worst.anomaly_score ?? -Infinity;
    return currentScore > worstScore ? current : worst;
  }, anomalies[0]);

  return (
    <div
      className="alert-banner alert-banner-clickable"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className="alert-banner-icon">
        <AlertTriangle size={22} />
      </div>

      <div className="alert-banner-content">
        <strong>
          {anomalies.length > 1
            ? `${anomalies.length} anomalies détectées`
            : "1 anomalie détectée"}
          {mostSevere.gravite ? ` — Gravité : ${mostSevere.gravite}` : ""}
        </strong>

        <p>
          {mostSevere.llm_explanation ||
            "Aucune recommandation disponible pour le moment."}
        </p>

        <span className="alert-banner-link">Voir la recommandation →</span>
      </div>
    </div>
  );
}