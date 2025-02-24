import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/mensaje")
      .then((response) => {
        setMensaje(response.data.mensaje);
      })
      .catch((error) => {
        console.error("Error al obtener los datos", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route 
          path="/mensaje" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white text-3xl">
              {mensaje || "Cargando..."}
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
