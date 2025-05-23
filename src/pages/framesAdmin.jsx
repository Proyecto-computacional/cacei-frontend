import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import { Plus, Edit2, Check, X, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

function CrearMarcoForm({ onCancel, onSaved }) {
    const [nombre, setNombre] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para el marco");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.post("/api/frames-of-reference", { frame_name: nombre });
        const frame = res.data.data;
        await onSaved();
        navigate(`/framesStructure/${frame.frame_id}`, {state: {marco: frame}});
      } catch (err) {
        alert("Error al guardar: " + err.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="border p-6 mb-6 rounded-lg shadow-lg bg-white max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Crear Marco</h2>
        <input
          type="text"
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
      </div>
    );
}
  
function ModificarMarcoForm({ frame, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(frame.frame_name);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para el marco");
        return;
      }

      setIsLoading(true);
      try {
        await api.put("/api/frames-of-reference-update", {
          frame_id: frame.frame_id,
          frame_name: nombre
        });
        await onSaved();
        navigate(`/framesStructure/${frame.frame_id}`, {state: {marco: frame}});
      } catch (err) {
        alert("Error al actualizar: " + err.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="border p-6 mb-6 rounded-lg shadow-lg bg-white max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Modificar Marco</h2>
        <input
          type="text"
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
        alert("Error al cargar los marcos de referencia");
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
      navigate(`/framesStructure/${frame.frame_id}`, {state: {marco: frame}});
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <SubHeading />
        <div className="container mx-auto px-4 py-8">
          {isLoading && <LoadingSpinner />}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Marcos de Referencia</h1>
            <div className="flex gap-3">
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleOpenCreate}
              >
                <Plus className="w-5 h-5" />
                Crear Marco
              </button>
              <button
                className={`px-6 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  selectedFrame 
                    ? "bg-cyan-500 text-white hover:bg-cyan-600" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleOpenEdit}
                disabled={!selectedFrame}
              >
                <Edit2 className="w-5 h-5" />
                Modificar Marco
              </button>
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
                {frames.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No hay marcos de referencia disponibles
                    </td>
                  </tr>
                ) : (
                  frames.map((frame) => (
                    <tr
                      key={frame.frame_id}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        selectedFrame?.frame_id === frame.frame_id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{frame.frame_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{frame.frame_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleRowClick(frame)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        >
                          Ver secciones
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
      </div>
    );
}