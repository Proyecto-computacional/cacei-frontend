import { useState } from "react";
import Section from "./Section";

const CV = () => {
    const [data, setData] = useState({});
    const [previousData, setPreviousData] = useState({});

    const secciones = [
      {
        id: 1,
        sectionName: "Formacion Académica",
        campos: [
          { name: "grado", type: "select", options:["Licenciatura", "Especialidad", "Maestria", "Doctorado"], label: "Grado" },
          { name: "titulo", type: "text", label: "Nombre del titulo", placeholder: "Titulo (Incluir especialiad)" },
          { name: "insitución", type: "text", label: "Nombre de la institución", placeholder: "Nombre de la institución" },
          { name: "pais", type: "select", options:["México", "Colombia", "Estados Unidos", "Canada"], label: "País" },
          { name: "año", type: "text", label: "Año de obtención", placeholder: "Año de obtención" },
          { name: "cedula", type: "text", label: "Cédula profesional", placeholder: "Cédula profesional" },
        ],
      },
      { id: 2, sectionName: "Capacitación Docente", campos: [
          { name: "tipo", type: "text", label: "Tipo de capacitación" },
          { name: "institucion", type: "text", label: "Institución y país" },
          { name: "año", type: "number", label: "Año de obtención" },
          { name: "horas", type: "number", label: "Horas" }
        ]
      },
      { id: 3, sectionName: "Experiencia Profesional No Académica", campos: [
          { name: "actividad", type: "text", label: "Actividad o puesto" },
          { name: "organizacion", type: "text", label: "Organización o empresa" },
          { name: "inicio", type: "month", label: "Fecha de inicio" },
          { name: "fin", type: "month", label: "Fecha de fin" }
        ]
      },
      { id: 4, sectionName: "Participación en Organismos Profesionales", campos: [
          { name: "organismo", type: "text", label: "Organismo" },
          { name: "periodo", type: "number", label: "Periodo (años)" },
          { name: "nivel", type: "text", label: "Nivel de participación" }
        ]
      },
      { id: 5, sectionName: "Premios y Reconocimientos", campos: [
          { name: "descripcion", type: "text", label: "Descripción del premio o reconocimiento" }
        ]
      },
      { id: 6, sectionName: "Aportaciones a la Mejora del PE", campos: [
          { name: "descripcion", type: "textarea", label: "Descripción de la aportación" }
        ]
      }
    ];
    

    const registros = [
        {
          id: 1,
          grado: "Maestria",
          titulo: "Maestría en Ciencias de la Computación",
          insitución: "Universidad Nacional Autónoma de México",
          pais: "México",
          año: "2018",
          cedula: "12345678",
        },
        {
          id: 2,
          grado: "Doctorado",
          titulo: "Doctorado en Inteligencia Artificial",
          insitución: "Massachusetts Institute of Technology",
          pais: "Estados Unidos",
          año: "2022",
          cedula: "87654321",
        },
      ];
      const addRow = (sectionId) => {
        setData((prev) => ({
          ...prev,
          [sectionId]: [...(prev[sectionId] || []), { id: Date.now(), values: {} }],
        }));
      };
    
      const updateRow = (sectionId, rowId, field, value) => {
        setData((prev) => ({
          ...prev,
          [sectionId]: prev[sectionId].map((row) =>
            row.id === rowId ? { ...row, values: { ...row.values, [field]: value } } : row
          ),
        }));
      };
    
      const sendData = (sectionId) => {
        console.log("Enviando", sectionId ? data[sectionId] : data);
        // Aquí se enviarán los datos al backend cuando se implemente
      };
    
      return (
        <div className="p-4 space-y-6 border flex flex-wrap">
          {secciones.map((section) => (
            <div key={section.id} className=" p-4 rounded-lg w-fit">
              <h2 className="text-2x1 font-bold text-alt1">{section.sectionName}</h2>
              <table className="w-full mt-4 text-primary1">
                <thead>
                  <tr>
                    {section.campos.map((campo) => (
                      <th key={campo.name} className="px-4 py-2">{campo.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registros.map((previous) => (
              <tr className="">
                {section.campos.map((field) => (
                    <td className="p-2 text-center">{previous[field.name]}</td>
                  ))}
              </tr>
              ))}
                  {(data[section.id] || []).map((row) => (
                    <tr key={row.id}>
                      {section.campos.map((campo) => (
                        <td key={campo.name} className="border px-4 py-2">
                          {campo.type === "select" ? (
                            <select
                              value={row.values[campo.name] || ""}
                              onChange={(e) => updateRow(section.id, row.id, campo.name, e.target.value)}
                              className="border p-1 w-full"
                            >
                              <option value="">Seleccione</option>
                              {campo.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={campo.type}
                              value={row.values[campo.name] || ""}
                              onChange={(e) => updateRow(section.id, row.id, campo.name, e.target.value)}
                              placeholder={campo.placeholder}
                              className="border p-1 w-full"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
                <div className="flex min-w-max justify-center gap-1">
                <button
                className="mt-2 bg-neutral-200 px-4 py-2 rounded"
                onClick={() => addRow(section.id)}
              >
                +
              </button>
              <button
                className="mt-2 bg-neutral-200 px-4 py-2 rounded block"
                onClick={() => addRow(section.id)}
              >
                -
              </button>
                </div>
              <button
                className="mt-2 bg-primary1 text-white px-4 py-2 rounded"
                onClick={() => sendData(section.id)}
              >
                Enviar {section.sectionName}
              </button>
            </div>
          ))}
          <button
            className="bg-alt1 text-white px-4 py-2 rounded"
            onClick={() => sendData(null)}
          >
            Enviar Todo
          </button>
        </div>
      );
}

export default CV;