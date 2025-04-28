import { useState } from "react";
import { AppHeader, AppFooter, SubHeading } from "../common";

const EvidencesCompilation = () => {
  const [showModal, setShowModal] = useState(false);
  const [finalize, setFinalize] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [openCategories, setOpenCategories] = useState({});

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
    console.log("Compilando evidencias...");
    console.log("Finalizar acreditación:", finalize);
    setShowModal(false);
  };

  const evidencesStructure = [
    {
      section: "Categoría 1",
      categories: [
        {
          name: "Sección 1.1",
          criteria: ["Criterio 1.1.1", "Criterio 1.1.2"],
        },
        {
          name: "Sección 1.2",
          criteria: ["Criterio 1.2.1"],
        },
      ],
    },
    {
      section: "Categoría 2",
      categories: [
        {
          name: "Sección 2.1",
          criteria: ["Criterio 2.1.1", "Criterio 2.1.2", "Criterio 2.1.3"],
        },
      ],
    },
  ];

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
          {/* Árbol interactivo */}
          <div className="w-2/3 bg-white p-6 rounded-xl shadow-md">
            <ul className="space-y-4">
              {evidencesStructure.map((sec, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleSection(i)}
                    className="flex items-center gap-2 font-bold text-lg mb-1 hover:text-blue-700"
                  >
                    <span>
                      {openSections[i] ? "➖" : "➕"}
                    </span>
                    {sec.section}
                  </button>

                  {openSections[i] && (
                    <ul className="ml-6 space-y-2">
                      {sec.categories.map((cat, j) => {
                        const catKey = `${i}-${j}`;
                        return (
                          <li key={j}>
                            <button
                              onClick={() => toggleCategory(i, j)}
                              className="flex items-center gap-2 font-semibold hover:text-blue-600"
                            >
                              <span>
                                {openCategories[catKey] ? "📂" : "📁"}
                              </span>
                              {cat.name}
                            </button>

                            {openCategories[catKey] && (
                              <ul className="ml-6 list-disc text-gray-700 text-sm">
                                {cat.criteria.map((crit, k) => (
                                  <li key={k}>{crit}</li>
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
            <p className="text-sm text-gray-600 mb-3 text-right max-w-[280px]">
                Al compilar las evidencias, se agruparán todas las que ya fueron aprobadas.
            </p>
            <button
                onClick={handleCompileClick}
                className="bg-blue-700 text-white py-2 px-6 rounded-xl text-lg font-semibold"
            >
                Compilar Evidencias
            </button>
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

      <AppFooter />
    </>
  );
};

export default EvidencesCompilation;
