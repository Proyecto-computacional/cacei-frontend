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

    api.get("/api/procesos/1/descargar-evidencias", {
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setLink(url); 
        setShowModal(false); 
      })
      .catch((error) => {
        console.error("Error al compilar las evidencias:", error);
      });
  };

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        // Fetch categories
        const categoriesRes = await api.post('/api/categories', { frame_id: 1 });
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

        setEvidencesStructure(structure);
      } catch (error) {
        console.error("Error fetching structure:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          stack: error.stack
        });
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
        <h1 className="text-[34px] font-semibold text-black font-['Open_Sans'] mt-6 mb-5">
          Compilación de evidencias
        </h1>

        <div className="flex gap-10">
          <div className="w-2/3 bg-white p-6 rounded-xl shadow-md">
            <ul className="space-y-4">
              {evidencesStructure.map((sec, i) => (
                <li key={i} className="border-l-2 border-gray-200 pl-4">
                  <button
                    onClick={() => toggleSection(i)}
                    className="flex items-center gap-2 font-bold text-lg mb-1 hover:text-blue-700 transition-colors duration-200"
                  >
                    <span className="text-blue-600">
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
                              className="flex items-center gap-2 font-semibold hover:text-blue-600 transition-colors duration-200"
                            >
                              <span className="text-blue-500">
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
                                    <span className="text-blue-400">•</span>
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
          </div>

          <div className="w-1/3 flex flex-col items-end justify-start pr-8 pt-2">
            <div className="bg-white p-6 rounded-xl shadow-md w-full">
              <p className="text-sm text-gray-600 mb-4">
                Al compilar las evidencias, se agruparán todas las que ya fueron aprobadas.
              </p>
              <button
                onClick={handleCompileClick}
                className="w-full bg-blue-700 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Compilar Evidencias
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ¿Estás seguro de que deseas compilar las evidencias?
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Esta acción tomará todas las evidencias aprobadas. Una vez compiladas, no se podrán editar.
            </p>
            <label className="flex items-center mb-4 text-sm text-gray-700">
              <input
                type="checkbox"
                className="mr-2"
                checked={finalize}
                onChange={(e) => setFinalize(e.target.checked)}
              />
              Finalizar proceso de acreditación (impide subir más evidencias)
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCompilation}
                className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Si hay un enlace para descargar las evidencias, mostrar un botón para la descarga */}
      {link && (
        <div className="flex justify-center mt-6">
          <a href={link} download="evidencias_compiladas.zip">
            <button className="bg-green-600 text-white py-2 px-6 rounded-xl text-lg font-semibold">
              Descargar Evidencias Compiladas
            </button>
          </a>
        </div>
      )}

      <AppFooter />
    </>
  );
};

export default EvidencesCompilation;