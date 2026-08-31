"""
Configuration centrale du Back AI Agent.
Toutes les valeurs modifiables (URLs, seuils, noms de modèle) sont ici,
pour ne jamais avoir à toucher au code métier quand tu changes d'environnement.
"""
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
# --- Ollama / LLM ---
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "60"))

# --- Détection d'anomalies (ML) ---
ANOMALY_CONTAMINATION = float(os.getenv("ANOMALY_CONTAMINATION", "0.03"))  # % attendu d'anomalies

# --- Prometheus (à activer en Phase 4, quand la stack Docker sera prête) ---
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://localhost:9090")

# --- API ---
API_TITLE = "Agent DevOps IA - Monitoring Intelligent"
API_VERSION = "0.1.0"