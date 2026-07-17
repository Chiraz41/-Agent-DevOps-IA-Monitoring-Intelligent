"""
Orchestrateur du pipeline :
Métriques -> Détection ML -> Gravité -> Prompt -> Explication LLM.

Appelé par app.py (API FastAPI).
"""

from src.anomaly_detector import AnomalyDetector
from src.llm_explainer import explain_anomaly
from src.severity import calculate_severity
from src.log_service import read_logs
import pandas as pd
from pathlib import Path
from src.history_service import ajouter_anomalie
from src.metrics import anomalies_total



METRICS_FILE = Path("data/metrics.csv")

def read_metrics():

    if not METRICS_FILE.exists():
        raise FileNotFoundError("metrics.csv introuvable")

    return pd.read_csv(METRICS_FILE)

detector = AnomalyDetector()

def run_monitoring_cycle(n_points: int = 100) -> dict:
    """
    Exécute un cycle complet de surveillance.
    """

    # 1. Récupération des métriques
    df = read_metrics()

    df = df.tail(n_points)

    anomalies = []

    logs = read_logs()


    # 2. Analyse de chaque métrique
    for _, row in df.iterrows():

        metrics = {
    "cpu": float(row["cpu"]),
    "ram": float(row["ram"]),
    "disk": float(row["disk"]),
    "network": float(row["network"])
}


        # Détection anomalie
        prediction = detector.predict(metrics)


        if prediction["status"] == "ANOMALIE":

            severity = calculate_severity(
                metrics["cpu"],
                metrics["ram"],
                metrics["disk"]
            )


            explanation = explain_anomaly(
                metrics,
                severity,
                logs
            )


            anomalie_data = {
                "metrics": metrics,
                "severity": severity,
                "score": prediction["score"],
                "explanation": explanation,
            }

            anomalies.append(anomalie_data)
            ajouter_anomalie(anomalie_data)
            anomalies_total.labels(severity=severity).inc()


    # IMPORTANT : retourner le résultat
    return {
        "total_points": n_points,
        "total_anomalies": len(anomalies),
        "anomalies": anomalies
    }


def ask_agent(question: str) -> str:
    """
    Permet de poser une question libre à l'agent IA.
    """

    from src.llm_explainer import call_ollama

    return call_ollama(question)