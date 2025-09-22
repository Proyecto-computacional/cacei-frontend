import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api"
import { AppHeader, AppFooter, SubHeading } from "../common";
import LoadingSpinner from "../components/LoadingSpinner";
import ModalAlert from "../components/ModalAlert";

function CrearCategoriaForm({ onCancel, onSaved, frame_id }) {
    const [nombre, setNombre] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalAlertMessage, setModalAlertMessage] = useState(null);

    const handleSave = async () => {
      if (!nombre.trim()) {
        setModalAlertMessage("Por favor ingrese un nombre para la categoría");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.post("/api/category", { category_name: nombre, frame_id: frame_id });
        setModalAlertMessage("Categoría creada exitosamente");
        onSaved();
      } catch (err) {
        setModalAlertMessage("Error al crear la categoría: " + (err.response?.data?.message || "Error desconocido"));
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
        <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
      </div>
    );
  }

  function ModificarCategoriaForm({ category, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(category.category_name);
    const [isLoading, setIsLoading] = useState(false);
     const [modalAlertMessage, setModalAlertMessage] = useState(null);
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        setModalAlertMessage("Por favor ingrese un nombre para la categoría");
        return;
      }

      setIsLoading(true);
      try {
        await api.put("/api/category-update", {
          category_id: category.category_id,
          category_name: nombre
        });
        setModalAlertMessage("Categoría actualizada exitosamente");
        onSaved();
      } catch (err) {
        setModalAlertMessage("Error al actualizar la categoría: " + (err.response?.data?.message || "Error desconocido"));
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
        <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
      </div>
    );
  }

