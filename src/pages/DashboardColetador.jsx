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

  const nomesMateriais = {
    papelao: "Papelão",
    plastico: "Plástico",
    latas: "Latas",
    "garrafas-pet": "Garrafas PET",
    vidro: "Vidro",
    eletronicos: "Eletrônicos",
    outros: "Outros",
  };

  const formatarUnidade = (unidade) => {
    switch (unidade) {
      case "saco-1L":
      case "saco-1l":
        return "sacos de 1 L";

      case "saco-5L":
      case "saco-5l":
        return "sacos de 5 L";

      case "caixas":
        return "caixas";

      case "unidades":
        return "unidades";

      default:
        return unidade;
    }
  };

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
            (material) => material.status === "disponivel"
          );

        setMateriais(lista);
      } else {
        setMateriais([]);
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
        <h2>Coletas disponíveis</h2>

        {materiais.length === 0 ? (
          <p>
            No momento, não há materiais disponíveis para coleta.
          </p>
        ) : (
          <div className="materiais-coletador-lista">
            {materiais.map((coleta) => (
              <article
                className="material-coletador-card"
                key={coleta.id}
              >
                <h3>Materiais disponíveis</h3>

                <div className="lista-materiais-card">
                  {coleta.materiais?.map((item, index) => (
                    <div
                      className="item-material-card"
                      key={index}
                    >
                      <strong>
                        {nomesMateriais[item.material] ||
                          item.material}
                      </strong>

                      <span>
                        {item.quantidade}{" "}
                        {formatarUnidade(item.unidade)}
                      </span>
                    </div>
                  ))}
                </div>

                {coleta.bairro && (
                  <p>
                    <strong>Localização aproximada:</strong>{" "}
                    {coleta.bairro}, {coleta.cidade || "São Paulo"}
                  </p>
                )}

                <p>
                  <strong>Data:</strong> {coleta.data}
                </p>

                <p>
                  <strong>Horário:</strong> {coleta.horario}
                </p>

                {coleta.descricao && (
                  <p>
                    <strong>Descrição:</strong>{" "}
                    {coleta.descricao}
                  </p>
                )}

                <button
                  onClick={() =>
                    navigate(`/material/${coleta.id}`)
                  }
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