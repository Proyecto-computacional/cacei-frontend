// src/contexts/TokenAlertContext.tsx
import { createContext, ReactNode, useContext, useState } from "react";
import { TokenAlert } from "../components/TokenAlert";
import React from "react";

type TokenAlertContextType = {
  showTokenAlert: (content: ReactNode) => void;
  hideTokenAlert: () => void;
};

const TokenAlertContext = createContext<TokenAlertContextType | undefined>(
  undefined
);

export function TokenAlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  function showTokenAlert(c: ReactNode) {
    setContent(c);
    setIsOpen(true);
  }

  function hideTokenAlert() {
    setIsOpen(false);
    setContent(null);
  }

  return (
    <TokenAlertContext.Provider value={{ showTokenAlert, hideTokenAlert }}>
      {children}
      <TokenAlert isOpen={isOpen} onClose={hideTokenAlert}>
        {content}
      </TokenAlert>
    </TokenAlertContext.Provider>
  );
}

// custom hook for ease of use
export function useTokenAlert() {
  const ctx = useContext(TokenAlertContext);
  if (!ctx) throw new Error("useTokenAlert must be inside TokenAlertProvider");
  return ctx;
}
