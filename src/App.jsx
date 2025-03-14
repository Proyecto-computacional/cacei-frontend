import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import Login from "./pages/login";
import PersonalConfig from "./pages/PersonalConfig";
import Dashboard from "./pages/Dashboard";
import Notification from "./pages/Notifications";
import UsersAdmin from "./pages/UsersAdmin";
import PersonalConfig from "./pages/PersonalConfig";

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
        <Route path="/PersonalConfig" element={<PersonalConfig />}/>
        <Route path="/dash/:processId" element={<Dashboard />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/UsersAdmin" element={<UsersAdmin />} />
        <Route path="/personalInfo" element={<PersonalConfig />} />
      </Routes>
    </Router>
  );
}

export default App;
