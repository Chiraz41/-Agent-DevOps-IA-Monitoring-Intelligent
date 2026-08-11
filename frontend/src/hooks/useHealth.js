import { useCallback, useEffect, useState } from "react";
import { getHealth } from "../services/healthService";

export function useHealth(interval = 30000) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      const data = await getHealth();

      setHealth(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setHealth(null);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkHealth();
    }, interval);

    return () => clearInterval(timer);
  }, [checkHealth, interval]);

  return {
    health,
    loading,
    error,
    refreshHealth: checkHealth,
  };
}