from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: str = Field(default="devops")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Anomaly(SQLModel, table=True):
    __tablename__ = "anomalies"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    severity: Optional[str] = None
    score: Optional[float] = None
    metrics: dict = Field(default={}, sa_column=Column(JSON))
    explanation: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Alert(SQLModel, table=True):
    __tablename__ = "alerts"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    anomaly_id: uuid.UUID = Field(foreign_key="anomalies.id")
    channel: str
    status: str = Field(default="pending")
    sent_at: Optional[datetime] = None


class Message(SQLModel, table=True):
    __tablename__ = "messages"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    question: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.utcnow)