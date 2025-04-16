// src/contexts/AuthContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTokenAlert } from "./TokenAlertContext";
import React from "react";

interface AuthContextType {
  token: string | null;
  // ...
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const { showTokenAlert, hideTokenAlert } = useTokenAlert();

  // whenever token changes, compute expiration warning
  useEffect(() => {
    if (!expiresAt) return;
    const now = Date.now();
    // warn 1 minute before expiry:
    const warningTime = expiresAt - 60_000 - now;
    if (warningTime <= 0) {
      // already near expiry
      openWarning();
    } else {
      const id = setTimeout(openWarning, warningTime);
      return () => clearTimeout(id);
    }

    function openWarning() {
      showTokenAlert(
        <div>
          <h2 className="text-xl font-bold mb-2">Session Expiring Soon</h2>
          <p>Your login session will expire in less than a minute.</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                hideTokenAlert();
                // optional: force logout
              }}
              className="px-4 py-2 rounded-lg border"
            >
              Logout
            </button>
            <button
              onClick={async () => {
                // call your refresh endpoint...
                const newToken = await refreshToken();
                setToken(newToken);
                hideTokenAlert();
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Refresh Now
            </button>
          </div>
        </div>
      );
    }
  }, [expiresAt, showTokenAlert, hideTokenAlert]);

  // imagine you fetch token+exp from backend on mount/login...
  // setToken(...); setExpiresAt(decodedExpMs);

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
