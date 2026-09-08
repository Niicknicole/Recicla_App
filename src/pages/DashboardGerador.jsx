import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import "./DashboardGerador.css";

function DashboardGerador() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioAtual = auth.currentUser;

      if (!usuarioAtual) {
        return;
      }

      const referenciaUsuario = ref(
        db,
        `usuarios/${usuarioAtual.uid}`
      );

      const resultadoUsuario = await get(referenciaUsuario);

      if (resultadoUsuario.exists()) {
        setUsuario(resultadoUsuario.val());
      }
    };

    carregarUsuario();
  }, []);

  return (
    <main className="dashboard-gerador">
      <header className="dashboard-header">
        <h1>Recicla+</h1>

        <button>
          Meu perfil
        </button>
      </header>

      <section className="dashboard-welcome">
        <h2>
          Olá, {usuario ? usuario.nome : "usuário"}!
        </h2>

        <p>
          O que você deseja fazer hoje?
        </p>
      </section>

      <section className="dashboard-options">
        <div className="dashboard-card">
          <h3>Disponibilizar material</h3>

          <p>
            Informe quais materiais recicláveis você deseja
            disponibilizar para coleta.
          </p>

          <button
            onClick={() => navigate("/disponibilizar")}
          >
            Disponibilizar
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Meus materiais</h3>

          <p>
            Consulte os materiais que você já disponibilizou.
          </p>

          <button
            onClick={() => navigate("/meus-materiais")}
          >
            Ver materiais
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Pontos de coleta</h3>

          <p>
            Encontre pontos de coleta disponíveis na sua região.
          </p>

          <button>
            Ver pontos
          </button>
        </div>
      </section>
    </main>
  );
}

export default DashboardGerador;