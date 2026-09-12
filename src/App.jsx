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
import Perfil from "./pages/Perfil";
import PontosColeta from "./pages/PontosColeta";
import RotaProtegida from "./components/RotaProtegida";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/senha" element={<Senha />} />
<Route
  path="/pontos-coleta"
  element={
    <RotaProtegida>
      <PontosColeta />
    </RotaProtegida>
  }
/>
      <Route
        path="/gerador"
        element={
          <RotaProtegida>
            <DashboardGerador />
          </RotaProtegida>
        }
      />

      <Route
        path="/coletador"
        element={
          <RotaProtegida>
            <DashboardColetador />
          </RotaProtegida>
        }
      />

      <Route
        path="/disponibilizar"
        element={
          <RotaProtegida>
            <DisponibilizarMaterial />
          </RotaProtegida>
        }
      />

      <Route
        path="/meus-materiais"
        element={
          <RotaProtegida>
            <MeusMateriais />
          </RotaProtegida>
        }
      />

      <Route
        path="/material/:id"
        element={
          <RotaProtegida>
            <DetalhesMaterial />
          </RotaProtegida>
        }
      />

      <Route
        path="/perfil"
        element={
          <RotaProtegida>
            <Perfil />
          </RotaProtegida>
        }
      />
    </Routes>
    
  );
}

export default App;