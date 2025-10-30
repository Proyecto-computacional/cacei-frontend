import { useEffect, useState } from "react";
import api from "./api";

export const useSessionWatcher = (onExpire, onWarning, location) => {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if(location.pathname === '/') return;
      try {
        const res = await api.get("/api/auth/status");

        setRemaining(res.data.remaining_seconds);

        if (res.data.remaining_seconds <= (60 * 5)) {
          onWarning?.();
        }
        if (res.data.remaining_seconds <= 0) {
          onExpire?.();
        }
      } catch {
        onExpire?.();
      }
    };

    // Primera llamada
    fetchStatus();

    // Checar cada minuto
    const interval = setInterval(fetchStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  return remaining;
};