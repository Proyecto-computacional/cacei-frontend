import { useState, useEffect } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";
import api from "../services/api"

const EvidencesCompilation = () => {
  const [showModal, setShowModal] = useState(false);
  const [finalize, setFinalize] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [link, setLink] = useState(null);
  const [evidencesStructure, setEvidencesStructure] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSection = (sectionIndex) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const toggleCategory = (sectionIndex, categoryIndex) => {
    const key = `${sectionIndex}-${categoryIndex}`;
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCompileClick = () => {
    setShowModal(true);
  };

  const confirmCompilation = () => {
    const processId = parseInt(localStorage.getItem("currentProcessId"), 10);
    console.log('processId', processId);
    api.get(`/api/procesos/${processId}/descargar-evidencias`, {
      responseType: "blob",
    })
      .then((response) => {
        // Check if the response is empty or has no content
        if (response.data.size === 0) {
          alert("No hay evidencias para compilar en este proceso.");
          setShowModal(false);
          return;
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setLink(url); 
        setShowModal(false); 
      })
      .catch((error) => {
        console.error("Error al compilar las evidencias:", error);
        if (error.response && error.response.status === 404) {
          alert("No se encontraron evidencias para compilar en este proceso.");
        } else {
          alert("Error al compilar las evidencias. Por favor, intente nuevamente.");
        }
        setShowModal(false);
      });
  };

  // Función para limpiar la URL cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (link) {
        window.URL.revokeObjectURL(link);
      }
    };
  }, [link]);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const processId = localStorage.getItem("currentProcessId");
        if (!processId) {
          throw new Error('No process ID found');
        }

        // First get the process details to get the frame_id
        const processRes = await api.get(`/api/processes/${processId}`);
        if (!processRes || !processRes.data) {
          throw new Error('No process data received');
        }
        const frameId = processRes.data.frame_id;

        // Fetch categories with the correct frame_id
        const categoriesRes = await api.post('/api/categories', { frame_id: frameId });
        if (!categoriesRes || !categoriesRes.data) {
          throw new Error('No categories data received');
        }
        const categories = categoriesRes.data;

        // Fetch sections for each category
        const sectionsPromises = categories.map(cat =>
          api.post('/api/sections', { category_id: cat.category_id })
        );
        const sectionsRes = await Promise.all(sectionsPromises);

        // Fetch standards for each section
        const standardsPromises = sectionsRes.flatMap(res => {
          if (!res || !res.data) {
            console.warn('Invalid section response:', res);
            return [];
          }
          return res.data.map(sec =>
            api.post('/api/standards', { section_id: sec.section_id })
          );
        });
        const standardsRes = await Promise.all(standardsPromises);

        // Build the structure
        const structure = categories.map((cat, i) => {
          const sectionData = sectionsRes[i]?.data || [];
          const standardData = standardsRes[i]?.data || [];

          return {
            section: cat.category_name,
            categories: sectionData.map((sec, j) => ({
              name: sec.section_name,
              criteria: standardData.map(std => std.standard_name)
            }))
          };
        });

        console.log('Structure built:', structure);
        setEvidencesStructure(structure);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching structure:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          stack: error.stack
        });
        setLoading(false);
      }
    };

    fetchStructure();
  }, []);

  return (
    <>
      <AppHeader />
      <SubHeading />
      <div
        className="min-h-screen p-10 pl-18"
        style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[34px] font-semibold text-[#004A98] font-['Open_Sans']">
                Compilación de evidencias
              </h1>
              <p className="text-gray-600 mt-2">
                Genera una compilación de todas las evidencias aprobadas en el proceso
              </p>
            </div>
            {link && (
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <a
                  href={link}
                  download="evidencias_compiladas.zip"
                  className="bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Descargar Evidencias
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Estructura de Evidencias</h2>
                  <p className="text-gray-600 mt-1">Explora la estructura completa de evidencias del proceso</p>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A98]"></div>
                      <span className="ml-3 text-gray-600">Cargando estructura...</span>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {evidencesStructure.map((sec, i) => (
                        <li key={i} className="border-l-2 border-[#004A98] pl-4">
                          <button
                            onClick={() => toggleSection(i)}
                            className="flex items-center gap-2 font-bold text-lg mb-1 hover:text-[#004A98] transition-colors duration-200 w-full text-left"
                          >
                            <span className="text-[#004A98]">
                              {openSections[i] ? "📂" : "📁"}
                            </span>
                            <span className="text-gray-800">{sec.section}</span>
                          </button>

                          {openSections[i] && (
                            <ul className="ml-6 space-y-3 mt-2">
                              {sec.categories.map((cat, j) => {
                                const catKey = `${i}-${j}`;
                                return (
                                  <li key={j} className="border-l-2 border-gray-200 pl-4">
                                    <button
                                      onClick={() => toggleCategory(i, j)}
                                      className="flex items-center gap-2 font-semibold hover:text-[#004A98] transition-colors duration-200 w-full text-left"
                                    >
                                      <span className="text-[#004A98]">
                                        {openCategories[catKey] ? "📄" : "📄"}
                                      </span>
                                      <span className="text-gray-700">{cat.name}</span>
                                    </button>

                                    {openCategories[catKey] && (
                                      <ul className="ml-6 mt-2 space-y-2">
                                        {cat.criteria.map((crit, k) => (
                                          <li
                                            key={k}
                                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                          >
                                            <span className="text-[#004A98]">•</span>
                                            <span className="text-sm">{crit}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#004A98] p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Compilación Final</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Al compilar las evidencias, se agruparán todas las que ya fueron aprobadas en un archivo ZIP.
                </p>
                <button
                  onClick={handleCompileClick}
                  className="w-full bg-[#004A98] text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-[#003d7a] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Compilar Evidencias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ¿Estás seguro de que deseas compilar las evidencias?
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Esta acción tomará todas las evidencias aprobadas. Una vez compiladas, no se podrán editar.
            </p>
            <label className="flex items-center mb-6 text-sm text-gray-700">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-[#004A98] focus:ring-[#004A98]"
                checked={finalize}
                onChange={(e) => setFinalize(e.target.checked)}
              />
              Finalizar proceso de acreditación (impide subir más evidencias)
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCompilation}
                className="bg-[#004A98] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#003d7a] transition-colors duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <AppFooter />
    </>
  );
};

export default EvidencesCompilation;