function CrearSeccionForm({ onCancel, onSaved, categories, defaultCategoryId }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategoryId ? String(defaultCategoryId) : "");
    const [is_standard, setStandard] = useState(false);
    const [is_transversal, setTrasnversal] = useState(false);
    const [help, setHelp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
     const [modalAlertMessage, setModalAlertMessage] = useState(null);
    const isCategoryFixed = Boolean(defaultCategoryId);

    const handleSave = async () => {
      if (!selectedCategoryId) {
        setModalAlertMessage("Por favor seleccione una categoría");
        return;
      }
      if (!nombre.trim()) {
        setModalAlertMessage("Por favor ingrese un nombre para la sección");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.post("/api/section", { 
          section_name: nombre, 
          category_id: selectedCategoryId, 
          section_description: descripcion ,
          is_standard: is_standard,
        });

        if(!res.data || !res.data.data){
          throw new Error("No se recibio respuesta válida al crear el indicador");
        }
        // Obtenemos el ID de la sección creada desde la respuesta
        const createdSection = res.data.data; // Accedemos a data.data según tu estructura de respuesta
        const sectionId = createdSection.section_id;
        // Si es un criterio, creamos también el standard asociado
        if (is_standard) {
          try{
          const res = await api.post("/api/standard", {
            section_id: sectionId,
            standard_name: nombre,
            standard_description: descripcion,
            is_transversal: is_transversal,
            help: help
          });
          if(!res.data){
            console.error("Error al crear criterio:", res);
            throw new Error("No se recibio respuesta vlaida al crear el criterio");
          }
          } catch (standardError) {
            console.error("Error al crear criterio:", standardError);
            // Si falla la creación del criterio pero la sección ya está creada,
            // podrías decidir eliminarla o mostrar un mensaje específico
            throw new Error("Indicador creado pero falló la creación del criterio");
          }
        }

        setModalAlertMessage(is_standard ? "Sección y criterio creados exitosamente" : "Sección creada exitosamente");
        onSaved();
      } catch (err) {
        setModalAlertMessage("Error al crear la sección: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crear Indicador</h2>
            <div className="space-y-4">
              <div>
                {!isCategoryFixed ? (
                  <>
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
                  </>
                ) : (
                  <div className="text-sm text-gray-600"><span className="font-medium">Categoría seleccionada:</span> {(() => {
                    const c = categories.find(c => String(c.category_id) === String(selectedCategoryId));
                    return c ? `${c.indice}. ${c.category_name}` : selectedCategoryId;
                  })()}</div>
                )}
              </div>

              <div>
        <label htmlFor="nombreSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del indicador
        </label>
        <input
          type="text"
                  id="nombreSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese el nombre del indicador"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
              </div>

              <div>
                <label htmlFor="descripcionSeccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del indicador
                </label>
                <textarea
                  id="descripcionSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ingrese la descripción del indicador"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="standard"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={is_standard}
                  onChange={(e) => setStandard(e.target.checked)}
                />
                <label htmlFor="standard" className="ml-2 text-sm font-medium text-gray-700">
                  Es criterio
                </label>
                {/* Campos adicionales que aparecen solo cuando is_standard es true */}
              {is_standard && (
                <>
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
                </>
              )}
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
        <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
      </div>
    );
  }

  function ModificarSeccionForm({ seccion, onCancel, onSaved, frame_id }) {
    const [nombre, setNombre] = useState(seccion.section_name);
    const [descripcion, setDescripcion] = useState(seccion.section_description);
    const [is_standard, setStandard] = useState(seccion.is_standard);
    const [is_transversal, setTrasnversal] = useState(seccion.standard?.is_transversal || false);
    const [help, setHelp] = useState(seccion.standard?.help || "");
    const [isLoading, setIsLoading] = useState(false);
    const [standardId, setStandardId] = useState(null);
    const [hasUnfinishedProcesses, setHasUnfinishedProcesses] = useState(false);
     const [modalAlertMessage, setModalAlertMessage] = useState(null);
    // Cargar datos del criterio si existe
    useEffect(() => {
        const fetchData = async () => {
          // Verificar procesos de acreditación no finalizados
            try {
                const processesRes = await api.post("/api/processes-by-frame", { frame_id });
                const unfinished = processesRes.data.some(process => !process.finished);
                setHasUnfinishedProcesses(unfinished);
            } catch (err) {
                console.error("Error al verificar procesos:", err);
                // Por defecto asumimos que hay procesos no finalizados para ser conservadores
                setHasUnfinishedProcesses(true);
            }
            
            // Cargar datos del estándar si existe
            if (seccion.is_standard) {
                try {
                    const res = await api.post("/api/standards", { section_id: seccion.section_id});
                    if (res.data && res.data.length > 0) {
                        const firstStandard = res.data[0];
                        setStandardId(firstStandard.standard_id);
                        setTrasnversal(firstStandard.is_transversal);
                        setHelp(firstStandard.help);
                    }
                    else{
                      // No existe estándar para esta sección
                      setStandardId(null);
                      setTrasnversal(false);
                      setHelp("");
                    }
                } catch (err) {
                    console.error("Error al cargar criterio:", {
                    error: err.message,
                    response: err.response?.data
                  });
                  setStandardId(null);
                  setTrasnversal(false);
                  setHelp("");
                }
            } else {
              // Resetear si no es estándar
              setStandardId(null);
              setTrasnversal(false);
              setHelp("");
            }
        };
        fetchData();
    }, [seccion.section_id, seccion.is_standard, frame_id]);
    console.log(standardId);
  
    const handleSave = async () => {
      if (!nombre.trim()) {
        setModalAlertMessage("Por favor ingrese un nombre para la sección");
        return;
      }

      setIsLoading(true);
      try {
        const res = await api.put("/api/section-update", {
          section_id: seccion.section_id,
          section_name: nombre,
          section_description: descripcion,
          is_standard: is_standard
        });
        // 2. Manejar el criterio según el estado del checkbox
        if (is_standard) {
          // Usamos PUT para actualizar o POST para crear si no existe standardId
                const standardData = {
                    section_id: seccion.section_id,
                    standard_id: standardId,
                    standard_name: nombre,
                    standard_description: descripcion,
                    is_transversal: is_transversal,
                    help: help
                };

                if (standardId) {
                    const res = await api.put("/api/standard-update/", standardData);
                } else {
                    const res = await api.post("/api/standard", standardData);
                    setStandardId(res.data.data.standard_id);
                }
            } else if (standardId) {
                // Ahora sí podemos eliminar el criterio
                const res = await api.delete(`/api/standard/${standardId}`);
                setStandardId(null);
            }
        setModalAlertMessage("Sección actualizada exitosamente");
        onSaved();
      } catch (err) {
        setModalAlertMessage("Error al actualizar la sección: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modificar Indicador</h2>
            <div className="space-y-4">
              <div>
        <label htmlFor="nombreSeccion" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del indicador
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
          Descripción del indicador
        </label>
                <textarea
                  id="descripcionSeccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="standard"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={is_standard}
                  onChange={(e) => !hasUnfinishedProcesses && setStandard(e.target.checked)}
                  disabled={hasUnfinishedProcesses}
                />
                <label htmlFor="standard" className="ml-2 text-sm font-medium text-gray-700">
                  Es criterio
                  {hasUnfinishedProcesses && (
                    <span className="ml-2 text-xs text-gray-500">
                        (No se puede modificar mientras haya procesos de acreditación activos)
                    </span>
                )}
                </label>
              </div>
              {is_standard && (
                <>
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
                </>
              )}
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
        <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
      </div>
    );
  }

function CrearCriterioForm({ onCancel, onSaved, sections, categories, defaultCategoryId, defaultSectionId }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [is_transversal, setTrasnversal] = useState(false);
    const [help, setHelp] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategoryId ? String(defaultCategoryId) : "");
    const [selectedSectionId, setSelectedSectionId] = useState(defaultSectionId ? String(defaultSectionId) : "");
    const [isLoading, setIsLoading] = useState(false);
     const [modalAlertMessage, setModalAlertMessage] = useState(null);
    const isCategoryFixed = Boolean(defaultCategoryId);
    const isSectionFixed = Boolean(defaultSectionId);

    // Filter sections based on selected category
    const filteredSections = sections.filter(sec => {
      return String(sec.category_id) === selectedCategoryId;
    });

    const handleSave = async () => {
      if (!selectedCategoryId) {
        setModalAlertMessage("Por favor seleccione una categoría");
        return;
      }
      if (!selectedSectionId) {
        setModalAlertMessage("Por favor seleccione una sección");
        return;
      }
      if (!nombre.trim()) {
        setModalAlertMessage("Por favor ingrese un nombre para el criterio");
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
        setModalAlertMessage("Criterio creado exitosamente");
        onSaved();
      } catch (err) {
        setModalAlertMessage("Error al crear el criterio: " + (err.response?.data?.message || "Error desconocido"));
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
                {!isCategoryFixed ? (
                  <>
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
                  </>
                ) : (
                  <div className="text-sm text-gray-600"><span className="font-medium">Categoría seleccionada:</span> {(() => {
                    const c = categories.find(c => String(c.category_id) === String(selectedCategoryId));
                    return c ? `${c.indice}. ${c.category_name}` : selectedCategoryId;
                  })()}</div>
                )}
              </div>

              <div>
                {!isSectionFixed ? (
                  <>
                    <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
                      Indicador
                    </label>
                    <select
                      id="seccion"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      disabled={!selectedCategoryId}
                    >
                      <option value="">Seleccione un indicador</option>
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
                  </>
                ) : (
                  <div className="text-sm text-gray-600"><span className="font-medium">Indicador seleccionado:</span> {(() => {
                    const s = sections.find(s => String(s.section_id) === String(selectedSectionId));
                    return s ? `${s.indice}. ${s.section_name}` : selectedSectionId;
                  })()}</div>
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
        <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
      </div>
    );
  }
  
  function ModificarCriterioForm({ criterio, onCancel, onSaved }) {
    const [nombre, setNombre] = useState(criterio.standard_name);
    const [descripcion, setDescripcion] = useState(criterio.standard_description);
    const [is_transversal, setTrasnversal] = useState(criterio.is_transversal);
    const [help, setHelp] = useState(criterio.help);
    const [isLoading, setIsLoading] = useState(false);
     const [modalAlertMessage, setModalAlertMessage] = useState(null);

  
    const handleSave = async () => {
      if (!nombre.trim()) {
        setModalAlertMessage("Por favor ingrese un nombre para el criterio");
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
        ("Criterio actualizado exitosamente");
        onSaved();
      } catch (err) {
        setModalAlertMessage("Error al actualizar el criterio: " + (err.response?.data?.message || "Error desconocido"));
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
        <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
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
    const [defaultCategoryForCreate, setDefaultCategoryForCreate] = useState(null);
    const [defaultSectionForCreate, setDefaultSectionForCreate] = useState(null);

    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingCriterioId, setEditingCriterioId] = useState(null);
     const [modalAlertMessage, setModalAlertMessage] = useState(null);
  
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
        setModalAlertMessage("Error al cargar los datos: " + (err.response?.data?.message || "Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };

    const handleOpenCreateCategoria = () => {
        setShowCreateCategoria(true);
        setShowCreateSeccion(false);
        setShowCreateCriterio(false);
    };

    const handleOpenCreateSeccion = (categoryId = null) => {
        setShowCreateCategoria(false);
        setShowCreateSeccion(true);
        setShowCreateCriterio(false);
        setDefaultCategoryForCreate(categoryId);
    };

    const handleOpenCreateCriterio = (categoryId = null, sectionId = null) => {
        setShowCreateCategoria(false);
        setShowCreateSeccion(false);
        setShowCreateCriterio(true);
        setDefaultCategoryForCreate(categoryId);
        setDefaultSectionForCreate(sectionId);
    };

    const handleCancel = () => {
      setEditingCategoryId(null);
      setEditingSectionId(null);
      setEditingCriterioId(null);
      setShowCreateCategoria(false);
      setShowCreateSeccion(false);
      setShowCreateCriterio(false);
      setDefaultCategoryForCreate(null);
      setDefaultSectionForCreate(null);
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
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#004A98] text-white rounded p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zm-1 8a1 1 0 112 0v3a1 1 0 11-2 0v-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Estructura del {marco.frame_name}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">{categorias.length} categorías</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">{secciones.length} indicadores</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">{criterios.length} criterios</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Agrega categorías, indicadores y criterios desde sus respectivas filas con “+”. Usa “Modificar” para editar elementos ya existentes.
            </p>
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
            defaultCategoryId={defaultCategoryForCreate}
          />
        )}

        {showCreateCriterio && (
          <CrearCriterioForm 
            onCancel={handleCancel} 
            onSaved={() => { handleCancel(); fetchCategorias(); }} 
            sections={secciones}
            categories={categorias}
            defaultCategoryId={defaultCategoryForCreate}
            defaultSectionId={defaultSectionForCreate}
          />
        )}
  
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/3">Categoría
                    <button 
                      className="ml-2 inline-flex items-center text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                      onClick={() => handleOpenCreateCategoria()}
                    >
                      + Agregar
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/3">Indicador</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/3">Criterio</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-medium">{cat.indice}. {cat.category_name}</span>
                                <button 
                                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  onClick={() => handleOpenEditCategoria(cat.category_id)}
                                >
                                  Modificar
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  className="text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                                  onClick={() => handleOpenCreateSeccion(cat.category_id)}
                                >
                                  + Indicador
                                </button>
                              </div>
                            </div>
                          </td>
                          <td colSpan="2" className="px-6 py-4 text-sm text-gray-500 italic">
                            No hay indicadores en esta categoría
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
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="font-medium">{cat.indice}. {cat.category_name}</span>
                                    <button 
                                      className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                      onClick={() => handleOpenEditCategoria(cat.category_id)}
                                    >
                                      Modificar
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      className="text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                                      onClick={() => handleOpenCreateSeccion(cat.category_id)}
                                    >
                                      + Indicador
                                    </button>
                                  </div>
                                </div>
                              </td>
                              
                            )}
                            <td className="px-6 py-4 text-sm text-gray-600 border-r">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{cat.indice}.{sec.indice}. {sec.section_name}</span>
                                  <button 
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={() => handleOpenEditSeccion(sec.section_id)}
                                  >
                                    Modificar
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                                    onClick={() => handleOpenCreateCriterio(cat.category_id, sec.section_id)}
                                  >
                                    + Criterio
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td colSpan="1" className="px-6 py-4 text-sm text-gray-500 italic">
                              No hay criterios en este indicador
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
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="font-medium">{cat.indice}. {cat.category_name}</span>
                                  <button 
                                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={() => handleOpenEditCategoria(cat.category_id)}
                                  >
                                    Modificar
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                                    onClick={() => handleOpenCreateSeccion(cat.category_id)}
                                  >
                                    + Indicador
                                  </button>
                                </div>
                              </div>
                            </td>
                          )}
                          {criIndex === 0 && (
                            <td 
                              rowSpan={sectionCriteria.length}
                              className="px-6 py-4 text-sm text-gray-600 align-top border-r"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{cat.indice}.{sec.indice}. {sec.section_name}</span>
                                  {sec.is_standard && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                      Criterio
                                    </span>
                                  )}
                                  <button 
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={() => handleOpenEditSeccion(sec.section_id)}
                                  >
                                    Modificar
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="text-xs text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded px-2 py-1 border border-green-200"
                                    onClick={() => handleOpenCreateCriterio(cat.category_id, sec.section_id)}
                                  >
                                    + Criterio
                                  </button>
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-600 border-r">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{cat.indice}.{sec.indice}.{cri.indice}. {cri.standard_name}</span>
                                {cri.is_transversal && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                    Transversal
                                  </span>
                                )}
                              </div>
                              <button 
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                onClick={() => handleOpenEditCriterio(cri.standard_id)}
                              >
                                Modificar
                              </button>
                            </div>
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
                    frame_id={marco.frame_id}
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
      <ModalAlert
        isOpen={modalAlertMessage !== null}
        message={modalAlertMessage}
        onClose={() => setModalAlertMessage(null)}
      />
    </>
    );
  }