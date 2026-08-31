import redis
import json
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

def get_cached(key: str):
    value = redis_client.get(key)
    return json.loads(value) if value else None

def set_cached(key: str, value, ttl_seconds: int = 30):
    redis_client.set(key, json.dumps(value), ex=ttl_seconds)