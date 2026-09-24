from prometheus_client import Counter, Gauge

# Nombre total d'anomalies détectées
anomalies_total = Counter(
    "anomalies_total",
    "Nombre total d'anomalies détectées",
    ["severity"]
)

# Dernier score produit par Isolation Forest
anomaly_last_score = Gauge(
    "anomaly_last_score",
    "Dernier score d'anomalie produit par le modèle"
)