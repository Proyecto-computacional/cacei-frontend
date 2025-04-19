// src/contexts/ModalContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { Modal } from '../components/Modal';
import { useLocation } from 'react-router-dom';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const location = useLocation();

  const showModal = (c) => {
    setContent(c);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  // Avoid rendering modal on the login route
  const shouldRenderModal = location.pathname !== '/login';

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {shouldRenderModal && (
        <Modal isOpen={isOpen} onClose={hideModal}>
          {content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (ctx === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return ctx;
}
