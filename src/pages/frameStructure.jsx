import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import LoadingSpinner from "../components/LoadingSpinner";

function CrearCategoriaForm({ onCancel, onSaved, frame_id }) {
    const [nombre, setNombre] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para la categoría");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.post("/api/category", { category_name: nombre, frame_id: frame_id });
        alert("Categoría creada exitosamente");
        onSaved();
      } catch (err) {
        alert("Error al crear la categoría: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Categoría</h2>
            <div className="space-y-4">
              <div>
        <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la categoría
        </label>
        <input
          type="text"
                  id="nombreCategoria"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
            Cancelar
          </button>
            <button 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ModificarCategoriaForm({ category, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(category.category_name);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para la categoría");
        return;
      }

      setIsLoading(true);
      try {
        await api.put("/api/category-update", {
          category_id: category.category_id,
          category_name: nombre
        });
        alert("Categoría actualizada exitosamente");
        onSaved();
      } catch (err) {
        alert("Error al actualizar la categoría: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modificar Categoría</h2>
            <div className="space-y-4">
              <div>
        <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la categoría
        </label>
        <input
          type="text"
                  id="nombreCategoria"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
            Cancelar
          </button>
            <button 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CrearSeccionForm({ onCancel, onSaved, categories }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
      if (!selectedCategoryId) {
        alert("Por favor seleccione una categoría");
        return;
      }
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para la sección");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.post("/api/section", { 
          section_name: nombre, 
          category_id: selectedCategoryId, 
          section_description: descripcion 
        });
        alert("Sección creada exitosamente");
        onSaved();
      } catch (err) {
        alert("Error al crear la sección: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Sección</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  id="categoria"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.indice}. {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
        <label htmlFor="nombreSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la sección
        </label>
        <input
          type="text"
                  id="nombreSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el nombre de la sección"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
              </div>

              <div>
        <label htmlFor="descripcionSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la sección
        </label>
                <textarea
                  id="descripcionSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese la descripción de la sección"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
            Cancelar
          </button>
            <button 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ModificarSeccionForm({ seccion, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(seccion.section_name);
    const [descripcion, setDescripcion] = useState(seccion.section_description);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para la sección");
        return;
      }

      setIsLoading(true);
      try {
        await api.put("/api/section-update", {
          section_id: seccion.section_id,
          section_name: nombre,
          section_description: descripcion
        });
        alert("Sección actualizada exitosamente");
        onSaved();
      } catch (err) {
        alert("Error al actualizar la sección: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modificar Sección</h2>
            <div className="space-y-4">
              <div>
        <label htmlFor="nombreSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la sección
        </label>
        <input
          type="text"
                  id="nombreSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
              </div>

              <div>
        <label htmlFor="descripcionSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción de la sección
        </label>
                <textarea
                  id="descripcionSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
            Cancelar
          </button>
            <button 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CrearCriterioForm({ onCancel, onSaved, sections, categories }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [is_transversal, setTrasnversal] = useState(false);
    const [help, setHelp] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Filter sections based on selected category
    const filteredSections = sections.filter(sec => {
      return String(sec.category_id) === selectedCategoryId;
    });

    const handleSave = async () => {
      if (!selectedCategoryId) {
        alert("Por favor seleccione una categoría");
        return;
      }
      if (!selectedSectionId) {
        alert("Por favor seleccione una sección");
        return;
      }
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para el criterio");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.post("/api/standard", { 
          standard_name: nombre, 
          section_id: selectedSectionId, 
          standard_description: descripcion, 
          is_transversal: is_transversal, 
          help: help 
        });
        alert("Criterio creado exitosamente");
        onSaved();
      } catch (err) {
        alert("Error al crear el criterio: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };

    // Reset section selection when category changes
    const handleCategoryChange = (e) => {
      setSelectedCategoryId(e.target.value);
      setSelectedSectionId("");
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[99999] overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8 relative z-[99999]">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Criterio</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  id="categoria"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.indice}. {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Sección
                </label>
                <select
                  id="seccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  disabled={!selectedCategoryId}
                >
                  <option value="">Seleccione una sección</option>
                  {filteredSections.map((sec) => (
                    <option key={sec.section_id} value={sec.section_id}>
                      {sec.indice}. {sec.section_name}
                    </option>
                  ))}
                </select>
                {!selectedCategoryId && (
                  <p className="mt-1 text-sm text-gray-500">
                    Primero seleccione una categoría
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="nombreCriterio" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del criterio
                </label>
                <input
                  type="text"
                  id="nombreCriterio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el nombre del criterio"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="descripcionCriterio" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del criterio
                </label>
                <textarea
                  id="descripcionCriterio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese la descripción del criterio"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transversal"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={is_transversal}
                  onChange={(e) => setTrasnversal(e.target.checked)}
                />
                <label htmlFor="transversal" className="ml-2 text-sm font-medium text-gray-700">
                  Criterio transversal
                </label>
              </div>

              <div>
                <label htmlFor="ayudaCriterio" className="block text-sm font-medium text-gray-700 mb-1">
                  Ayuda del criterio
                </label>
                <textarea
                  id="ayudaCriterio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese la ayuda del criterio"
                  value={help}
                  onChange={(e) => setHelp(e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  function ModificarCriterioForm({ criterio, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(criterio.standard_name);
    const [descripcion, setDescripcion] = useState(criterio.standard_description);
    const [is_transversal, setTrasnversal] = useState(criterio.is_transversal);
    const [help, setHelp] = useState(criterio.help);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        alert("Por favor ingrese un nombre para el criterio");
        return;
      }

      setIsLoading(true);
      try {
        await api.put("/api/standard-update", {
          standard_id: criterio.standard_id,
          standard_name: nombre,
          standard_description: descripcion,
          is_transversal: is_transversal,
          help: help
        });
        alert("Criterio actualizado exitosamente");
        onSaved();
      } catch (err) {
        alert("Error al actualizar el criterio: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modificar Criterio</h2>
            <div className="space-y-4">
              <div>
        <label htmlFor="nombreCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del criterio
        </label>
        <input
          type="text"
                  id="nombreCriterio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
              </div>

              <div>
        <label htmlFor="descripcionCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del criterio
        </label>
                <textarea
                  id="descripcionCriterio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="transversal"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={is_transversal}
                  onChange={(e) => setTrasnversal(e.target.checked)}
                />
                <label htmlFor="transversal" className="ml-2 text-sm font-medium text-gray-700">
                  Criterio transversal
        </label>
              </div>

              <div>
                <label htmlFor="ayudaCriterio" className="block text-sm font-medium text-gray-700 mb-1">
          Ayuda del criterio
        </label>
                <textarea
                  id="ayudaCriterio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={help}
            onChange={(e) => setHelp(e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
            Cancelar
          </button>
            <button 
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

export default function EstructuraMarco() {
    const { id } = useParams();
    const location = useLocation();
    const marco = location.state?.marco;
  
    const [categorias, setCategorias] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [criterios, setCriterios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCreateCategoria, setShowCreateCategoria] = useState(false);
    const [showCreateSeccion, setShowCreateSeccion] = useState(false);
    const [showCreateCriterio, setShowCreateCriterio] = useState(false);

    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingCriterioId, setEditingCriterioId] = useState(null);
  
    useEffect(() => {
      fetchCategorias();
    }, [id]);
  
    const fetchCategorias = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const res = await api.post(`/api/categories`, { frame_id: marco.frame_id });
        const categoriesData = res.data;
        setCategorias(categoriesData);
        
        // Fetch sections for all categories
        const sectionsPromises = categoriesData.map(cat => 
          api.post(`/api/sections`, { category_id: cat.category_id })
        );
        const sectionsResults = await Promise.all(sectionsPromises);
        const allSections = sectionsResults.flatMap(res => res.data);
        setSecciones(allSections);

        // Fetch criteria for all sections
        const criteriaPromises = allSections.map(sec => 
          api.post(`/api/standards`, { section_id: sec.section_id })
        );
        const criteriaResults = await Promise.all(criteriaPromises);
        const allCriteria = criteriaResults.flatMap(res => res.data);
        setCriterios(allCriteria);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Error al cargar los datos: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };

    const handleOpenCreateCategoria = () => {
        setShowCreateCategoria(true);
        setShowCreateSeccion(false);
        setShowCreateCriterio(false);
    };

    const handleOpenCreateSeccion = () => {
        setShowCreateCategoria(false);
        setShowCreateSeccion(true);
        setShowCreateCriterio(false);
    };

    const handleOpenCreateCriterio = () => {
        setShowCreateCategoria(false);
        setShowCreateSeccion(false);
        setShowCreateCriterio(true);
    };

    const handleCancel = () => {
      setEditingCategoryId(null);
      setEditingSectionId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };

    const handleOpenEditCategoria = (categoryId) => {
      setEditingCategoryId(categoryId);
      setEditingSectionId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };

    const handleOpenEditSeccion = (seccionId) => {
      setEditingSectionId(seccionId);
      setEditingCategoryId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };

    const handleOpenEditCriterio = (criterioId) => {
      setEditingCriterioId(criterioId);
      setEditingCategoryId(null);
      setEditingSectionId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
    };
  
    return (
        <>
      <AppHeader />
      <SubHeading />
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Estructura del {marco.frame_name}</h1>
          <div className="flex gap-3">
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              onClick={handleOpenCreateCategoria}
            >
              Crear Categoría
            </button>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              onClick={handleOpenCreateSeccion}
            >
              Crear Sección
            </button>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              onClick={handleOpenCreateCriterio}
            >
              Crear Criterio
            </button>
          </div>
        </div>

          {showCreateCategoria && (
          <CrearCategoriaForm 
            onCancel={handleCancel} 
            onSaved={() => { handleCancel(); fetchCategorias(); }} 
            frame_id={marco.frame_id} 
          />
        )}

        {showCreateSeccion && (
          <CrearSeccionForm 
            onCancel={handleCancel} 
            onSaved={() => { handleCancel(); fetchCategorias(); }} 
            categories={categorias}
          />
        )}

        {showCreateCriterio && (
          <CrearCriterioForm 
            onCancel={handleCancel} 
            onSaved={() => { handleCancel(); fetchCategorias(); }} 
            sections={secciones}
            categories={categorias}
          />
        )}
  
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/4">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/4">Sección</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/3">Criterio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/6"></th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No hay categorías disponibles
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => {
                    const categorySections = secciones.filter(sec => sec.category_id === cat.category_id);
                    const totalRows = categorySections.reduce((acc, sec) => {
                      const sectionCriteria = criterios.filter(cri => cri.section_id === sec.section_id);
                      return acc + (sectionCriteria.length || 1);
                    }, 0);
                    
                    if (categorySections.length === 0) {
                      return (
                        <tr key={cat.category_id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600 border-r">
                            <div className="flex items-center">
                              <span className="font-medium">{cat.indice}. {cat.category_name}</span>
                              <button 
                                className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                onClick={() => handleOpenEditCategoria(cat.category_id)}
                              >
                                Modificar
                              </button>
                            </div>
                          </td>
                          <td colSpan="3" className="px-6 py-4 text-sm text-gray-500 italic">
                            No hay secciones en esta categoría
                          </td>
                        </tr>
                      );
                    }

                    return categorySections.map((sec, secIndex) => {
                      const sectionCriteria = criterios.filter(cri => cri.section_id === sec.section_id);
                      
                      if (sectionCriteria.length === 0) {
                        return (
                          <tr key={sec.section_id} className="border-b hover:bg-gray-50">
                            {secIndex === 0 && (
                              <td 
                                rowSpan={totalRows}
                                className="px-6 py-4 text-sm text-gray-600 align-top border-r"
                              >
                                <div className="flex items-center">
                                  <span className="font-medium">{cat.indice}. {cat.category_name}</span>
                                  <button 
                                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={() => handleOpenEditCategoria(cat.category_id)}
                                  >
                                    Modificar
                                  </button>
                                </div>
                              </td>
                            )}
                            <td className="px-6 py-4 text-sm text-gray-600 border-r">
                              <div className="flex items-center">
                                <span className="font-medium">{cat.indice}.{sec.indice}. {sec.section_name}</span>
                                <button 
                                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  onClick={() => handleOpenEditSeccion(sec.section_id)}
                                >
                                  Modificar
                                </button>
                              </div>
                            </td>
                            <td colSpan="2" className="px-6 py-4 text-sm text-gray-500 italic">
                              No hay criterios en esta sección
                            </td>
                          </tr>
                        );
                      }

                      return sectionCriteria.map((cri, criIndex) => (
                        <tr key={cri.standard_id} className="border-b hover:bg-gray-50">
                          {secIndex === 0 && criIndex === 0 && (
                            <td 
                              rowSpan={totalRows}
                              className="px-6 py-4 text-sm text-gray-600 align-top border-r"
                            >
                              <div className="flex items-center">
                                <span className="font-medium">{cat.indice}. {cat.category_name}</span>
                                <button 
                                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  onClick={() => handleOpenEditCategoria(cat.category_id)}
                                >
                                  Modificar
                                </button>
                              </div>
                            </td>
                          )}
                          {criIndex === 0 && (
                            <td 
                              rowSpan={sectionCriteria.length}
                              className="px-6 py-4 text-sm text-gray-600 align-top border-r"
                            >
                              <div className="flex items-center">
                                <span className="font-medium">{cat.indice}.{sec.indice}. {sec.section_name}</span>
                                <button 
                                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  onClick={() => handleOpenEditSeccion(sec.section_id)}
                                >
                                  Modificar
                                </button>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-600 border-r">
                            <div className="flex items-center justify-between">
                              <span>{cat.indice}.{sec.indice}.{cri.indice}. {cri.standard_name}</span>
                              <button 
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                onClick={() => handleOpenEditCriterio(cri.standard_id)}
                              >
                                Modificar
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {cri.is_transversal && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Transversal
                              </span>
                            )}
                          </td>
                        </tr>
                      ));
                    });
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {editingCategoryId && (
                <ModificarCategoriaForm 
            category={categorias.find(c => c.category_id === editingCategoryId)}
                  onCancel={handleCancel}
                  onSaved={() => {
                    handleCancel();
                    fetchCategorias();
                  }}
                />
              )}

        {editingSectionId && (
                  <ModificarSeccionForm 
            seccion={secciones.find(s => s.section_id === editingSectionId)}
                    onCancel={handleCancel}
                    onSaved={() => {
                      handleCancel();
              fetchCategorias();
            }}
          />
        )}

        {editingCriterioId && (
                  <ModificarCriterioForm 
            criterio={criterios.find(c => c.standard_id === editingCriterioId)}
                    onCancel={handleCancel}
                    onSaved={() => {
                      handleCancel();
              fetchCategorias();
                    }}
                  />
        )}
      </div>
      <AppFooter />
    </>
    );
  }