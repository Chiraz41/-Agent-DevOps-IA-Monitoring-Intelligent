import ollama
from src.prompt_builder import build_prompt


def call_ollama(prompt):
    try:

        response = ollama.generate(
            model="llama3.2:3b",
            prompt=prompt
        )

        return response["response"]

    except Exception as e:

        return f"Erreur Ollama : {e}"



def explain_anomaly(metrics, severity, logs):

    from src.prompt_builder import build_prompt

    prompt = build_prompt(
        metrics,
        severity,
        logs
    )

    return call_ollama(prompt)