import React, { useEffect, useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import AssignTask from "../components/AssignTask";
import { Pencil, Trash, Filter, X } from "lucide-react";
import '../app.css';
import api from "../services/api";

const EvidenceManagement = () => {
  const [revisers, setRevisers] = useState([]);
  const [filteredRevisers, setFilteredRevisers] = useState([]);
  const [showAssignTask, setShowAssignTask] = useState(false);
  
  // Estados para los filtros
  const [filters, setFilters] = useState({
    category: '',
    section: '',
    standard: '',
    user: ''
  });
  
  // Obtener opciones únicas para los filtros
  const categories = [...new Set(revisers.map(item => item.category_name))];
  const sections = [...new Set(revisers.map(item => item.section_name))];
  const standards = [...new Set(revisers.map(item => item.standard_name))];
  const users = [...new Set(revisers.map(item => item.user_name))];

  useEffect(() => {
    const fetchRevisers = async () => {
      try {
        const response = await api.get("/api/revisers");
        setRevisers(response.data);
        setFilteredRevisers(response.data);
      } catch (error) {
        console.error("Error al obtener los revisores:", error);
      }
    };

    fetchRevisers();
  }, []);

  // Aplicar filtros cuando cambien los filtros o los datos
  useEffect(() => {
    let result = revisers;
    
    if (filters.category) {
      result = result.filter(item => item.category_name === filters.category);
    }
    
    if (filters.section) {
      result = result.filter(item => item.section_name === filters.section);
    }
    
    if (filters.standard) {
      result = result.filter(item => item.standard_name === filters.standard);
    }
    
    if (filters.user) {
      result = result.filter(item => item.user_name === filters.user);
    }
    
    setFilteredRevisers(result);
  }, [filters, revisers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      section: '',
      standard: '',
      user: ''
    });
    setFilteredRevisers(revisers);
  };

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="min-h-screen p-10 pl-18 bg-gradient-to-b from-gray-200 to-white">
        <h1 className="text-3xl font-semibold text-black mt-6 mb-5">
          Asignación de Tareas
        </h1>
        
        {/* Filtros de búsqueda */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Filter className="mr-2" size={20} />
            <h3 className="text-lg font-medium">Filtros de búsqueda</h3>
            <button 
              onClick={resetFilters}
              className="ml-auto flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <X size={16} className="mr-1" />
              Limpiar filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
              <select
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Todas las secciones</option>
                {sections.map((section, index) => (
                  <option key={index} value={section}>{section}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Criterio</label>
              <select
                name="standard"
                value={filters.standard}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Todos los criterios</option>
                {standards.map((standard, index) => (
                  <option key={index} value={standard}>{standard}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <select
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Todos los responsables</option>
                {users.map((user, index) => (
                  <option key={index} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Tabla de resultados */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2 border">Categoría</th>
                <th className="p-2 border">Sección</th>
                <th className="p-2 border">Criterio</th>
                <th className="p-2 border">Responsable</th>
                <th className="p-2 border">Fecha Límite</th>
              </tr>
            </thead>
            <tbody>
              {filteredRevisers.length > 0 ? (
                filteredRevisers.map((reviser, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="p-2 border">{reviser.category_name}</td>
                    <td className="p-2 border">{reviser.section_name}</td>
                    <td className="p-2 border">{reviser.standard_name}</td>
                    <td className="p-2 border">{reviser.user_name}</td>
                    <td className="p-2 border">{reviser.due_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No se encontraron resultados con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={() => setShowAssignTask(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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