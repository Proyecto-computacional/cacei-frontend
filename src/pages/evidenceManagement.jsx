import React, { useEffect, useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import AssignTask from "../components/AssignTask";
import { Pencil, Trash } from "lucide-react";
import '../app.css';
import api from "../services/api";
import axios from "axios";

const EvidenceManagement = () => {
  const [revisers, setRevisers] = useState([]);

  useEffect(() => {
    const fetchRevisers = async () => {
      try {
        const response = await api.get("/api/revisers");
        setRevisers(response.data);
      } catch (error) {
        console.error("Error al obtener los revisores:", error);
      }
    };

    fetchRevisers();
  }, []);

  const [showAssignTask, setShowAssignTask] = useState(false);

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18 bg-gradient-to-b from-gray-200 to-white">
        <h1 className="text-3xl font-semibold text-black mt-6 mb-5">
          Gestión de Evidencias y Tareas
        </h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border">Categoría</th>
              <th className="p-2 border">Sección</th>
              <th className="p-2 border">Estándar</th>
              <th className="p-2 border">Evidencia</th>
              <th className="p-2 border">RPE Responsable</th>
              <th className="p-2 border">Fecha Límite</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {revisers.map((reviser, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="p-2 border">{reviser.category_name}</td>
                <td className="p-2 border">{reviser.section_name}</td>
                <td className="p-2 border">{reviser.standard_name}</td>
                <td className="p-2 border">{reviser.evidence_id}</td>
                <td className="p-2 border">{reviser.user_rpe}</td>
                <td className="p-2 border">{reviser.due_date}</td>
                <td className="p-2 border h-10 flex gap-2 justify-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
            onClick={() => setShowAssignTask(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
            + Asignar tarea
        </button>
      </div>
      <AppFooter />
      {showAssignTask && <AssignTask onClose={() => setShowAssignTask(false)} />}
    </>
  );
};

export default EvidenceManagement;