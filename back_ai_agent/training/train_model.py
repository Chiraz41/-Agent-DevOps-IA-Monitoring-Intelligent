import os
import joblib
import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    confusion_matrix,
    classification_report,
)

# ===============================
# Chemins
# ===============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "metrics.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.pkl")

# ===============================
# Lecture du dataset
# ===============================

print("Lecture du dataset...")

data = pd.read_csv(DATA_PATH)

print(data.head())

# ===============================
# Sélection des variables
# ===============================

X = data[["cpu", "ram", "disk", "network"]]

# ===============================
# Vérification de la présence de labels réels
# ===============================
# IMPORTANT : IsolationForest est non supervisé. Pour calculer
# accuracy/précision/matrice de confusion, il faut une colonne
# de vérité terrain dans le CSV. On suppose ici qu'elle s'appelle
# "label" et contient 0 (normal) / 1 (anomalie).
# Adaptez le nom de colonne si besoin.

LABEL_COL = "label"

has_labels = LABEL_COL in data.columns

if not has_labels:
    print(
        f"\n[ATTENTION] Aucune colonne '{LABEL_COL}' trouvée dans le dataset.\n"
        "Impossible de calculer accuracy / précision / matrice de confusion "
        "sans vérité terrain. Le modèle sera entraîné normalement, mais "
        "l'évaluation sera ignorée.\n"
    )

# ===============================
# Création du modèle
# ===============================

print("Création du modèle Isolation Forest...")

model = IsolationForest(
    n_estimators=100,
    contamination=0.1,
    random_state=42
)

# ===============================
# Entraînement
# ===============================

print("Entraînement...")

model.fit(X)

# ===============================
# Évaluation (si labels disponibles)
# ===============================

if has_labels:
    print("\nÉvaluation du modèle...")

    # IsolationForest.predict renvoie 1 (normal) ou -1 (anomalie)
    raw_preds = model.predict(X)

    # Conversion vers 0 (normal) / 1 (anomalie) pour matcher le format
    # habituel des labels de vérité terrain
    y_pred = pd.Series(raw_preds).map({1: 0, -1: 1})
    y_true = data[LABEL_COL]

    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, zero_division=0)
    cm = confusion_matrix(y_true, y_pred)

    print(f"Accuracy  : {accuracy:.4f}")
    print(f"Précision : {precision:.4f}")
    print("\nMatrice de confusion :")
    print("                Prédit Normal   Prédit Anomalie")
    print(f"Réel Normal        {cm[0][0]:<15} {cm[0][1]}")
    print(f"Réel Anomalie      {cm[1][0]:<15} {cm[1][1]}")

    print("\nRapport de classification complet :")
    print(classification_report(y_true, y_pred, target_names=["Normal", "Anomalie"]))

# ===============================
# Sauvegarde
# ===============================

os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, MODEL_PATH)

print(f"\nModèle sauvegardé dans : {MODEL_PATH}")