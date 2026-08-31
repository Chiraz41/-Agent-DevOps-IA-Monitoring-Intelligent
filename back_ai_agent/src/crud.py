from sqlmodel import Session, select
from src.models import Anomaly, Alert, Message
from src.db import engine

# --- Anomalies (déjà en place) ---

def ajouter_anomalie(data: dict):
    with Session(engine) as session:
        anomaly = Anomaly(**data)
        session.add(anomaly)
        session.commit()
        session.refresh(anomaly)
        return anomaly

def lire_historique(limit: int = None):
    with Session(engine) as session:
        statement = select(Anomaly).order_by(Anomaly.timestamp.desc())
        if limit:
            statement = statement.limit(limit)
        return session.exec(statement).all()


# --- Alertes ---

def ajouter_alerte(anomaly_id, channel: str, status: str = "pending"):
    with Session(engine) as session:
        alert = Alert(anomaly_id=anomaly_id, channel=channel, status=status)
        session.add(alert)
        session.commit()
        session.refresh(alert)
        return alert

def lire_alertes(limit: int = None):
    with Session(engine) as session:
        statement = select(Alert).order_by(Alert.sent_at.desc().nullslast())
        if limit:
            statement = statement.limit(limit)
        return session.exec(statement).all()


# --- Messages (conversation avec l'assistant) ---

def ajouter_message(question: str, answer: str, user_id=None):
    with Session(engine) as session:
        message = Message(user_id=user_id, question=question, answer=answer)
        session.add(message)
        session.commit()
        session.refresh(message)
        return message

def lire_messages(limit: int = 50, user_id=None):
    with Session(engine) as session:
        statement = select(Message).order_by(Message.created_at.desc())
        if user_id:
            statement = statement.where(Message.user_id == user_id)
        if limit:
            statement = statement.limit(limit)
        return session.exec(statement).all()