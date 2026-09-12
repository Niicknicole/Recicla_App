import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import "./DashboardColetador.css";

function DashboardColetador() {
  const [materiais, setMateriais] = useState([]);
  const navigate = useNavigate();

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const carregarMateriais = async () => {
      const usuarioAtual = auth.currentUser;

      if (!usuarioAtual) {
        return;
      }

      const referencia = ref(db, "materiais");
      const resultado = await get(referencia);

      if (resultado.exists()) {
        const dados = resultado.val();

        const lista = Object.entries(dados)
          .map(([id, material]) => ({
            id,
            ...material,
          }))
          .filter(
            (material) =>
              material.status === "disponivel"
          );

        setMateriais(lista);
      }
    };

    carregarMateriais();
  }, []);

  return (
    <main className="dashboard-coletador">
      <header className="dashboard-coletador-header">
        <h1>Recicla+</h1>

       <button onClick={() => navigate("/perfil")}>
  Meu perfil
</button>
      </header>

      <section className="dashboard-coletador-welcome">
        <h2>Área do Coletador</h2>

        <p>
          Encontre materiais disponíveis para coleta na comunidade.
        </p>
      </section>

      <section className="materiais-disponiveis">
        <h2>Materiais disponíveis</h2>

        {materiais.length === 0 ? (
          <p>
            No momento, não há materiais disponíveis para coleta.
          </p>
        ) : (
          <div className="materiais-coletador-lista">
            {materiais.map((material) => (
              <article
                className="material-coletador-card"
                key={material.id}
              >
                <h3>{material.material}</h3>

                <p>
                  <strong>Quantidade:</strong>{" "}
                  {material.quantidade}{" "}
{material.unidade === "saco-1l"
  ? "sacos de 1 L"
  : material.unidade === "saco-5l"
  ? "sacos de 5 L"
  : material.unidade === "caixas"
  ? "caixas"
  : "unidades"} 
                </p>

                <p>
                  <strong>Data:</strong> {material.data}
                </p>

                <p>
                  <strong>Horário:</strong> {material.horario}
                </p>

                {material.descricao && (
                  <p>
                    <strong>Descrição:</strong>{" "}
                    {material.descricao}
                  </p>
                )}

                <button
                 onClick={() => navigate(`/material/${material.id}`)}
                >
                   Ver detalhes
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardColetador;