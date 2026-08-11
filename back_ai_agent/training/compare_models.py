import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)


# ============================================================
# CHEMINS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "metrics_augmented.csv"
)

REPORT_DIR = os.path.join(
    BASE_DIR,
    "reports"
)

RESULTS_FILE = os.path.join(
    REPORT_DIR,
    "model_comparison.csv"
)

BEST_MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "isolation_forest_best.pkl"
)


# ============================================================
# CHARGEMENT DES DONNEES
# ============================================================

print("=" * 60)
print("CHARGEMENT DU DATASET")
print("=" * 60)

data = pd.read_csv(DATA_PATH)

print(f"Nombre total de données : {len(data)}")

print("\nRépartition des labels :")
print(data["label"].value_counts())


# ============================================================
# VARIABLES
# ============================================================

FEATURES = [
    "cpu",
    "ram",
    "disk",
    "network"
]

X = data[FEATURES]
y = data["label"]


# ============================================================
# TRAIN / TEST
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n" + "=" * 60)
print("SEPARATION TRAIN / TEST")
print("=" * 60)

print(f"Données train : {len(X_train)}")
print(f"Données test  : {len(X_test)}")


# ============================================================
# IMPORTANT :
# Isolation Forest est entraîné uniquement
# sur les données normales.
# ============================================================

X_train_normal = X_train[y_train == 0]

print(f"Données normales utilisées : {len(X_train_normal)}")


# ============================================================
# PARAMETRES A TESTER
# ============================================================

N_ESTIMATORS_VALUES = [
    100,
    200,
    300
]

CONTAMINATION_VALUES = [
    0.03,
    0.05,
    0.08,
    0.10,
    0.15
]


# ============================================================
# STOCKAGE DES RESULTATS
# ============================================================

results = []

best_f1 = -1
best_model = None
best_params = None


# ============================================================
# EXPERIMENTATION
# ============================================================

print("\n" + "=" * 60)
print("DEBUT DES EXPERIMENTATIONS")
print("=" * 60)


for n_estimators in N_ESTIMATORS_VALUES:

    for contamination in CONTAMINATION_VALUES:

        print("\n----------------------------------------")
        print(
            f"n_estimators = {n_estimators} | "
            f"contamination = {contamination}"
        )
        print("----------------------------------------")

        # ----------------------------------------------------
        # Création du modèle
        # ----------------------------------------------------

        model = IsolationForest(
            n_estimators=n_estimators,
            contamination=contamination,
            random_state=42
        )

        # ----------------------------------------------------
        # Entraînement
        # ----------------------------------------------------

        model.fit(X_train_normal)

        # ----------------------------------------------------
        # Prédiction
        # ----------------------------------------------------

        raw_predictions = model.predict(X_test)

        # Isolation Forest :
        #
        # 1  = normal
        # -1 = anomalie
        #
        # Notre dataset :
        #
        # 0 = normal
        # 1 = anomalie

        y_pred = pd.Series(
            raw_predictions
        ).map({
            1: 0,
            -1: 1
        })

        # ----------------------------------------------------
        # Métriques
        # ----------------------------------------------------

        accuracy = accuracy_score(
            y_test,
            y_pred
        )

        precision = precision_score(
            y_test,
            y_pred,
            zero_division=0
        )

        recall = recall_score(
            y_test,
            y_pred,
            zero_division=0
        )

        f1 = f1_score(
            y_test,
            y_pred,
            zero_division=0
        )

        # ----------------------------------------------------
        # Affichage
        # ----------------------------------------------------

        print(f"Accuracy  : {accuracy:.4f}")
        print(f"Precision : {precision:.4f}")
        print(f"Recall    : {recall:.4f}")
        print(f"F1-score  : {f1:.4f}")

        # ----------------------------------------------------
        # Sauvegarde du résultat
        # ----------------------------------------------------

        results.append({
            "n_estimators": n_estimators,
            "contamination": contamination,
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1
        })

        # ----------------------------------------------------
        # Recherche du meilleur modèle
        #
        # Ici on choisit le meilleur F1-score.
        # ----------------------------------------------------

        if f1 > best_f1:

            best_f1 = f1

            best_model = model

            best_params = {
                "n_estimators": n_estimators,
                "contamination": contamination
            }


# ============================================================
# CREATION DU DOSSIER REPORTS
# ============================================================

os.makedirs(
    REPORT_DIR,
    exist_ok=True
)


# ============================================================
# SAUVEGARDE DES RESULTATS
# ============================================================

results_df = pd.DataFrame(results)

results_df = results_df.sort_values(
    by="f1_score",
    ascending=False
)

results_df.to_csv(
    RESULTS_FILE,
    index=False
)


# ============================================================
# AFFICHAGE DU CLASSEMENT
# ============================================================

print("\n" + "=" * 60)
print("CLASSEMENT DES MODELES")
print("=" * 60)

print(results_df.to_string(index=False))


# ============================================================
# MEILLEUR MODELE
# ============================================================

print("\n" + "=" * 60)
print("MEILLEUR MODELE")
print("=" * 60)

print(
    f"n_estimators : "
    f"{best_params['n_estimators']}"
)

print(
    f"contamination : "
    f"{best_params['contamination']}"
)

print(
    f"F1-score : "
    f"{best_f1:.4f}"
)


# ============================================================
# SAUVEGARDE DU MEILLEUR MODELE
# ============================================================

MODEL_DIR = os.path.dirname(
    BEST_MODEL_PATH
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

joblib.dump(
    best_model,
    BEST_MODEL_PATH
)

print(
    f"\nMeilleur modèle sauvegardé ici :\n"
    f"{BEST_MODEL_PATH}"
)

print(
    f"\nRésultats sauvegardés ici :\n"
    f"{RESULTS_FILE}"
)