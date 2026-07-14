# """
# Génère des métriques système simulées :
# CPU, RAM, disque, réseau avec anomalies injectées.
# """

# import pandas as pd
# import numpy as np


# def generate_metrics(
#     n_points: int = 200,
#     anomaly_rate: float = 0.03,
#     seed: int | None = None
# ) -> pd.DataFrame:

#     rng = np.random.default_rng(seed)

#     timestamps = pd.date_range(
#         end=pd.Timestamp.now(),
#         periods=n_points,
#         freq="min"
#     )

#     # Valeurs normales
#     cpu = rng.normal(loc=30, scale=5, size=n_points)
#     ram = rng.normal(loc=50, scale=7, size=n_points)
#     disk = rng.normal(loc=50, scale=10, size=n_points)
#     network = rng.normal(loc=200, scale=50, size=n_points)


#     # Injection des anomalies
#     is_anomaly = rng.random(n_points) < anomaly_rate

#     cpu = np.where(
#         is_anomaly,
#         rng.uniform(90, 100, n_points),
#         cpu
#     )

#     ram = np.where(
#         is_anomaly,
#         rng.uniform(90, 100, n_points),
#         ram
#     )

#     disk = np.where(
#         is_anomaly,
#         rng.uniform(90, 100, n_points),
#         disk
#     )

#     network = np.where(
#         is_anomaly,
#         rng.uniform(800, 1000, n_points),
#         network
#     )


#     df = pd.DataFrame({

#         "timestamp": timestamps,

#         "cpu": np.clip(cpu, 0, 100).round(1),

#         "ram": np.clip(ram, 0, 100).round(1),

#         "disk": np.clip(disk, 0, 100).round(1),

#         "network": np.clip(network, 0, None).round(1),

#         "is_true_anomaly": is_anomaly
#     })


#     return df