// src/components/TokenAlert.tsx
import React from "react";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface TokenAlertProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function TokenAlert({ isOpen, onClose, children }: TokenAlertProps) {
  // prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
