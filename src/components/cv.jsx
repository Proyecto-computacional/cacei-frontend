import { useState, useEffect } from "react";
import api from "../services/api";
import { Download } from "lucide-react";


const CV = () => {
    const [data, setData] = useState({});
    const [activeSection, setActiveSection] = useState(1);
    const [cvId, setCvId] = useState(null); // Nuevo estado para cv_id
    const rpe = localStorage.getItem("rpe");

    const mapLetterToDegree = (letter) => {
        const degrees = {
          'L': 'Licenciatura',
          'E': 'Especialidad',
          'M': 'Maestría',
          'D': 'Doctorado'
        };
        return degrees[letter] || letter; // Si no hay coincidencia, muestra la letra
      };

    // Mapea los datos de la API al formato que espera tu formulario
    const mapApiDataToFormFields = (sectionId, apiData) => {
        const mappers = {
            1: (data) => ({ 
                grado: mapLetterToDegree(data.degree_obtained),
                titulo: data.degree_name,
                institución: data.institution,
                año: data.obtained_year,
                cedula: data.professional_license
            }),
            2: (data) => ({ 
                tipodecapacitacion: data.title_certification,
                institucion: data.institution_country,
                añoobtencion: data.obtained_year,
                horas: data.hours
            }),
            3: (data) => ({
                tipodeactualizacion: data.title_certification,
                institucion: data.institution_country,
                añoobtencion: data.year_certification,
                horas: data.hours
            }),
            4: (data) => ({
                puesto: data.job_position,
                institucion: data.institution,
                fechaInicio: data.start_date,
                fechaFin: data.end_date
            }),
            5: (data) => ({
                descripcion: data.description
            }),
            6: (data) => ({
                empresa: data.company_name,
                cargo: data.position,
                fechaInicio: data.start_date,
                fechaFin: data.end_date
            }),
            7: (data) => ({
                organismo: data.institution,
                periodo: data.period,
                nivel: data.level_experience
            }),
            8: (data) => ({
                descripcion: data.description
            }),
            9: (data) => ({
                organismo: data.institution,
                periodo: data.period,
                nivel: data.level_participation
            }),
            10: (data) => ({
                descripcion: data.description
            }),
            11: (data) => ({
                descripcion: data.description
            })
        };

        return mappers[sectionId]?.(apiData) || {};
    };

      useEffect(() => {
        const fetchSectionData = async (cvId, sectionId) => {
            const sectionEndpoints = {
                1: 'educations',
                2: 'teacher-trainings',
                3: 'disciplinary-updates',
                4: 'academic-managements',
                5: 'academic-products',
                6: 'laboral-experiences',
                7: 'engineering-designs',
                8: 'professional-achievements',
                9: 'participations',
                10: 'awards',
                11: 'contributions-to-pe'
            };
    
            const response = await api.get(`/api/additionalInfo/${cvId}/${sectionEndpoints[sectionId]}`);
            return response.data;
        };
    
        const fetchInitialData = async () => {
            try {
                const cvResponse = await api.post("/api/cvs", { user_rpe: rpe });
                setCvId(cvResponse.data.cv_id);
        
                if (cvResponse.data.cv_id) {
                    const sectionData = await fetchSectionData(cvResponse.data.cv_id, activeSection);
                    
                    setData(prev => ({
                        ...prev,
                        [activeSection]: sectionData.map((item, index) => ({
                            id: `${activeSection}_${item.id}_${index}`, // Añade sectionId al key
                            values: mapApiDataToFormFields(activeSection, item)
                        }))
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        if (rpe) fetchInitialData();
    }, [rpe, activeSection]);

    // Función modificada para enviar datos al backend
    const sendData = async (sectionId) => {
        if (!cvId || !data[sectionId]) return;
      
        try {
          // Mapeo de secciones a sus endpoints y transformación de datos
          const sectionConfigs = {
            1: { endpoint: 'educations', transform: (row) => ({ 
                institution: row.values.institución,
                degree_obtained: String(row.values.grado).charAt(0).toUpperCase(),
                obtained_year: parseInt(row.values.año),
                professional_license: row.values.cedula || null,
                degree_name: row.values.titulo
            })},
            2: { endpoint: 'teacher-trainings', transform: (row) => ({
                title_certification: row.values.tipodecapacitacion,
                institution_country: row.values.institucion,
                obtained_year: parseInt(row.values.añoobtencion),
                hours: parseInt(row.values.horas)
            })},
            3: { endpoint: 'disciplinary-updates', transform: (row) => ({
                title_certification: row.values.tipodeactualizacion,
                institution_country: row.values.institucion,
                year_certification: parseInt(row.values.añoobtencion),
                hours: parseInt(row.values.horas)
            })},
            4: { endpoint: 'academic-managements', transform: (row) => ({
                job_position: row.values.puesto,
                institution: row.values.institucion,
                start_date: row.values.fechaInicio,
                end_date: row.values.fechaFin
            })},
            5: { endpoint: 'academic-products', transform: (row) => ({
                description: row.values.descripcion
            })},
            6: { endpoint: 'laboral-experiences', transform: (row) => ({
                company_name: row.values.empresa,
                position: row.values.cargo,
                start_date: row.values.fechaInicio,
                end_date: row.values.fechaFin
            })},
            7: { endpoint: 'engineering-designs', transform: (row) => ({
                institution: row.values.organismo,
                period: row.values.periodo,
                level_experience: row.values.nivel
            })},
            8: { endpoint: 'professional-achievements', transform: (row) => ({
                description: row.values.descripcion
            })},
            9: {endpoint: 'participations', transform: (row) => ({
                institution: row.values.organismo,
                period: row.values.periodo,
                level_participation: row.values.nivel
            })},
            10: { endpoint: 'awards', transform: (row) => ({
                description: row.values.descripcion
            })},
            11: { endpoint: 'contributions-to-pe', transform: (row) => ({
                description: row.values.descripcion
            })}
          };
      
          const config = sectionConfigs[sectionId];
          if (!config) return;

          // Filter out empty rows and validate payloads
          const validRows = data[sectionId].filter(row => {
            const payload = config.transform(row);
            const hasValues = Object.values(payload).some(value => value !== undefined && value !== null && value !== '');
            return hasValues;
          });

          if (validRows.length === 0) {
            alert('No hay datos válidos para guardar');
            return;
          }
      
          // Enviar datos para la sección actual
          await Promise.all(validRows.map(async (row) => {
            const payload = config.transform(row);
            await api.post(`/api/additionalInfo/${cvId}/${config.endpoint}`, payload);
          }));
      
          alert('¡Datos guardados correctamente!');
        } catch (error) {
          console.error('Error:', error.response?.data);
          if (error.response?.status === 422) {
            alert('Por favor ingrese los datos necesarios en las celdas');
          } else {
            alert(`Error al guardar: ${error.response?.data.message || error.message}`);
          }
        }
    };


    const secciones = [
        {
            id: 1,
            sectionName: "Formación Académica",
            campos: [
                { name: "grado", type: "select", options: ["Licenciatura", "Especialidad", "Maestría", "Doctorado"], label: "Grado" },
                { name: "titulo", type: "text", label: "Nombre del título", placeholder: "Título (Incluir especialidad)" },
                { name: "institución", type: "text", label: "Nombre de la institución", placeholder: "Nombre de la institución" },
                { name: "año", type: "text", label: "Año de obtención", placeholder: "Año de obtención" },
                { name: "cedula", type: "text", label: "Cédula profesional", placeholder: "Cédula profesional" },
            ],
        },
        {
            id: 2,
            sectionName: "Capacitación Docente",
            campos: [
                { name: "tipodecapacitacion", type: "text", label: "Tipo de capacitación", placeholder: "Nombre de la capacitación" },
                { name: "institucion", type: "text", label: "Institución y país", placeholder: "Nombre de la institución y del páis" },
                { name: "añoobtencion", type: "text", label: "Año de obtención", placeholder: "MM/AAAA" },
                { name: "horas", type: "text", label: "Horas", placeholder: "Horas hechas" },
            ],
        },
        {
            id: 3,
            sectionName: "Actualización Disciplinar",
            campos: [
                { name: "tipodeactualizacion", type: "text", label: "Tipo de actualización", placeholder: "Nombre de la actualización" },
                { name: "institucion", type: "text", label: "Institución y país", placeholder: "Nombre de la institución y del páis" },
                { name: "añoobtencion", type: "text", label: "Año de obtención", placeholder: "MM/AAAA" },
                { name: "horas", type: "text", label: "Horas", placeholder: "Horas hechas" },
            ],
        },
        {
            id: 4,
            sectionName: "Gestión académica",
            campos: [
                { name: "puesto", type: "text", label: "Actividad o puesto", placeholder: "Actividad o puesto desempeñado" },
                { name: "institucion", type: "textarea", label: "Institución", placeholder: "Nombre de la institución" },
                { name: "fechaInicio", type: "date", label: "Fecha de inicio", placeholder: "MM/AAAA" },
                { name: "fechaFin", type: "date", label: "Fecha de finalización", placeholder: "MM/AAAA o Actualidad" },
            ],
        },
        {
            id: 5,
            sectionName: "Productos académicos relevantes",
            campos:[
                { name: "descripcion", type: "text", label: "Descripción", placeholder: "Descripción del producto en cuestión"},
            ],
        },
        {
            id: 6,
            sectionName: "Experiencia Laboral",
            campos: [
                { name: "empresa", type: "text", label: "Empresa", placeholder: "Nombre de la empresa" },
                { name: "cargo", type: "text", label: "Cargo", placeholder: "Cargo desempeñado" },
                { name: "fechaInicio", type: "date", label: "Fecha de inicio", placeholder: "MM/AAAA" },
                { name: "fechaFin", type: "date", label: "Fecha de finalización", placeholder: "MM/AAAA o Actualidad" },
            ],
        },
        {
            id: 7,
            sectionName: "Experiencia en diseño igenieril",
            campos: [
                {name: "organismo", type: "text", label: "Organismo", placeholder: "Nombre del organismo"},
                {name: "periodo", type: "text", label: "Periodo (años)", placeholder: "Número de años"},
                {name: "nivel", type: "text", label: "Nivel de experiencia", placeholder:"Nivel del 1 al 5"},
            ],
        },
        {
            id: 8,
            sectionName: "Logros Profesionales",
            campos: [
                { name: "descripcion", type: "text", label: "Descripción", placeholder: "Ej: Premio Nacional de Innovación en Tecnología 2020" },
            ],
        },
        {
            id: 9,
            sectionName: "Participación en organismos profesionales",
            campos: [
                {name: "organismo", type: "text", label: "Organismo", placeholder: "Nombre del organismo"},
                {name: "periodo", type: "text", label: "Periodo (años)", placeholder: "Número de años"},
                {name: "nivel", type: "text", label: "Nivel de participación", placeholder:"Nivel del 1 al 5"},
            ],
        },
        {
            id: 10,
            sectionName: "Premios y Reconocimientos",
            campos: [
                { name: "descripcion", type: "text", label: "Descripción", placeholder: "Ej: Premio Nacional de Innovación en Tecnología 2020" },
            ],
        },
        {
            id: 11,
            sectionName: "Aportaciones a la Mejora del PE",
            campos: [
                { name: "descripcion", type: "text", label: "Descripción", placeholder: "Ej: Desarrollo de un nuevo modelo de enseñanza híbrida" },
            ],
        },
    ];  

    const addRow = (sectionId) => {
        setData((prev) => ({
            ...prev,
            [sectionId]: [
                ...(prev[sectionId] || []), 
                { 
                    id: `new_${sectionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    values: {} 
                }
            ],
        }));
    };

    const removeRow = (sectionId, rowId) => {
        setData((prev) => ({
            ...prev,
            [sectionId]: prev[sectionId].filter((row) => row.id !== rowId),
        }));
    };

    const isRowEmpty = (row) => {
        return Object.values(row.values).every(value => !value);
    };

    const updateRow = (sectionId, rowId, field, value) => {
        setData((prev) => {
            // Verifica que la sección exista
            if (!prev[sectionId]) return prev;
            
            return {
                ...prev,
                [sectionId]: prev[sectionId].map((row) =>
                    row.id === rowId 
                        ? { 
                            ...row, 
                            values: { 
                                ...row.values, 
                                [field]: value 
                            } 
                        } 
                        : row
                ),
            };
        });
    };
    
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <aside className="w-1/4 bg-gray-200 p-4">
                    <h2 className="text-xl font-bold mb-4">Secciones</h2>
                    <ul>
                        {secciones.map((section) => (
                            <li
                                key={section.id}
                                className={`p-2 cursor-pointer ${activeSection === section.id ? "bg-gray-400" : ""}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.sectionName}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="w-3/4 p-6">
                    {secciones.map(
                        (section) =>
                            activeSection === section.id && (
                                <div key={section.id}>
                                    <h2 className="text-2xl font-bold mb-4">{section.sectionName}</h2>
                                    <table className="w-full text-primary1">
                                        <thead>
                                            <tr>
                                                {section.campos.map((campo) => (
                                                    <th key={campo.name} className="px-4 py-2">{campo.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(data[section.id] || []).map((row) => (
                                                <tr key={row.id}>
                                                    {section.campos.map((campo) => (
                                                        <td key={`${row.id}_${campo.name}`} className="border px-4 py-2">
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
                                                    <td className="border px-4 py-2">
                                                        {isRowEmpty(row) && (
                                                            <button
                                                                onClick={() => removeRow(section.id, row.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                                title="Eliminar fila vacía"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex gap-4 mt-4">
                                        <button 
                                            className="bg-neutral-200 px-4 py-2 rounded hover:bg-neutral-300 transition-colors duration-200" 
                                            onClick={() => addRow(section.id)}
                                        >
                                            Agregar
                                        </button>
                                        <button 
                                            className="bg-primary1 text-white px-4 py-2 rounded hover:bg-[#003d7a] transition-colors duration-200" 
                                            onClick={() => sendData(section.id)}
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            )
                    )}
                </main>
            </div>
            <div className="flex justify-end p-6 border-t">
                <button 
                    className="bg-[#004A98] text-white px-6 py-3 rounded hover:bg-[#003d7a] transition-colors duration-200 flex items-center gap-2 text-lg" 
                    onClick={() => alert('La funcionalidad de descarga estará disponible próximamente')}
                >
                    <Download className="h-6 w-6" />
                    Descargar CV
                </button>
            </div>
        </div>
    );
};

export default CV;