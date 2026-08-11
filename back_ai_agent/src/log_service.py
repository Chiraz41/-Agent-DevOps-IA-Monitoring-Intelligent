from pathlib import Path
from datetime import datetime, timedelta

LOG_FILE = Path("logs/server.log")


def read_logs():
    if not LOG_FILE.exists():
        return "No logs available."
    with open(LOG_FILE, "r", encoding="utf-8") as file:
        return file.read()


def parse_logs():
    """Parse le fichier de logs brut en liste de dictionnaires structurés."""
    raw = read_logs()
    if raw == "No logs available.":
        return []

    parsed = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue

        parts = line.split(" ", 3)  # date, heure, niveau, message
        if len(parts) < 4:
            continue

        date_str, time_str, level, message = parts

        try:
            timestamp = datetime.strptime(
                f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S"
            )
        except ValueError:
            continue

        parsed.append({
            "timestamp": timestamp.isoformat(),
            "level": level,
            "message": message,
        })

    return parsed


def get_recent_logs(minutes: int = 30):
    """
    Renvoie les logs des N dernières minutes.
    Calculé par rapport à l'entrée la plus récente du fichier (pas datetime.now()),
    pour que ça fonctionne même avec des logs de test datés dans le passé.
    """
    logs = parse_logs()
    if not logs:
        return []

    latest_timestamp = max(
        datetime.fromisoformat(log["timestamp"]) for log in logs
    )
    cutoff = latest_timestamp - timedelta(minutes=minutes)

    return [
        log for log in logs
        if datetime.fromisoformat(log["timestamp"]) >= cutoff
    ]