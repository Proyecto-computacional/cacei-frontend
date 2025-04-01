import { useState, useEffect } from "react";
import Section from "./Section";


const CV = () => {
    const [data, setData] = useState({});
    const [activeSection, setActiveSection] = useState(1);
    const rpe = localStorage.getItem("rpe");
    console.log("rpe: " + rpe);

    useEffect(() => {
        if (rpe) {
            fetchCV(rpe);
        }
    }, [rpe]);

    const fetchCV = async (rpe) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cvs/${rpe}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error al obtener el CV");
            
            const data = await response.json();
            setData(data); // Guardar en el estado
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const sendData = async (sectionId) => {
        console.log("Sending2: llegóoo:)");
        const sectionData = data[sectionId];
        if (!sectionData) return;

        try {
            const response = await fetch(`http://localhost:8000/api/cvs/${rpe}/seccion/${sectionId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sectionData)
            });

            if (!response.ok) throw new Error("Error al enviar datos");

            console.log("Datos enviados correctamente");
        } catch (error) {
            console.error("Error:", error);
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
                { name: "pais", type: "select", options: ["México", "Colombia", "Estados Unidos", "Canadá"], label: "País" },
                { name: "año", type: "text", label: "Año de obtención", placeholder: "Año de obtención" },
                { name: "cedula", type: "text", label: "Cédula profesional", placeholder: "Cédula profesional" },
            ],
        },
        {
            id: 2,
            sectionName: "Experiencia Laboral",
            campos: [
                { name: "empresa", type: "text", label: "Empresa", placeholder: "Nombre de la empresa" },
                { name: "cargo", type: "text", label: "Cargo", placeholder: "Cargo desempeñado" },
                { name: "fechaInicio", type: "text", label: "Fecha de inicio", placeholder: "MM/AAAA" },
                { name: "fechaFin", type: "text", label: "Fecha de finalización", placeholder: "MM/AAAA o Actualidad" },
                { name: "descripcion", type: "textarea", label: "Descripción", placeholder: "Breve descripción de responsabilidades" },
            ],
        },
        {
            id: 3,
            sectionName: "Habilidades y Competencias",
            campos: [
                { name: "habilidad", type: "text", label: "Habilidad", placeholder: "Ej: Programación en JavaScript" },
                { name: "nivel", type: "select", options: ["Básico", "Intermedio", "Avanzado", "Experto"], label: "Nivel" },
            ],
        },
        {
            id: 4,
            sectionName: "Idiomas",
            campos: [
                { name: "idioma", type: "text", label: "Idioma", placeholder: "Ej: Inglés" },
                { name: "nivel", type: "select", options: ["Básico", "Intermedio", "Avanzado", "Nativo"], label: "Nivel" },
            ],
        },
        {
            id: 5,
            sectionName: "Premios y Reconocimientos",
            campos: [
                { name: "descripcion", type: "text", label: "Descripción", placeholder: "Ej: Premio Nacional de Innovación en Tecnología 2020" },
            ],
        },
        {
            id: 6,
            sectionName: "Aportaciones a la Mejora del PE",
            campos: [
                { name: "descripcion", type: "text", label: "Descripción", placeholder: "Ej: Desarrollo de un nuevo modelo de enseñanza híbrida" },
            ],
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
    
    return (
        <div className="flex h-screen">
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
                                <button className="mt-2 bg-neutral-200 px-4 py-2 rounded" onClick={() => addRow(section.id)}>Agregar</button>
                                <button className="mt-2 bg-primary1 text-white px-4 py-2 rounded" onClick={() => sendData(section.id)}>Enviar</button>
                            </div>
                        )
                )}
            </main>
        </div>
    );
};

export default CV;