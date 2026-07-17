from prometheus_client import Counter

anomalies_total = Counter(
    "anomalies_total",
    "Nombre total d'anomalies détectées",
    ["severity"]
)