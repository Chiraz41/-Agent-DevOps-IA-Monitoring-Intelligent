import {
  Play,
  Radio,
  Square,
} from "lucide-react";

export default function DetectionControls({
  onDetect,
  loading,
  realtime,
  countdown,
  onToggleRealtime,
}) {
  return (
    <div className="detection-controls">
      <button
        className="btn-primary"
        onClick={onDetect}
        disabled={loading}
      >
        <Play size={16} />

        {loading
          ? "Détection en cours..."
          : "Lancer la détection"}
      </button>

      <button
        className={`btn-realtime ${
          realtime ? "active" : ""
        }`}
        onClick={onToggleRealtime}
      >
        {realtime ? (
          <Square size={15} />
        ) : (
          <Radio size={15} />
        )}

        {realtime
          ? `Temps réel ON — ${countdown}s`
          : "Temps réel OFF"}
      </button>
    </div>
  );
}