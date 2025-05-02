// components/TestComponent.jsx
import Modal from './Modal';
import { useTestModal } from '../contexts/TestModalContext';

export default function TestComponent() {
  const { modalContent, hideModal } = useTestModal();

  // Only render if someone’s called showModal()
  return modalContent ? (
    <Modal onClose={hideModal}>
      {modalContent}
    </Modal>
  ) : null;
}
