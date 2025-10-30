import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import { Plus, Edit2, Check, X, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ModalAlert from "../components/ModalAlert";

function CrearMarcoForm({ onCancel, onSaved }) {
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [modalAlertMessage, setModalAlertMessage] = useState(null);

  const handleSave = async () => {
    if (!nombre.trim()) {
      setModalAlertMessage("Por favor ingrese un nombre para el marco");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/frames-of-reference", { frame_name: nombre });
      const frame = res.data.data;
      await onSaved();
      navigate(`/framesStructure/${frame.frame_id}`, { state: { marco: frame } });
    } catch (err) {
      setModalAlertMessage("Error al guardar: " + err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (

    <div className="border p-6 mb-6 rounded-lg shadow-lg bg-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Crear Marco</h2>
      <input
        type="text"
        maxLength={60}
        className="border border-gray-300 p-3 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        placeholder="Nombre del marco"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Check className="w-5 h-5" />
          )}
          Guardar
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>
      <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
    </div>
  );
}

function ModificarMarcoForm({ frame, onCancel, onSaved }) {
  const [nombre, setNombre] = useState(frame.frame_name);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [modalAlertMessage, setModalAlertMessage] = useState(null);

  const handleSave = async () => {
    if (!nombre.trim()) {
      setModalAlertMessage("Por favor ingrese un nombre para el marco");
      return;
    }

    setIsLoading(true);
    try {
      await api.put("/api/frames-of-reference-update", {
        frame_id: frame.frame_id,
        frame_name: nombre
      });
      await onSaved();
      navigate(`/framesStructure/${frame.frame_id}`, { state: { marco: frame } });
    } catch (err) {
      setModalAlertMessage("Error al actualizar: " + err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border p-6 mb-6 rounded-lg shadow-lg bg-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Modificar Marco</h2>
      <input
        type="text"
        maxLength={60}
        className="border border-gray-300 p-3 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Check className="w-5 h-5" />
          )}
          Guardar
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>
      <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
    </div>
  );
}

export default function FrameOfReferenceView() {
  const [frames, setFrames] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalAlertMessage, setModalAlertMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFrames();
  }, [refreshTrigger]);

  const fetchFrames = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/frames-of-references");
      setFrames(res.data);
      setSelectedFrame(null);
    } catch (error) {
      console.error("Error fetching frames:", error);
      setModalAlertMessage("Error al cargar los marcos de referencia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setShowCreateForm(true);
    setShowEditForm(false);
  };

  const handleOpenEdit = () => {
    if (!selectedFrame) return;
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
  };

  const handleSaved = async () => {
    handleCancel();
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRowClick = (frame) => {
    navigate(`/framesStructure/${frame.frame_id}`, { state: { marco: frame } });
  };




  // HTML ------------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <SubHeading />
      <div className="container mx-auto px-4 py-8 w-7/8">
        {isLoading}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 pt-4 pb-2 pl-8 pr-8 w-full">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex justify-between w-full">
                <h1 className="text-4xl font-bold text-gray-800 font-['Open_Sans'] tracking-tight mb-3">
                  Marcos de Referencia
                </h1>
                <button
                  className="ml-2 inline-flex items-center text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                  onClick={() => { setShowCreateForm(true) }}>
                  + Crear Marco de referencia
                </button>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Gestione de forma centralizada todos los marcos de referencia disponibles. Acceda a cada uno para administrar sus categorías, indicadores y criterios.
              </p>
            </div>
          </div>

        </div>

        {showCreateForm && (
          <CrearMarcoForm onCancel={handleCancel} onSaved={handleSaved} />
        )}

        {showEditForm && selectedFrame && (
          <ModificarMarcoForm frame={selectedFrame} onCancel={handleCancel} onSaved={handleSaved} />
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Versión</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nombre del marco de referencia</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="py-8">
                    <div className="flex justify-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : frames.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No hay marcos de referencia disponibles
                  </td>
                </tr>
              ) : (
                frames.map((frame) => (
                  <tr
                    key={frame.frame_id}
                    className={`border-b hover:bg-gray-50 transition-colors ${selectedFrame?.frame_id === frame.frame_id ? "bg-blue-50" : ""
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">{frame.frame_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {selectedFrame?.frame_id === frame.frame_id ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            maxLength={60}
                            autoFocus
                            className="border-2 border-blue-400 rounded-lg px-3 py-1.5 w-full focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-800 transition-all duration-150"
                            value={selectedFrame.frame_name}
                            onChange={(e) =>
                              setSelectedFrame({ ...selectedFrame, frame_name: e.target.value })
                            }
                          />
                          <button
                            onClick={async () => {
                              try {
                                await api.put("/api/frames-of-reference-update", {
                                  frame_id: selectedFrame.frame_id,
                                  frame_name: selectedFrame.frame_name,
                                });
                                setSelectedFrame(null);
                                setRefreshTrigger((prev) => prev + 1);
                                setModalAlertMessage("✅ Nombre actualizado con éxito");
                              } catch (err) {
                                console.error(err);
                                setModalAlertMessage("Error al actualizar el nombre del marco");
                              }
                            }}
                            className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 transition"
                            title="Guardar cambios"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedFrame(null)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition"
                            title="Cancelar"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="truncate">{frame.frame_name}</span>
                          <button
                            onClick={() => setSelectedFrame(frame)}
                            className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-yellow-50 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleRowClick(frame)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        Ver indicadores
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AppFooter />
      <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
    </div>
  );
}