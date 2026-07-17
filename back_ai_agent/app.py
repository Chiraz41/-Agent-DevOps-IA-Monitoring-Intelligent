"""
Point d'entrée de l'API - Agent DevOps IA de Monitoring Intelligent.

Lancement : uvicorn app:app --reload
Documentation interactive : http://localhost:8000/docs
"""
from fastapi import FastAPI
from pydantic import BaseModel
from src.history_service import lire_historique, calculer_statistiques
from config import API_TITLE, API_VERSION
from src.monitoring_agent import run_monitoring_cycle, ask_agent
from database.database import engine
from database.models import Base
from typing import Optional
from fastapi import Query
from prometheus_client import Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response
from src.metrics import anomalies_total

# Compteurs Prometheus

anomaly_score_gauge = Gauge("anomaly_last_score", "Dernier score d'anomalie détecté")

app = FastAPI(title=API_TITLE, version=API_VERSION)
Base.metadata.create_all(bind=engine)

class AskRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"status": "ok", "service": API_TITLE, "version": API_VERSION}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/anomalies")
def get_anomalies(n_points: int = 100):
    """
    Lance un cycle de surveillance : génère/collecte des métriques,
    détecte les anomalies (ML) et génère une explication pour chacune (LLM).
    """
    return run_monitoring_cycle(n_points=n_points)

@app.get("/api/history")
def api_history(limit: Optional[int] = Query(default=None)):
    """Historique complet des anomalies détectées"""
    return lire_historique(limit)

@app.get("/stats")
def get_stats():
    """Statistiques globales sur les anomalies détectées"""
    return calculer_statistiques()
@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/agent/ask")
def agent_ask(payload: AskRequest):
    """Pose une question libre à l'agent IA (chat direct avec le LLM)."""
    return {"question": payload.question, "answer": ask_agent(payload.question)}