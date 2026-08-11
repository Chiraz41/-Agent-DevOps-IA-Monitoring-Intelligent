import { useEffect, useState } from "react";

import { getHistory } from "../services/historyService";
import {
  formatDate,
  formatScore,
} from "../utils/formatters";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

export default function Historique() {
  const [history, setHistory] = useState([]);
  const [anomaliesOnly, setAnomaliesOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      try {
        const data = await getHistory({
          limit: 100,
          anomaliesOnly,
        });

        if (!cancelled) {
          setHistory(data.history || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [anomaliesOnly]);

  // =========================
  // AFFICHAGE
  // =========================

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Erreur lors du chargement de l'historique :</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="historique-page">
      <div className="historique-header">
        <div>
          <h1>Historique</h1>
          <p>
            Consultez les analyses et anomalies précédentes.
          </p>
        </div>

        <label>
          <input
            type="checkbox"
            checked={anomaliesOnly}
            onChange={(e) => setAnomaliesOnly(e.target.checked)}
          />

          Afficher uniquement les anomalies
        </label>
      </div>

      {history.length === 0 ? (
        <EmptyState message="Aucun historique disponible." />
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div
              className="history-card"
              key={item.id ?? index}
            >
              <div className="history-card-header">
                <span>
                  {formatDate(item.timestamp)}
                </span>

                <span>
                  Score : {formatScore(item.score)}
                </span>
              </div>

              <div className="history-card-body">
                <p>
                  Statut :{" "}
                  {item.is_anomaly
                    ? "Anomalie"
                    : "Normal"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}