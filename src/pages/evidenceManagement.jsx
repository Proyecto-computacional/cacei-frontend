import React, { useEffect, useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import AssignTask from "../components/AssignTask";
import { Pencil, Trash } from "lucide-react";
import '../app.css';
import axios from "axios";

const EvidenceManagement = () => {
  const [tasks, setTasks] = useState([
    { id: 1, task: "Revisar informes", responsible: "Marco Hernández", evaluated: "Juan Bravo", status: "Rechazada", date: "17/02/25" },
    { id: 2, task: "Subir documentos", responsible: "Cesar Torres", evaluated: "Luis Martínez", status: "En revisión", date: "25/06/25" },
    { id: 3, task: "Subir actas", responsible: "Luis Martínez", evaluated: "Cesar Torres", status: "En revisión", date: "02/07/25" },
    { id: 4, task: "Subir actas", responsible: "Juan Bravo", evaluated: "Marco Hernández", status: "Aprobada", date: "31/12/25" }
  ]);

  const [showAssignTask, setShowAssignTask] = useState(false);

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18 bg-gradient-to-b from-gray-200 to-white">
        <h1 className="text-3xl font-semibold text-black mt-6 mb-5">
          Gestión de Evidencias y Tareas
        </h1>
        <div className="flex gap-4 mb-4 items-center">
          <select className="w-40 p-2 border rounded">
            <option>Categoría</option>
            <option value="categoria1">Categoría 1</option>
            <option value="categoria2">Categoría 2</option>
          </select>
          <select className="w-40 p-2 border rounded">
            <option>Sección</option>
            <option value="seccion1">Sección 1</option>
            <option value="seccion2">Sección 2</option>
          </select>
          <select className="w-40 p-2 border rounded">
            <option>Criterio</option>
            <option value="criterio1">Criterio 1</option>
            <option value="criterio2">Criterio 2</option>
          </select>
          <div className="ml-auto flex gap-2">
            <select className="w-40 border flex items-center px-4 py-2 bg-blue-700 text-white rounded">
                <option>Estado</option>
                <option value="criterio1">Rechazada</option>
                <option value="criterio2">En revisión</option>
                <option value="criterio2">Aprobada</option>
            </select>
            <input
              type="text"
              placeholder="Usuario"
              className="px-4 py-2 border rounded w-40"
            />
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border">Subpunto/Tarea</th>
              <th className="p-2 border">Responsable</th>
              <th className="p-2 border">Evaluado</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
              <th className="p-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border border-gray-300">
                <td className="p-2 border">{task.task}</td>
                <td className="p-2 border">{task.responsible}</td>
                <td className="p-2 border">{task.evaluated}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-white ${task.status === "Rechazada" ? "bg-red-500" : task.status === "En revisión" ? "bg-yellow-500" : "bg-green-500"}`}>{task.status}</span>
                </td>
                <td className="p-2 border h-10 flex gap-2 justify-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash size={18} />
                  </button>
                </td>
                <td className="p-2 border">{task.date}</td>
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