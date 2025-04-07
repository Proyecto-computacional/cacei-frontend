import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";


function CrearMarcoForm({ onCancel, onSaved }) {
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();
  
    const handleSave = async () => {
      try {
        const res = await api.post("/api/frames-of-reference", { frame_name: nombre });
        const frame = res.data.data;
        onSaved();
        navigate('/framesStructure/$frame.frame_id}', {state: {marco: frame}});
      } catch (err) {
        alert("Error al guardar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Crear Marco</h2>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Nombre del marco"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }
  
  function ModificarMarcoForm({ frame, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(frame.frame_name);
    const navigate = useNavigate();
  
    const handleSave = async () => {
      try {
        await api.put("/api/frames-of-reference-update", {
          frame_id: frame.frame_id,
          frame_name: nombre
        });
        onSaved();
        navigate('/framesStructure/${frame.frame_id}', {state: {marco: frame}});
      } catch (err) {
        alert("Error al actualizar: " + err.response?.data?.message);
      }
    };
  
    return (
      <div className="border p-4 mb-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Modificar Marco</h2>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Guardar
          </button>
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onCancel}>
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
  
    useEffect(() => {
      fetchFrames();
    }, []);
  
    const fetchFrames = async () => {
      const res = await api.get("/api/frames-of-references");
      setFrames(res.data);
      setSelectedFrame(null);
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
  
    return (
        <>
      <AppHeader />
      <SubHeading />
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">Marcos de Referencia</h1>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleOpenCreate}>
              Crear Marco
            </button>
            <button
              className={`px-4 py-2 rounded ${
                selectedFrame ? "bg-cyan-500 text-white" : "bg-gray-300 text-black"
              }`}
              onClick={handleOpenEdit}
              disabled={!selectedFrame}
            >
              Modificar Marco
            </button>
          </div>
        </div>
  
        {showCreateForm && (
          <CrearMarcoForm onCancel={handleCancel} onSaved={() => { handleCancel(); fetchFrames(); }} />
        )}
  
        {showEditForm && selectedFrame && (
          <ModificarMarcoForm frame={selectedFrame} onCancel={handleCancel} onSaved={() => { handleCancel(); fetchFrames(); }} />
        )}
  
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border px-4 py-2">Versión</th>
              <th className="border px-4 py-2">Nombre del marco de referencia</th>
            </tr>
          </thead>
          <tbody>
            {frames.map((frame) => (
              <tr
                key={frame.frame_id}
                className={`cursor-pointer ${
                  selectedFrame?.frame_id === frame.frame_id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedFrame(frame)}
              >
                <td className="border px-4 py-2">{frame.frame_id}</td>
                <td className="border px-4 py-2">{frame.frame_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AppFooter />
    </>
    );
  }