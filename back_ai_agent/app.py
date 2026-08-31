"""
Point d'entrée de l'API - Agent DevOps IA de Monitoring Intelligent.

Lancement : uvicorn app:app --reload
Documentation interactive : http://localhost:8000/docs
"""
from fastapi import FastAPI, Response, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from src.log_service import get_recent_logs
from src.history_service import lire_historique, calculer_statistiques
from config import API_TITLE, API_VERSION
from src.monitoring_agent import run_monitoring_cycle, ask_agent
from prometheus_client import Gauge, generate_latest, CONTENT_TYPE_LATEST
from src.db import create_db_and_tables
from src.auth.dependencies import get_current_user
from src.routes.auth_routes import router as auth_router
from src.crud import ajouter_message, lire_messages
from src.cache import get_cached, set_cached

app = FastAPI(
    title="AgentIA",
    version="1.0"
)
app.include_router(auth_router)

# ===============================
# CORS
# ===============================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# Compteur Prometheus

anomaly_score_gauge = Gauge(
    "anomaly_last_score",
    "Dernier score d'anomalie détecté"
)


class AskRequest(BaseModel):
    question: str

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
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
def get_stats(current_user = Depends(get_current_user)):
    cached = get_cached("stats")
    if cached:
        return cached

    result = calculer_statistiques()
    set_cached("stats", result, ttl_seconds=30)
    return result
@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/agent/ask")
def agent_ask(payload: AskRequest, current_user = Depends(get_current_user)):
    """Pose une question libre à l'agent IA (chat direct avec le LLM)."""
    answer = ask_agent(payload.question)
    ajouter_message(
        question=payload.question,
        answer=answer,
        user_id=current_user.id,
    )
    return {"question": payload.question, "answer": answer}


@app.get("/agent/history")
def agent_history(limit: int = Query(default=50), current_user = Depends(get_current_user)):
    """Historique des conversations avec l'assistant pour l'utilisateur connecté."""
    messages = lire_messages(limit=limit, user_id=current_user.id)
    return {"messages": messages}

@app.get("/logs/recent")
def logs_recent(minutes: int = Query(default=30)):
    return {"logs": get_recent_logs(minutes)}