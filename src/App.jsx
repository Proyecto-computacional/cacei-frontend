import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import Login from "./pages/login";
import PersonalConfig from "./pages/PersonalConfig";
import Dashboard from "./pages/Dashboard";
import Notification from "./pages/Notifications";
import UsersAdmin from "./pages/UsersAdmin";
import ReviewEvidence from "./pages/reviewEvidence";
import UploadEvidence from "./pages/uploadEvidence";
import EvidenceManagement from "./pages/evidenceManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import FrameOfReferenceView from "./pages/framesAdmin";
import EstructuraMarco from "./pages/frameStructure";
import EvidencesCompilation from "./pages/EvidencesCompilation";
import CVsOfProcess from "./pages/CVsOfProcess";
import { AuthProvider } from "./services/AuthContext";

function App() {
  return (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainmenu" element={
          <ProtectedRoute>
            <MenuPrincipal />
          </ProtectedRoute>
        } />
        <Route path="/ReviewEvidence" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR",
            "COORDINADOR DE CARRERA",
            "JEFE DE AREA", "DIRECTIVO"]}>
            <ReviewEvidence />
          </ProtectedRoute>
        } />
        <Route path="/PersonalConfig" element={
          <ProtectedRoute>
            <PersonalConfig />
          </ProtectedRoute>
        } />
        <Route path="/personalInfo/:rpe" element={
          <ProtectedRoute>
            <PersonalConfig />
          </ProtectedRoute>
        } />
        <Route path="/EvidencesCompilation" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR", "DIRECTIVO"]}>
            <EvidencesCompilation />
          </ProtectedRoute>
        } />
        <Route path="/dash/:processId" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        } />
        <Route path="/UsersAdmin" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
            <UsersAdmin />
          </ProtectedRoute>
        } />
        <Route path="/uploadEvidence" element={
          <ProtectedRoute>
            <UploadEvidence />
          </ProtectedRoute>
        } />
        <Route path="/uploadEvidence/:evidence_id" element={
          <ProtectedRoute>
            <UploadEvidence />
          </ProtectedRoute>
        } />
        <Route path="/evidenceManagement" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR",
            "COORDINADOR DE CARRERA",
            "JEFE DE AREA", "DIRECTIVO"]}>
            <EvidenceManagement />
          </ProtectedRoute>
        } />
        <Route path="/CVsOfProcess/:processId" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR",
            "COORDINADOR DE CARRERA",
            "JEFE DE AREA", "DIRECTIVO"]}>
            <CVsOfProcess />
          </ProtectedRoute>
        } />
        <Route path="/framesAdmin" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR", "CAPTURISTA"]}>
            <FrameOfReferenceView />
          </ProtectedRoute>
        } />
        <Route path="/framesStructure/:frameID" element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR", "CAPTURISTA"]}>
            <EstructuraMarco />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  </Router>
  );
}

export default App;
