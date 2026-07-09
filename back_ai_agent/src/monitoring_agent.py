"""
Orchestrateur du pipeline : Métriques -> Détection ML -> Explication LLM -> Résultat structuré.
Appelé par app.py (API FastAPI).
"""
from src.data_generator import generate_metrics
from src.anomaly_detector import AnomalyDetector
from src.llm_explainer import explain_anomaly, call_ollama


def run_monitoring_cycle(n_points: int = 100) -> dict:
    """
    Exécute un cycle complet de surveillance et retourne un résultat structuré (JSON-friendly),
    prêt à être renvoyé par un endpoint FastAPI.
    """
    # Étape actuelle : données simulées.
    # Étape suivante (Phase 4) : remplacer par une vraie requête à l'API Prometheus.
    df = generate_metrics(n_points=n_points)

    detector = AnomalyDetector()
    detector.fit(df)
    result = detector.predict(df)

    anomalies_df = result[result["is_anomaly"]]

    anomalies = []
    for _, row in anomalies_df.iterrows():
        anomalies.append({
            "timestamp": str(row["timestamp"]),
            "cpu_percent": float(row["cpu_percent"]),
            "ram_percent": float(row["ram_percent"]),
            "anomaly_score": float(row["anomaly_score"]),
            "explanation": explain_anomaly(row),
        })

    return {
        "total_points_analyzed": n_points,
        "anomalies_count": len(anomalies),
        "anomalies": anomalies,
    }


def ask_agent(question: str) -> str:
    """Permet de poser une question libre à l'agent IA (endpoint /agent/ask)."""
    return call_ollama(question)