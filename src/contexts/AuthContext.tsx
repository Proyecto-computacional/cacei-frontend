import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useModal } from "../contexts/TokenAlertContext";
import api from "../services/api"; // your Axios instance
import RefreshTokenModal from "../components/TokenAlert";

interface AuthContextType {
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const { showModal, hideModal } = useModal();

  // Whenever token changes (e.g., on login or manual set), parse its expiry and schedule warning
  useEffect(() => {
    if (!token) return;

    // Optionally decode token to get exp, or assume expiresAt set separately on login/refresh
    // Here we rely on setExpiresAt being called with a timestamp
    if (!expiresAt) return;

    const now = Date.now();
    const msUntilWarning = expiresAt - now - 60_000; // warn 1 minute before

    const timerId =
      msUntilWarning > 0
        ? window.setTimeout(openWarning, msUntilWarning)
        : window.setTimeout(openWarning, 0);

    return () => clearTimeout(timerId);

    function openWarning() {
      showModal(
        <RefreshTokenModal
          hideModal={hideModal}
          setToken={handleSetToken}
          setExpiresAt={handleSetExpiresAt}
        />
      );
    }
  }, [expiresAt, token, showModal, hideModal]);

  // Handlers to update token and expiry in state & storage
  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleSetExpiresAt = (newExpires: number) => {
    setExpiresAt(newExpires);
  };

  // Example login function
  const login = async (rpe: string, password: string) => {
    // call your login endpoint
    const response = await api.post(
      "/api/auth/login",
      { rpe, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const { token: receivedToken, expires_at } = response.data;
    handleSetToken(receivedToken);
    handleSetExpiresAt(new Date(expires_at).getTime());
  };

  // Logout clears token & expiry
  const logout = () => {
    setToken(null);
    setExpiresAt(null);
    localStorage.removeItem("token");
    // optional: call logout API
  };

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
