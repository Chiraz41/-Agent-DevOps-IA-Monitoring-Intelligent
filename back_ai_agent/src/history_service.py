import json
import os
from datetime import datetime

HISTORY_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "history.json")

def ajouter_anomalie(anomalie: dict):
    anomalie["timestamp"] = datetime.now().isoformat()
    historique = lire_historique()
    historique.append(anomalie)
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, "w") as f:
        json.dump(historique, f, indent=2)

def lire_historique(limit: int = None):
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        data = json.load(f)
    if limit:
        return data[-limit:]
    return data
def calculer_statistiques():
    historique = lire_historique()

    if not historique:
        return {
            "total_anomalies": 0,
            "par_severite": {},
            "score_moyen": 0,
            "metrique_la_plus_touchee": None
        }

    total = len(historique)

    # Répartition par sévérité
    par_severite = {}
    for a in historique:
        sev = a.get("severity", "inconnue")
        par_severite[sev] = par_severite.get(sev, 0) + 1

    # Score moyen
    scores = [a.get("score", 0) for a in historique if a.get("score") is not None]
    score_moyen = sum(scores) / len(scores) if scores else 0

    # Métrique la plus souvent en cause (cpu, ram, disk, network)
    compteur_metriques = {}
    for a in historique:
        metrics = a.get("metrics", {})
        for nom_metrique, valeur in metrics.items():
            compteur_metriques[nom_metrique] = compteur_metriques.get(nom_metrique, 0) + 1

    metrique_la_plus_touchee = max(compteur_metriques, key=compteur_metriques.get) if compteur_metriques else None

    return {
        "total_anomalies": total,
        "par_severite": par_severite,
        "score_moyen": round(score_moyen, 3),
        "metrique_la_plus_touchee": metrique_la_plus_touchee,
        "repartition_metriques": compteur_metriques
    }