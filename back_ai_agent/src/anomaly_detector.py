import os
import joblib
import pandas as pd


class AnomalyDetector:

    def __init__(self):
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, "..", "model", "isolation_forest.pkl")
        scaler_path = os.path.join(base_dir, "..", "model", "scaler.pkl")

        try:
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
        except Exception as e:
            raise RuntimeError(f"Impossible de charger le modèle : {e}")

    def predict(self, metrics):
        data = pd.DataFrame(
            [[metrics["cpu"], metrics["ram"], metrics["disk"], metrics["network"]]],
            columns=["cpu", "ram", "disk", "network"],
        )

        data_scaled = self.scaler.transform(data)  # <-- l'étape qui manquait

        prediction = self.model.predict(data_scaled)
        score = self.model.decision_function(data_scaled)

        status = "ANOMALIE" if prediction[0] == -1 else "NORMAL"

        return {
            "status": status,
            "prediction": int(prediction[0]),
            "score": float(score[0]),
            "metrics": metrics,
        }