//import React from "react";
import { Search } from "lucide-react";
import api from "../services/api";
import React, { useEffect, useState } from "react";

const AssignTask = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [standards, setStandards] = useState([]);
  const [evidences, setEvidences] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState("");
  const [userRpe, setUserRpe] = useState("");

  useEffect(() => {
    api.get("/api/categories") // Ajusta ruta si es diferente
      .then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      api.post("/api/sections", { category_id: selectedCategory })
        .then(res => setSections(res.data));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSection) {
      api.post("/api/standards", { section_id: selectedSection })
        .then(res => setStandards(res.data));
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedStandard) {
      api.post("/api/evidences", { standard_id: selectedStandard })
        .then(res => setEvidences(res.data));
    }
  }, [selectedStandard]);

  const handleSave = () => {
    api.post("/api/reviser", {
      user_rpe: userRpe,
      evidence_id: selectedEvidence,
    })
    .then(res => {
      alert(res.data.message);
      onClose();
    })
    .catch(err => {
      alert("Error al asignar: " + err.response.data.message);
    });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Asignar tarea</h2>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Categoría:</label>
          <select className="w-full p-2 border rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Sección:</label>
          <select className="w-full p-2 border rounded" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
            <option value="">Selecciona una sección</option>
            {sections.map(sec => (
              <option key={sec.section_id} value={sec.section_id}>{sec.section_name}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Punto (estándar):</label>
          <select className="w-full p-2 border rounded" value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)}>
            <option value="">Selecciona un punto</option>
            {standards.map(std => (
              <option key={std.standard_id} value={std.standard_id}>{std.standard_name}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Criterio:</label>
          <select className="w-full p-2 border rounded" value={selectedEvidence} onChange={(e) => setSelectedEvidence(e.target.value)}>
            <option value="">Selecciona una evidencia</option>
            {evidences.map(evi => (
              <option key={evi.evidence_id} value={evi.evidence_id}>Evidencia #{evi.evidence_id}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block mb-1 font-medium">Usuario (RPE):</label>
          <input
            type="text"
            placeholder="Usuario"
            className="w-full p-2 border rounded"
            value={userRpe}
            onChange={(e) => setUserRpe(e.target.value)}
          />
        </div>
  
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>Guardar</button>
          <button className="px-4 py-2 border border-gray-300 rounded" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default AssignTask;
