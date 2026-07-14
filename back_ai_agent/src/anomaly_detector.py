import os
import joblib
import pandas as pd


class AnomalyDetector:

    def __init__(self):
        model_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "model",
            "isolation_forest.pkl"
        )

        try:
            self.model = joblib.load(model_path)

        except Exception as e:
            raise RuntimeError(
                f"Impossible de charger le modèle : {e}"
            )

    def predict(self, metrics):
        """
        Analyse les métriques serveur

        metrics exemple:
        {
            "cpu": 80,
            "ram": 70,
            "disk": 60,
            "network": 150
        }
        """

        data = pd.DataFrame(
            [[
                metrics["cpu"],
                metrics["ram"],
                metrics["disk"],
                metrics["network"]
            ]],
            columns=[
                "cpu",
                "ram",
                "disk",
                "network"
            ]
        )

        prediction = self.model.predict(data)
        score = self.model.decision_function(data)

        if prediction[0] == -1:
            status = "ANOMALIE"
        else:
            status = "NORMAL"

        return {
            "status": status,
            "prediction": int(prediction[0]),
            "score": float(score[0]),
            "metrics": metrics
        }