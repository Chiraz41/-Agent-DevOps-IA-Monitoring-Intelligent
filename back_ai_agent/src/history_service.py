from src.crud import ajouter_anomalie as _ajouter, lire_historique as _lire

def ajouter_anomalie(anomalie: dict):
    """anomalie doit contenir : severity, score, metrics (dict), explanation (optionnel)"""
    return _ajouter(anomalie)

def lire_historique(limit: int = None):
    return _lire(limit)

def calculer_statistiques():
    historique = lire_historique()

    if not historique:
        return {
            "total_anomalies": 0,
            "par_severite": {},
            "score_moyen": 0,
            "metrique_la_plus_touchee": None,
            "repartition_metriques": {},
        }

    total = len(historique)

    par_severite = {}
    for a in historique:
        sev = a.severity or "inconnue"
        par_severite[sev] = par_severite.get(sev, 0) + 1

    scores = [a.score for a in historique if a.score is not None]
    score_moyen = sum(scores) / len(scores) if scores else 0

    compteur_metriques = {}
    for a in historique:
        for nom_metrique in (a.metrics or {}).keys():
            compteur_metriques[nom_metrique] = compteur_metriques.get(nom_metrique, 0) + 1

    metrique_la_plus_touchee = (
        max(compteur_metriques, key=compteur_metriques.get) if compteur_metriques else None
    )

    return {
        "total_anomalies": total,
        "par_severite": par_severite,
        "score_moyen": round(score_moyen, 3),
        "metrique_la_plus_touchee": metrique_la_plus_touchee,
        "repartition_metriques": compteur_metriques,
    }