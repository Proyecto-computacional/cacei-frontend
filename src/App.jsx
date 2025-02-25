import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPrincipal from "./pages/MainMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./login"
import caceiLogo from './assets/caceiLogo.png'

function App() {
  return (
    <Login />
  );
}

export default App;
