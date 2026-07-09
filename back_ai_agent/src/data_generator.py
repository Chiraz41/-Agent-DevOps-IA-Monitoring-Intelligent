"""
Génère des métriques système simulées (CPU, RAM) avec quelques anomalies injectées.
Utile pour développer et tester le module IA avant de brancher Prometheus (Phase 4).
"""
import pandas as pd
import numpy as np


def generate_metrics(n_points: int = 200, anomaly_rate: float = 0.03, seed: int | None = None) -> pd.DataFrame:
    """
    Simule une série temporelle de métriques CPU et RAM.
    - Comportement normal : CPU ~ 20-40%, RAM ~ 40-60%
    - Anomalies : pics soudains (CPU > 90%, RAM > 90%)
    """
    rng = np.random.default_rng(seed)
    timestamps = pd.date_range(end=pd.Timestamp.now(), periods=n_points, freq="min")

    cpu = rng.normal(loc=30, scale=5, size=n_points)
    ram = rng.normal(loc=50, scale=7, size=n_points)

    is_anomaly = rng.random(n_points) < anomaly_rate
    cpu = np.where(is_anomaly, rng.uniform(90, 100, n_points), cpu)
    ram = np.where(is_anomaly, rng.uniform(88, 99, n_points), ram)

    df = pd.DataFrame({
        "timestamp": timestamps,
        "cpu_percent": np.clip(cpu, 0, 100).round(1),
        "ram_percent": np.clip(ram, 0, 100).round(1),
        "is_true_anomaly": is_anomaly,  # utile seulement pour valider ton modèle pendant les tests
    })
    return df