import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import Login from "./pages/login";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainmenu" element={
          <ProtectedRoute>
            <MenuPrincipal />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
