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
        <Route path="/evidenceManagement" element={<EvidenceManagement />} />
        <Route path="/framesAdmin" element={<FrameOfReferenceView/>}/>
        <Route path="/framesStructure/:frameID" element={<EstructuraMarco/>}/>
      </Routes>
    </Router>
  );
}

export default App;
