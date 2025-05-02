// components/Modal.jsx
import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }) {
  // Find the modal-root container
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  // The modal’s content; clicking outside or on “X” should call onClose
  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          minWidth: '300px',
          maxWidth: '90%',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ float: 'right' }}>✕</button>
        {children}
      </div>
    </div>
  );

  // Render into #modal-root
  return createPortal(modalContent, modalRoot);
}
