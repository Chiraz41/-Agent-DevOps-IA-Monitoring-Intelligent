"""
Détection d'anomalies sur les métriques système avec Isolation Forest.

Pourquoi Isolation Forest ?
- Apprentissage non supervisé : pas besoin de labelliser des données à l'avance
- Rapide, léger, adapté à des métriques comme CPU/RAM/latence
- Fonctionne bien même avec peu de données historiques
"""
import pandas as pd
from sklearn.ensemble import IsolationForest

from config import ANOMALY_CONTAMINATION


class AnomalyDetector:
    def __init__(self, contamination: float = ANOMALY_CONTAMINATION):
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100,
        )
        self.features = ["cpu_percent", "ram_percent"]
        self.is_fitted = False

    def fit(self, df: pd.DataFrame):
        """Entraîne le modèle sur des données historiques (idéalement des données 'normales')."""
        self.model.fit(df[self.features])
        self.is_fitted = True

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Ajoute deux colonnes au DataFrame :
        - anomaly_score : plus c'est négatif, plus c'est anormal
        - is_anomaly : True/False
        """
        if not self.is_fitted:
            raise RuntimeError("Le modèle doit être entraîné avec .fit() avant .predict()")

        result = df.copy()
        result["anomaly_score"] = self.model.decision_function(df[self.features])
        result["is_anomaly"] = self.model.predict(df[self.features]) == -1
        return result