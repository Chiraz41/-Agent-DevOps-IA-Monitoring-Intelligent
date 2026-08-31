import os
import numpy as np
import pandas as pd

# ============================================================
# CONFIGURATION
# ============================================================

np.random.seed(42)

N_SAMPLES = 20000
ANOMALY_RATIO = 0.20

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "metrics_augmented.csv")

def clip(x, lo, hi):
    return np.clip(x, lo, hi)

def generate_row():
    # --------------------------------------------------------
    # Facteur de charge globale partagé (source de corrélation)
    # --------------------------------------------------------
    charge_globale = np.random.normal(0, 1)  # variable latente

    cpu = 30 + 12 * charge_globale + np.random.normal(0, 8)
    ram = 40 + 10 * charge_globale + np.random.normal(0, 9)
    disk = 45 + 5 * charge_globale + np.random.normal(0, 12)
    network = 150 + 40 * charge_globale + np.random.normal(0, 40)

    cpu = clip(cpu, 0, 100)
    ram = clip(ram, 0, 100)
    disk = clip(disk, 0, 100)
    network = clip(network, 10, None)

    label = 0
    anomaly_type = "none"

    if np.random.random() < ANOMALY_RATIO:
        label = 1
        anomaly_type = np.random.choice([
            "cpu", "ram", "disk", "network",
            "cpu_ram", "cpu_network", "ram_disk",
            "multiple", "subtle"
        ])

        if anomaly_type == "cpu":
            cpu = np.random.normal(np.random.choice([80, 90, 98]), 4)

        elif anomaly_type == "ram":
            ram = np.random.normal(np.random.choice([80, 90, 98]), 4)

        elif anomaly_type == "disk":
            disk = np.random.normal(np.random.choice([85, 93, 99]), 3)

        elif anomaly_type == "network":
            network = np.random.normal(np.random.choice([750, 2000, 6000]), 400)

        elif anomaly_type == "cpu_ram":
            cpu = np.random.normal(88, 8)
            ram = np.random.normal(88, 8)

        elif anomaly_type == "cpu_network":
            cpu = np.random.normal(88, 8)
            network = np.random.normal(2500, 900)

        elif anomaly_type == "ram_disk":
            ram = np.random.normal(88, 8)
            disk = np.random.normal(90, 6)

        elif anomaly_type == "multiple":
            cpu = np.random.normal(93, 5)
            ram = np.random.normal(93, 5)
            disk = np.random.normal(95, 4)
            network = np.random.normal(6000, 1500)

        elif anomaly_type == "subtle":
            # Anomalie proche de la zone normale, mais un cran
            # au-dessus SUR PLUSIEURS metriques simultanement.
            # C'est la co-occurrence qui est anormale, pas une
            # seule valeur extreme.
            cpu = np.random.normal(72, 6)
            ram = np.random.normal(72, 6)
            disk = np.random.normal(75, 8)
            network = np.random.normal(700, 150)

    cpu = round(float(clip(cpu, 0, 100)), 2)
    ram = round(float(clip(ram, 0, 100)), 2)
    disk = round(float(clip(disk, 0, 100)), 2)
    network = round(float(clip(network, 5, None)), 2)

    return cpu, ram, disk, network, label


# ============================================================
# GENERATION AVEC DEDOUBLONNAGE
# ============================================================

rows = set()
data = []

attempts = 0
max_attempts = N_SAMPLES * 5

while len(data) < N_SAMPLES and attempts < max_attempts:
    attempts += 1
    row = generate_row()
    key = row[:4]  # on ignore le label pour la dedup

    if key in rows:
        continue  # doublon (ou quasi-doublon apres arrondi) -> on saute

    rows.add(key)
    data.append(row)

if len(data) < N_SAMPLES:
    print(f"Attention : seulement {len(data)} lignes uniques generees "
          f"apres {attempts} tentatives.")

df = pd.DataFrame(data, columns=["cpu", "ram", "disk", "network", "label"])

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
df.to_csv(OUTPUT_PATH, index=False)

# ============================================================
# INFORMATIONS
# ============================================================

print("=" * 50)
print("DATASET AUGMENTE (v2 - distributions realistes)")
print("=" * 50)
print(f"\nNombre total de lignes : {len(df)}")
print(f"Lignes dupliquees restantes : {df.duplicated().sum()}")
print("\nRepartition des labels :")
print(df["label"].value_counts())
print("\nPourcentage des classes :")
print(df["label"].value_counts(normalize=True).mul(100).round(2))
print("\nStatistiques :")
print(df.describe())
print(f"\nFichier : {OUTPUT_PATH}")