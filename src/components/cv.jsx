import { useState, useEffect } from "react";
import api from "../services/api";
import { Download, Plus, Save, X } from "lucide-react";

const CV = () => {
    const [data, setData] = useState({});
    const [activeSection, setActiveSection] = useState(1);
    const [cvId, setCvId] = useState(null);
    const rpe = localStorage.getItem("rpe");

    const mapLetterToDegree = (letter) => {
        const degrees = {
            'L': 'Licenciatura',
            'E': 'Especialidad',
            'M': 'Maestría',
            'D': 'Doctorado'
        };
        return degrees[letter] || letter;
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

    // Add download function
    const handleDownload = async () => {
        try {
            const response = await api.get(`/api/cv/word/${rpe}`, {
                responseType: 'blob'
            });
            
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `CV_${rpe}.docx`);
            
            // Append to body, click and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CV:', error);
            alert('Error al descargar el CV. Por favor intente nuevamente.');
        }
    };

    const sections = [
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
                { name: "institucion", type: "text", label: "Institución y país", placeholder: "Nombre de la institución y del país" },
                { name: "añoobtencion", type: "text", label: "Año de obtención", placeholder: "MM/AAAA" },
                { name: "horas", type: "text", label: "Horas", placeholder: "Horas hechas" },
            ],
        },
        {
            id: 3,
            sectionName: "Actualización Disciplinar",
            campos: [
                { name: "tipodeactualizacion", type: "text", label: "Tipo de actualización", placeholder: "Nombre de la actualización" },
                { name: "institucion", type: "text", label: "Institución y país", placeholder: "Nombre de la institución y del país" },
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
            sectionName: "Experiencia en diseño ingenieril",
            campos: [
                {name: "organismo", type: "text", label: "Organismo", placeholder: "Nombre del organismo"},
                {name: "periodo", type: "text", label: "Período (años)", placeholder: "Número de años"},
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
        <div className="flex flex-col">
            <div className="flex flex-1">
                <aside className="w-1/4 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Secciones</h2>
                    <ul className="space-y-2">
                        {sections.map((section) => (
                            <li
                                key={section.id}
                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                    activeSection === section.id 
                                        ? "bg-primary1 text-white" 
                                        : "hover:bg-gray-200"
                                }`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {section.sectionName}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="w-3/4 p-6">
                    {sections.map(
                        (section) =>
                            activeSection === section.id && (
                                <div key={section.id}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800">{section.sectionName}</h2>
                                        <button
                                            onClick={() => addRow(section.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary1 text-white rounded-lg hover:bg-primary1/90 transition-colors duration-200"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    {section.campos.map((campo) => (
                                                        <th key={campo.name} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                            {campo.label}
                                                        </th>
                                                    ))}
                                                    <th className="w-12"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {(data[section.id] || []).map((row) => (
                                                    <tr key={row.id} className="hover:bg-gray-50">
                                                        {section.campos.map((campo) => (
                                                            <td key={`${row.id}_${campo.name}`} className="px-4 py-3">
                                                                {campo.type === "select" ? (
                                                                    <select
                                                                        value={row.values[campo.name] || ""}
                                                                        onChange={(e) => updateRow(section.id, row.id, campo.name, e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
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
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
                                                                    />
                                                                )}
                                                            </td>
                                                        ))}
                                                        <td className="px-2 py-3">
                                                            {isRowEmpty(row) && (
                                                                <button
                                                                    onClick={() => removeRow(section.id, row.id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                                    title="Eliminar fila vacía"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {data[section.id]?.length > 0 && (
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => sendData(section.id)}
                                                className="flex items-center gap-2 px-6 py-2 bg-primary1 text-white rounded-lg hover:bg-primary1/90 transition-colors duration-200"
                                            >
                                                <Save className="w-4 h-4" />
                                                Guardar cambios
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                    )}
                </main>
            </div>
            
            {/* Fixed download button */}
            <button 
                onClick={handleDownload}
                className="fixed bottom-15 right-15 bg-primary1 text-white px-6 py-3 hover:bg-[#003d7a] transition-colors duration-200 flex items-center gap-2 shadow-lg rounded-lg"
            >
                <Download className="h-5 w-5" />
                Descargar CV
            </button>
        </div>
    );
};

export default CV;