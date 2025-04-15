// src/contexts/ModalContext.tsx
import { createContext, ReactNode, useContext, useState } from "react";
import { Modal } from "../components/Modal";
import React from "react";

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  function showModal(c: ReactNode) {
    setContent(c);
    setIsOpen(true);
  }

  function hideModal() {
    setIsOpen(false);
    setContent(null);
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={hideModal}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}

// custom hook for ease of use
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be inside ModalProvider");
  return ctx;
}
