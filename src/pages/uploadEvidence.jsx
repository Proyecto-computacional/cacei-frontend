import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AppHeader, AppFooter, SubHeading } from "../common";
import FeedbackModal from "../components/Feedback";
import CriteriaGuide from "../components/CriteriaGuide";
import '../app.css';
import api from "../services/api";
import { FileQuestion, Sheet, FileText, FolderArchive, X } from "lucide-react";
import EditorCacei from "../components/EditorCacei";


const UploadEvidence = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [justification, setJustification] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const refInputFiles = useRef(null);
  const {evidence_id} = useParams();
  const [user, setUser] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get('/api/user');
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchUser();
}, []);


useEffect(() => {
  api.get(`api/evidences/${evidence_id}`).then(
    (response) => {
      setEvidence(response.data);
      setUploadedFiles(response.data.files);
      setJustification(response.data.files[0]?.justification || "");

      //Evaluar el estado de la evidencia
      if (response.data.status && response.data.status.length > 0) {
        const lastStatus = response.data.status[0];

        if (lastStatus.status_description !== "NO APROBADA") {
          setIsLocked(true); 
        } else {
          setIsLocked(false); 
        }
      }
    }).catch(error => {
      if(error.response && error.response.status === 401){
        navigate("/mainmenu");
      }
    }
  );
}, [evidence_id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const assignmentsResponse = await api.get('/api/my-assignments');
        setAsignaciones(assignmentsResponse.data);
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/mainmenu");
        }
      }
    }
    fetchData();
  }, []);
  

  const handleFileChange = (event) => {
    const allowedExtensions = ['rar', 'zip', 'xls', 'xlsx', 'csv', 'pdf'];
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    const selectedFiles = Array.from(event.target.files);

    const validFiles = [];

    selectedFiles.forEach((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      const sizeOk = file.size <= maxFileSize;
      const typeOk = allowedExtensions.includes(ext);
  
      if (sizeOk && typeOk) {
        validFiles.push(file);
      } else {
        alert(`Archivo rechazado: ${file.name}`);
      }
    });
  
    if (validFiles.length > 0) {
      setFiles((prevFiles) => {
        const existingNames = new Set(prevFiles.map(f => f.name));
        const uniqueNewFiles = validFiles.filter(f => !existingNames.has(f.name));
        return [...prevFiles, ...uniqueNewFiles];
      });
    }

    refInputFiles.current.value = "";
  };

  const handleUpload = async () => {
    
    if (!files) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files[]", file); // Laravel reconoce arreglos con []
    });
  
    formData.append("evidence_id", 1); // Reemplaza con el ID correcto
    formData.append("justification", justification);

  
    try {
      const response = await api.post("/api/file", 
        formData, { //Ajusta la URL
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`, // autenticación
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Archivo subido con éxito:", response.data);
      alert("Archivo subido con éxito");
    } catch (error) {
      console.error("Error al subir archivo", error);
      alert("Error al subir archivo");
    }
  }; 
  const handleDeleteUploadedFile = async (fileId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este archivo?")) return;
  
    try {
      await api.delete(`/api/file/${fileId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("Archivo eliminado correctamente.");
      setUploadedFiles((prev) => prev.filter((f) => f.file_id !== fileId));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar archivo.");
    }
  };
  
  const handleRemoveFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const [showFeedback, setShowFeedback] = useState(false);
  const [showCriteriaGuide, setShowCriteriaGuide] = useState(false);



  const getEstadoClass = (estado) => {
    switch (estado) {
      case "NO CARGADA":
        return "bg-neutral-500 text-neutral-50";
      case "PENDIENTE":
        return "bg-yellow-400 text-white";
      case "NO APROBADA":
        return "bg-red-500 text-white";
      case "APROBADA":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const getIcon = (name) => {
    const extension = name.split('.').pop();

    if (['rar', 'zip', '7z'].includes(extension)) return <FolderArchive />;
    if (extension === 'pdf') return <FileText />;
    if (['csv', 'xls', 'xlsx'].includes(extension)) return <Sheet />;
  
  };

  const canViewPage = () => {
    if (!user || !evidence) return false;
  
    const allowedRoles = ["ADMINISTRADOR", "DIRECTIVO"];
    if (allowedRoles.includes(user.user_role)) return true;
  
    if (user.user_rpe === evidence.user_rpe) return true; // responsable de la evidencia
    if (user.user_rpe === evidence.process.career.user_rpe) return true; // coordinador de carrera
    if (user.user_rpe === evidence.process.career.area.user_rpe) return true; // jefe de área
  
    return false;
  };

  if (user && !canViewPage()) {
    return <div className="text-center mt-20 text-3xl font-bold">No tienes permiso para ver esta evidencia.</div>;
  }

  if (!evidence) {
    return <p>Cargando...</p>;
  }
  
  return (
    <>
      <AppHeader />
      <SubHeading />
      <div className="h-fit p-10 flex justify-around items-stretch relative" style={{ background: "linear-gradient(180deg, #e1e5eb 0%, #FFF 50%)" }}>
        <div className="bg-cyan-300 w-2/10">
        <p className="w-full text-center text-3xl bg-cyan-500 text-amber-50 py-2">Mis asignaciones</p>
          <div>
          {asignaciones.map((item, index) => (
            <Link 
              key={index} 
              to={`/UploadEvidence/${item.evidence_id}`}
              className="flex justify-around text-[20px] items-center p-2 cursor-pointer hover:bg-cyan-500"
            >
              <p className="w-1/2">{item.criterio}</p>
              <p className={`w-1/2 font-semibold px-3 text-center rounded-lg ${getEstadoClass(item.estado)}`}>
                {item.estado}
              </p>
            </Link>
          ))}
        </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-wrap flex-row w-7/10 min-h-[500px]">
          <div className="flex flex-col flex-1 mr-10 w-1/2">
            <h1 className="text-[40px] font-semibold text-black font-['Open_Sans'] mt-2 self-start">
            Subir Evidencia
            </h1>
            <h2 className="text-[25px] font-light text-black font-['Open_Sans'] mb-4 self-start">
            Proceso: {evidence.process.process_name}
            </h2>
            <h2 className="text-[25px] font-light text-black font-['Open_Sans'] mb-4 self-start">
              
            {evidence.standard.section.category.category_name}/
            {evidence.standard.section.section_name}/
            {evidence.standard.standard_name}
            </h2>
            <p className="text-black text-lg font-semibold">Justificación</p>
            <EditorCacei setJustification={setJustification} value={justification} readOnly={user?.user_rpe !== evidence.user_rpe || isLocked}/>
              {user?.user_rpe === evidence.user_rpe && (
              <div className="mt-4 flex">
              <label className="w-9/10 p-2 border rounded bg-gray-100 text-gray-600 cursor-pointer flex justify-center items-center">
                  Ingresa el archivo aquí
                  <input
                  type="file"
                  className="hidden"
                  multiple 
                  onChange={handleFileChange}
                  ref={refInputFiles}
                  disabled={isLocked} 
                  />
              </label>
              <div className="w-1/10"><FileQuestion size={50} onClick={() => {setShowCriteriaGuide(true)}}/></div>
              </div>
              )}
            {files && files.map((file) => (
                <div className="mt-4 flex items-center justify-between gap-2 p-2 border rounded bg-gray-100 text-gray-600">
                  <span className="text-2xl">{getIcon(file.name)}</span>
                  <p className="font-semibold text-left flex-grow">{file.name}</p>
                  <X className="cursor-pointer" onClick={() => {handleRemoveFile(file.name)}}/>
                </div>
              ))}
              {uploadedFiles && uploadedFiles.map((file) => (
                <div className="mt-4 flex items-center justify-between gap-2 p-2 border rounded bg-gray-100 text-gray-600">
                  <span className="text-2xl">{getIcon(file.file_name)}</span>
                  <p className="font-semibold text-left flex-grow">{file.file_name}</p>
                  <p className="font-semibold text-left flex-grow">{file.upload_date}</p>
                  {!isLocked && (<X className="cursor-pointer" onClick={() => {handleRemoveFile(file.name)}}/>)}
                </div>
              ))}
              {user?.user_rpe === evidence.user_rpe && (
                  <button className="bg-[#004A98] text-white px-20 py-2 mt-5 mx-auto rounded-full" onClick={handleUpload}  disabled={isLocked}>Guardar</button>
              )}
          </div>
          <div className="w-1/2">
          <h1 className="text-[40px] font-semibold text-black font-['Open_Sans'] mt-2 self-start">
            Revisión
            </h1>
            {evidence.status.map((item, index) => (
              <div key={index}>
                <div className="flex">
                  <p className="text-black text-lg font-semibold">Revisor:</p>
                  <p className="text-black text-lg ml-1">{item.user.user_name}</p>
                </div>
                <p className="text-black text-lg font-semibold">Estado</p>
                <p className={`w-1/2 font-semibold px-3 text-center rounded-lg ${getEstadoClass(item.status_description)}`}>
                  {item.status_description}
                </p>
                <p className="text-black text-lg font-semibold">Retroalimentación</p>
                <p className="w-full p-2 border rounded mt-2 text-gray-600 bg-gray-100 min-h-[150px]">{item.feedback}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
      <AppFooter />
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showCriteriaGuide && <CriteriaGuide onClose={() => setShowCriteriaGuide(false)} />}
    </>
  );
};

export default UploadEvidence;