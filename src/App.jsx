import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import PersonalInfo from "./pages/PersonalConfig";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/adminUsers";
import Login from "./pages/login";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = 'user'; // Esto lo obtendrás del backend o un estado global más adelante

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Simulamos el rol por ahora. Luego lo obtendrás del usuario autenticado
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainmenu" element={<MenuPrincipal />} />
        <Route path="/personalInfo" element={<PersonalInfo />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/adminUsers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
