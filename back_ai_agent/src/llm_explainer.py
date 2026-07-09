"""
Utilise Ollama (llama3.2:3b en local) pour transformer une anomalie détectée
par le module ML en explication + recommandation lisibles par un humain.
"""
import requests

from config import OLLAMA_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT


def call_ollama(prompt: str) -> str:
    """Envoie un prompt à Ollama et retourne la réponse texte."""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=OLLAMA_TIMEOUT,
        )
        response.raise_for_status()
        return response.json()["response"].strip()
    except requests.exceptions.ConnectionError:
        return "[ERREUR] Impossible de contacter Ollama. Vérifie que 'ollama serve' tourne bien."
    except Exception as e:
        return f"[ERREUR] {e}"


def build_prompt(anomaly_row) -> str:
    """Construit un prompt structuré à partir d'une ligne d'anomalie détectée (pandas Series)."""
    return f"""Tu es un assistant DevOps expert en supervision d'infrastructure.

Une anomalie a été détectée automatiquement par un système de monitoring :
- Horodatage : {anomaly_row['timestamp']}
- CPU : {anomaly_row['cpu_percent']}%
- RAM : {anomaly_row['ram_percent']}%
- Score d'anomalie (ML) : {anomaly_row['anomaly_score']:.3f} (plus négatif = plus anormal)

Réponds en français, en 3 parties courtes et claires :
1. GRAVITÉ : (faible / moyenne / critique)
2. CAUSE PROBABLE : explication courte et technique
3. RECOMMANDATION : action concrète à prendre

Sois concis, direct, professionnel."""


def explain_anomaly(anomaly_row) -> str:
    """Fonction principale : anomalie -> explication générée par le LLM."""
    prompt = build_prompt(anomaly_row)
    return call_ollama(prompt)