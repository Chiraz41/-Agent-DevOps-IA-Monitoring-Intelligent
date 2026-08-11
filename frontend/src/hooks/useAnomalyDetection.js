import { useState } from "react";
import { detectAnomaly } from "../services/anomalyService";

export function useAnomalyDetection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runDetection = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await detectAnomaly();

      setData(result);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    runDetection,
  };
}