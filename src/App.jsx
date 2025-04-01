import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import Login from "./pages/login";
import PersonalConfig from "./pages/PersonalConfig";
import Dashboard from "./pages/Dashboard";
import Notification from "./pages/Notifications";
import UsersAdmin from "./pages/UsersAdmin";
import ReviewEvidence from "./pages/reviewEvidence";
import UploadEvidence from "./pages/uploadEvidence";
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
        <Route path="/ReviewEvidence" element={
          <ProtectedRoute>
            <ReviewEvidence />
          </ProtectedRoute>
        } />
        <Route path="/PersonalConfig" element={<PersonalConfig />} />
        <Route path="/dash/:processId" element={<Dashboard />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/UsersAdmin" element={
          <ProtectedRoute allowedRoles={["PROFESOR"]}>
            <UsersAdmin />
          </ProtectedRoute>
        } />
        <Route path="/personalInfo" element={<PersonalConfig />} />
        <Route path="/uploadEvidence" element={<UploadEvidence />} />
      </Routes>
    </Router>
  );
}

export default App;
