import React, { useEffect, useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import AssignTask from "../components/AssignTask";
import { Pencil, Trash, Filter, X, Plus } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-b from-gray-200 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">
              Asignación de Tareas
            </h1>
            <button
              onClick={() => setShowAssignTask(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004A98] transition-colors"
              style={{ backgroundColor: '#004A98' }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Asignar tarea
            </button>
          </div>
          
          {/* Filtros de búsqueda */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" style={{ color: '#004A98' }} />
                  <h3 className="text-lg font-medium text-black">Filtros de búsqueda</h3>
                </div>
                <button 
                  onClick={resetFilters}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004A98] transition-colors"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Limpiar filtros
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004A98] focus:ring-[#004A98] sm:text-sm"
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
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004A98] focus:ring-[#004A98] sm:text-sm"
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
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004A98] focus:ring-[#004A98] sm:text-sm"
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
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#004A98] focus:ring-[#004A98] sm:text-sm"
                  >
                    <option value="">Todos los responsables</option>
                    {users.map((user, index) => (
                      <option key={index} value={user}>{user}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabla de resultados */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr style={{ backgroundColor: '#004A98' }} className="text-white">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Sección
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Criterio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Responsable
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Fecha Límite
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRevisers.length > 0 ? (
                    filteredRevisers.map((reviser, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reviser.category_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reviser.section_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reviser.standard_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reviser.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {reviser.due_date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                        No se encontraron resultados con los filtros aplicados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
      {showAssignTask && <AssignTask onClose={() => setShowAssignTask(false)} />}
    </>
  );
};

export default EvidenceManagement;