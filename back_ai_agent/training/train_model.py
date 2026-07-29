import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    confusion_matrix,
    recall_score,
    f1_score,
    classification_report,
)

# Chemins

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "metrics.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.pkl")
# Dossier des rapports
REPORT_DIR = os.path.join(BASE_DIR, "reports")

# Fichiers de rapport
METRICS_FILE = os.path.join(REPORT_DIR, "model_metrics.txt")
CONFUSION_FILE = os.path.join(REPORT_DIR, "confusion_matrix.csv")
CLASSIFICATION_FILE = os.path.join(REPORT_DIR, "classification_report.txt")

# Lecture du dataset

print("Lecture du dataset...")

data = pd.read_csv("data/metrics_augmented.csv")

print(data.head())

# Sélection des variables

LABEL_COL = "label"

X = data[["cpu", "ram", "disk", "network"]]
y = data[LABEL_COL]

# Séparation Train / Test
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"Nombre d'exemples d'entraînement : {len(X_train)}")
print(f"Nombre d'exemples de test : {len(X_test)}")

# Création du modèle

print("Création du modèle Isolation Forest...")

model = IsolationForest(
    n_estimators=100,
    contamination=0.1,
    random_state=42
)

# Entraînement

print("Entraînement...")

# Isolation Forest s'entraîne uniquement sur les données normales
X_train_normal = X_train[y_train == 0]

print(f"Données normales utilisées pour l'entraînement : {len(X_train_normal)}")

model.fit(X_train_normal)

# Évaluation 

print("\nÉvaluation du modèle...")

raw_preds = model.predict(X_test)

    # Conversion :
    # 1  -> normal -> 0
    # -1 -> anomalie -> 1
y_pred = pd.Series(raw_preds).map({
      1:0,
      -1:1
})

y_true = y_test.reset_index(drop=True)

accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred, zero_division=0)
recall = recall_score(y_true, y_pred, zero_division=0)
f1 = f1_score(y_true, y_pred, zero_division=0)
cm = confusion_matrix(y_true, y_pred)

report = classification_report(
        y_true,
        y_pred,
        target_names=["Normal", "Anomalie"]
)

print(f"Accuracy  : {accuracy:.4f}")
print(f"Precision : {precision:.4f}")
print(f"Recall    : {recall:.4f}")
print(f"F1-score  : {f1:.4f}")
print("\nMatrice de confusion :")
print(cm)
print("\nRapport de classification :")
print(report)

# Sauvegarde des résultats

os.makedirs(REPORT_DIR, exist_ok=True)

# 1. Sauvegarde des métriques
with open(METRICS_FILE, "w", encoding="utf-8") as f:
    f.write("===== Performances du modèle =====\n\n")
    f.write(f"Accuracy  : {accuracy:.4f}\n")
    f.write(f"Precision : {precision:.4f}\n")
    f.write(f"Recall    : {recall:.4f}\n")
    f.write(f"F1-score  : {f1:.4f}\n")

# 2. Sauvegarde de la matrice de confusion
cm_df = pd.DataFrame(
    cm,
    index=["Réel Normal", "Réel Anomalie"],
    columns=["Prédit Normal", "Prédit Anomalie"]
)
cm_df.to_csv(CONFUSION_FILE)

# 3. Sauvegarde du rapport de classification
with open(CLASSIFICATION_FILE, "w", encoding="utf-8") as f:
    f.write(report)