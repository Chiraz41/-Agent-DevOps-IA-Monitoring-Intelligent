import random
import pandas as pd

random.seed(42)

data = []

N_SAMPLES = 5000

for _ in range(N_SAMPLES):

    cpu = random.uniform(5, 60)
    ram = random.uniform(20, 70)
    disk = random.uniform(20, 80)
    network = random.uniform(50, 300)

    label = 0

    # 20 % des données seront anormales
    if random.random() < 0.20:

        label = 1

        anomaly = random.choice([
            "cpu",
            "ram",
            "disk",
            "network",
            "multiple"
        ])

        if anomaly == "cpu":
            cpu = random.uniform(90, 100)

        elif anomaly == "ram":
            ram = random.uniform(90, 100)

        elif anomaly == "disk":
            disk = random.uniform(95, 100)

        elif anomaly == "network":
            network = random.uniform(900, 1500)

        elif anomaly == "multiple":
            cpu = random.uniform(90,100)
            ram = random.uniform(90,100)
            disk = random.uniform(95,100)
            network = random.uniform(900,1500)

    data.append([
        round(cpu,2),
        round(ram,2),
        round(disk,2),
        round(network,2),
        label
    ])

df = pd.DataFrame(data,
                  columns=[
                      "cpu",
                      "ram",
                      "disk",
                      "network",
                      "label"
                  ])

df.to_csv("data/metrics_augmented.csv", index=False)

print(df.head())
print()
print(df["label"].value_counts())

print("\nDataset créé avec succès.")