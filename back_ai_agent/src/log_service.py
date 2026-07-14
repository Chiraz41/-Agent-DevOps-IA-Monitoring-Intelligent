from pathlib import Path

LOG_FILE = Path("logs/server.log")


def read_logs():

    if not LOG_FILE.exists():
        return "No logs available."

    with open(LOG_FILE, "r", encoding="utf-8") as file:
        return file.read()