import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";
import { useSessionWatcher } from "./sessionWatcher";
import ModalAlert from "../components/ModalAlert";
import { logout } from "./api";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [modalAlertMessage, setModalAlertMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  
  const extendSession = async () => {
      try {
        await api.post("/api/auth/renew");
        setShowWarning(false);
      } catch(e) {
        handleExpire();
      }
  }

  const closeSession = async () => {
      await logout();
      setShowWarning(false);
      navigate('/');
  }


  const handleWarning = () => {
    setShowWarning(true);
  };

    const handleExpire = () => {
      //setShowWarning(false);
      setModalAlertMessage("La sesión caduco. Se tiene que volver a iniciar sesión.")
  };


  // Consultar /auth/status periódicamente
  const remaining = useSessionWatcher(handleExpire, handleWarning, location);

  return (
    <AuthContext.Provider value={{ remaining }}>
      {children}
      {showWarning && (
        <>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000]">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 transform transition-all duration-200">
                      {/* Header con color UASLP */}
                      <div className="bg-[#004A98] px-4 py-3 rounded-t-lg">
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-white font-medium text-base">Alerta</h3>
                        </div>
                      </div>
                      
                      {/* Contenido */}
                      <div className="px-6 py-6">
                        <p className="text-gray-700 text-base leading-relaxed mb-6">Tú sesión está por expirar. ¿Deseas renovarla?</p>
                        
                        {/* Botón alineado a la derecha */}
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={closeSession}
                            className="px-6 py-2 bg-white text-[#004A98] border-solid border-2 border-primary1 rounded-lg hover:bg-gray-500 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:ring-opacity-50"
                            autoFocus
                          >
                            Cerrar sesión 
                          </button>
                          <button
                            onClick={extendSession}
                            className="px-6 py-2 bg-[#004A98] text-white rounded-lg hover:bg-[#003d7a] transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#004A98] focus:ring-opacity-50"
                            autoFocus
                          >
                            Extender sesión 
                          </button>
                        </div>
                      </div>
                    </div>
             </div>
         <ModalAlert
                isOpen={modalAlertMessage !== null}
                message={modalAlertMessage}
                onClose={() => {
                  closeSession();
                  setModalAlertMessage(null)
                }}
            />
        </>
        
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
