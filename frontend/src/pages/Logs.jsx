import { useState } from "react";
import { useLogs } from "../hooks/useLogs";
import Loader from "../components/common/Loader";

const LEVEL_CLASSES = {
  INFO: "log-info",
  WARNING: "log-warning",
  ERROR: "log-error",
};

export default function Logs() {
  const [minutes, setMinutes] = useState(30);
  const { logs, loading, error } = useLogs(minutes);

  return (
    <div className="page">
      <div className="page-title">
        <h1>Logs serveur</h1>
        <p>Journal d'activité récent du système.</p>
      </div>

      <div className="logs-controls">
        <label>
          Fenêtre :
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          >
            <option value={10}>10 dernières minutes</option>
            <option value={30}>30 dernières minutes</option>
            <option value={60}>1 heure</option>
            <option value={1440}>24 heures</option>
          </select>
        </label>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <Loader text="Chargement des logs..." />
      ) : logs.length === 0 ? (
        <p className="empty-state">Aucun log dans cette période.</p>
      ) : (
        <div className="logs-list">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`log-line ${LEVEL_CLASSES[log.level] || ""}`}
            >
              <span className="log-timestamp">
                {new Date(log.timestamp).toLocaleString("fr-FR")}
              </span>
              <span className="log-level">{log.level}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}