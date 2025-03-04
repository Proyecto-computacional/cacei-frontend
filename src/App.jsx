import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import PersonalInfo from "./pages/PersonalConfig";
import Notifications from "./pages/Notifications";
import Login from "./pages/login";
import UsersAdmin from "./pages/UsersAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainmenu" element={<MenuPrincipal />} />
        <Route path="/personalInfo" element={<PersonalInfo />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/usersAdmin" element={<UsersAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
