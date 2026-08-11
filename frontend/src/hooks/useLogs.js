import { useEffect, useState } from "react";
import { getRecentLogs } from "../services/logsService";

export function useLogs(minutes = 30) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecentLogs(minutes);
        setLogs(data.logs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [minutes]);

  return { logs, loading, error };
}