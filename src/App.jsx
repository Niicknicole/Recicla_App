import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Senha from "./pages/Senha";
import DashboardGerador from "./pages/DashboardGerador";
import DashboardColetador from "./pages/DashboardColetador";
import DisponibilizarMaterial from "./pages/DisponibilizarMaterial";
import MeusMateriais from "./pages/MeusMateriais";
import DetalhesMaterial from "./pages/DetalhesMaterial";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/senha" element={<Senha />} />
      <Route path="/gerador" element={<DashboardGerador />} />
      <Route path="/coletador" element={<DashboardColetador />} /> 
      <Route
      path="/disponibilizar"
      element={<DisponibilizarMaterial />}
      />
      <Route
      path="/meus-materiais"
      element={<MeusMateriais />}
      />
      <Route
       path="/material/:id"
       element={<DetalhesMaterial />}
       />
    </Routes>
  );
}

export default App;