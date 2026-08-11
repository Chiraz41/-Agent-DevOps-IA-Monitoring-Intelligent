import {
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { formatScore } from "../../utils/formatters";

export default function AnomalyStatus({ data }) {
  if (!data) {
    return (
      <div className="anomaly-status neutral">
        <span>Aucune analyse effectuée</span>
      </div>
    );
  }

  if (data.is_anomaly) {
    return (
      <div className="anomaly-status anomaly">
        <AlertTriangle size={20} />

        <div>
          <strong>Anomalie détectée</strong>

          <span>
            Score : {formatScore(data.anomaly_score)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="anomaly-status normal">
      <CheckCircle2 size={20} />

      <div>
        <strong>Système normal</strong>

        <span>
          Score : {formatScore(data.anomaly_score)}
        </span>
      </div>
    </div>
  );
}