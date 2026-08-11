import { useEffect, useRef, useState } from "react";
import { detectAnomaly } from "../services/anomalyService";

export function useRealtimeDetection(onResult) {
  const [enabled, setEnabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const run = async () => {
    try {
      setLoading(true);

      const result = await detectAnomaly();

      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error("Erreur détection temps réel :", error);
    } finally {
      setLoading(false);
    }
  };

  const start = () => {
    if (enabled) return;

    setEnabled(true);
    setCountdown(30);

    // Détection immédiate
    run();

    intervalRef.current = setInterval(() => {
      run();
    }, 30000);

    countdownRef.current = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          return 30;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const stop = () => {
    setEnabled(false);

    clearInterval(intervalRef.current);
    clearInterval(countdownRef.current);

    intervalRef.current = null;
    countdownRef.current = null;

    setCountdown(30);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  return {
    enabled,
    countdown,
    loading,
    start,
    stop,
    toggle: enabled ? stop : start,
  };
}