import { useState } from "react";
import CvRecords from "./CvRecords";

const CV = () => {
  const [data, setData] = useState({});
  const [previousData, setPreviousData] = useState({});

  const secciones = [
    {
      id: 1,
      sectionName: "Formacion Académica",
      campos: [
        { name: "grado", type: "select", options: ["Licenciatura", "Especialidad", "Maestria", "Doctorado"], label: "Grado" },
        { name: "titulo", type: "text", label: "Nombre del titulo", placeholder: "Titulo (Incluir especialiad)" },
        { name: "insitución", type: "text", label: "Nombre de la institución", placeholder: "Nombre de la institución" },
        { name: "pais", type: "select", options: ["México", "Colombia", "Estados Unidos", "Canada"], label: "País" },
        { name: "año", type: "text", label: "Año de obtención", placeholder: "Año de obtención" },
        { name: "cedula", type: "text", label: "Cédula profesional", placeholder: "Cédula profesional" },
      ],
    },
    {
      id: 2, sectionName: "Capacitación Docente", campos: [
        { name: "tipo", type: "text", label: "Tipo de capacitación" },
        { name: "institucion", type: "text", label: "Institución y país" },
        { name: "año", type: "number", label: "Año de obtención" },
        { name: "horas", type: "number", label: "Horas" }
      ]
    },
    {
      id: 3, sectionName: "Experiencia Profesional No Académica", campos: [
        { name: "actividad", type: "text", label: "Actividad o puesto" },
        { name: "organizacion", type: "text", label: "Organización o empresa" },
        { name: "inicio", type: "month", label: "Fecha de inicio" },
        { name: "fin", type: "month", label: "Fecha de fin" }
      ]
    },
    {
      id: 4, sectionName: "Participación en Organismos Profesionales", campos: [
        { name: "organismo", type: "text", label: "Organismo" },
        { name: "periodo", type: "number", label: "Periodo (años)" },
        { name: "nivel", type: "text", label: "Nivel de participación" }
      ]
    },
    {
      id: 5, sectionName: "Premios y Reconocimientos", campos: [
        { name: "descripcion", type: "text", label: "Descripción del premio o reconocimiento" }
      ]
    },
    {
      id: 6, sectionName: "Aportaciones a la Mejora del PE", campos: [
        { name: "descripcion", type: "textarea", label: "Descripción de la aportación" }
      ]
    }
  ];


  const registros = {
    1: [ // Formación Académica
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
    ],
    2: [ // Capacitación Docente
      {
        id: 1,
        tipo: "Curso en Didáctica Universitaria",
        institucion: "Universidad Autónoma de Barcelona, España",
        año: 2020,
        horas: 40,
      },
      {
        id: 2,
        tipo: "Taller de Innovación Educativa",
        institucion: "Tecnológico de Monterrey, México",
        año: 2021,
        horas: 30,
      },
    ],
    3: [ // Experiencia Profesional No Académica
      {
        id: 1,
        actividad: "Desarrollador de Software",
        organizacion: "Google LLC",
        inicio: "2017-06",
        fin: "2020-08",
      },
      {
        id: 2,
        actividad: "Consultor en Ciberseguridad",
        organizacion: "Kaspersky Lab",
        inicio: "2021-01",
        fin: "2023-02",
      },
    ],
    4: [ // Participación en Organismos Profesionales
      {
        id: 1,
        organismo: "IEEE (Institute of Electrical and Electronics Engineers)",
        periodo: 5,
        nivel: "Miembro Senior",
      },
      {
        id: 2,
        organismo: "ACM (Association for Computing Machinery)",
        periodo: 3,
        nivel: "Miembro Asociado",
      },
    ],
    5: [ // Premios y Reconocimientos
      {
        id: 1,
        descripcion: "Premio Nacional de Innovación en Tecnología 2020",
      },
      {
        id: 2,
        descripcion: "Reconocimiento a la Excelencia en Docencia 2021",
      },
    ],
    6: [ // Aportaciones a la Mejora del PE
      {
        id: 1,
        descripcion: "Desarrollo de un nuevo modelo de enseñanza híbrida para la carrera de Ingeniería en Sistemas Computacionales.",
      },
      {
        id: 2,
        descripcion: "Implementación de un sistema de evaluación basado en proyectos para mejorar la retención de conocimientos en estudiantes.",
      },
    ],
  };

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
  };

  return (
    <div className="p-4 space-y-6 border">
      {secciones.map((section) => (
        <div key={section.id} className="p-4 rounded-lg w-fit">
          <h2 className="text-2x1 font-bold text-alt1">{section.sectionName}</h2>
          <table className="w-full mt-4 text-primary1">
            <thead>
              <tr>
                {section.campos.map((campo) => (
                  <th key={campo.name} className="px-4 py-2 ">{campo.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CvRecords registros={registros} section2={section} />
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
        className="bg-alt1 text-white px-4 py-2 rounded w-max"
        onClick={() => sendData(null)}
      >
        Enviar Todo
      </button>
    </div>
  );
}

export default CV;