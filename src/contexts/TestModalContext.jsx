import { createContext, useState, useContext } from 'react';

const TestModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);

  const showModal = (content) => setModalContent(content);
  const hideModal = () => setModalContent(null);

  return (
    <TestModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {/* render the modal when modalContent is non-null */}
      {modalContent}
    </TestModalContext.Provider>
  );
}

export const useTestModal = () => useContext(TestModalContext);
