import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, classification_report, confusion_matrix
)

# ============================================================
# CHARGEMENT
# ============================================================

df = pd.read_csv("../data/metrics_augmented.csv")

X = df[["cpu", "ram", "disk", "network"]]
y = df["label"]

# ============================================================
# TRAIN/TEST SPLIT STRATIFIE
# On entraine Isolation Forest sans les labels, mais on evalue
# sur un jeu de test separe pour ne pas biaiser les metriques.
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

# ============================================================
# SCALING
# Important surtout si tu ajoutes d'autres modeles (SVM, KNN...)
# Isolation Forest est moins sensible mais ca reste une bonne
# pratique, notamment a cause de l'echelle tres differente de
# "network" par rapport aux autres colonnes en %.
# ============================================================

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ============================================================
# ENTRAINEMENT
# contamination = ratio REEL d'anomalies dans les donnees
# (au lieu de 'auto' qui laisse le modele deviner un seuil)
# ============================================================

model = IsolationForest(
    n_estimators=300,
    contamination=0.20,
    max_samples="auto",
    random_state=42,
    n_jobs=-1,
)

model.fit(X_train_scaled)

# ============================================================
# PREDICTION
# IsolationForest retourne -1 (anomalie) / 1 (normal)
# On convertit vers notre convention : 1 = anomalie, 0 = normal
# ============================================================

raw_pred = model.predict(X_test_scaled)
y_pred = (raw_pred == -1).astype(int)

# ============================================================
# EVALUATION
# ============================================================

print("===== Performances du modele =====")
print(f"Accuracy  : {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision : {precision_score(y_test, y_pred):.4f}")
print(f"Recall    : {recall_score(y_test, y_pred):.4f}")
print(f"F1-score  : {f1_score(y_test, y_pred):.4f}")

print("\nRapport detaille :")
print(classification_report(y_test, y_pred, target_names=["normal", "anomalie"]))

print("Matrice de confusion :")
print(confusion_matrix(y_test, y_pred))

# ============================================================
# BONUS : comparaison avec un modele supervise
# Puisque tu as les labels, ca vaut le coup de comparer avec
# un classifieur supervise pour voir le "plafond" de performance
# atteignable sur ces donnees.
# ============================================================

from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=300, random_state=42, class_weight="balanced")
rf.fit(X_train_scaled, y_train)
y_pred_rf = rf.predict(X_test_scaled)

print("\n===== Comparaison RandomForest (supervise) =====")
print(f"Accuracy  : {accuracy_score(y_test, y_pred_rf):.4f}")
print(f"Precision : {precision_score(y_test, y_pred_rf):.4f}")
print(f"Recall    : {recall_score(y_test, y_pred_rf):.4f}")
print(f"F1-score  : {f1_score(y_test, y_pred_rf):.4f}")