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
  
    const handleFinalSubmit = () => {
      console.log("Enviando datos finales:", data);
      
    };
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Curriculum Vitae</h1>
        {secciones.map((seccion) => (
          <Section key={seccion.id} sectionName={seccion.sectionName} id={seccion.id} fields={seccion.campos} previousData={registros} data={data[seccion.id]} setData={setData} />
        ))}
        <button onClick={handleFinalSubmit} className="bg-green-500 text-white px-6 py-2 mt-4">
          Enviar Todo
        </button>
      </div>
    );
}

export default CV;