import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import "./MeusMateriais.css";

function MeusMateriais() {
  const navigate = useNavigate();
  const [materiais, setMateriais] = useState([]);

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

  const formatarData = (data) => {
    if (!data) {
      return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const formatarStatus = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";

      case "em_coleta":
        return "Em coleta";

      case "finalizada":
        return "Coleta finalizada";

      default:
        return status;
    }
  };

  useEffect(() => {
    const carregarMateriais = async () => {
      try {
        const usuarioAtual = auth.currentUser;

        if (!usuarioAtual) {
          return;
        }

        const referencia = ref(db, "materiais");
        const resultado = await get(referencia);

        if (!resultado.exists()) {
          setMateriais([]);
          return;
        }

        const dados = resultado.val();

        const lista = Object.entries(dados)
          .map(([id, material]) => ({
            id,
            ...material,
          }))
          .filter(
            (material) =>
              material.usuarioId === usuarioAtual.uid
          );

        const listaComColetador = await Promise.all(
          lista.map(async (material) => {
            if (!material.coletadorId) {
              return material;
            }

            const referenciaColetador = ref(
              db,
              `usuarios/${material.coletadorId}`
            );

            const resultadoColetador = await get(
              referenciaColetador
            );

            if (resultadoColetador.exists()) {
              return {
                ...material,
                coletador: resultadoColetador.val(),
              };
            }

            return material;
          })
        );

        setMateriais(listaComColetador);
      } catch (error) {
        console.error(
          "Erro ao carregar materiais:",
          error
        );
      }
    };

    carregarMateriais();
  }, []);

  return (
    <main className="meus-materiais">
      <header className="meus-materiais-header">
        <h1>Meus materiais</h1>

        <p>
          Consulte os materiais que você disponibilizou
          para coleta.
        </p>
      </header>

      {materiais.length === 0 ? (
        <section className="sem-materiais">
          <h2>Nenhum material disponível</h2>

          <p>
            Você ainda não disponibilizou nenhum material
            para coleta.
          </p>
        </section>
      ) : (
        <section className="materiais-lista">
          {materiais.map((material) => (
            <article
              className="material-card"
              key={material.id}
            >
              <h2>Materiais da coleta</h2>

              <div className="materiais-coleta-lista">
                {material.materiais?.map(
                  (item, index) => (
                    <div
                      className="material-coleta-item"
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
                  )
                )}
              </div>

              <p>
                <strong>Data:</strong>{" "}
                {formatarData(material.data)}
              </p>

              <p>
                <strong>Horário:</strong>{" "}
                {material.horario}
              </p>

              {material.bairro && (
                <p>
                  <strong>Localização:</strong>{" "}
                  {material.bairro},{" "}
                  {material.cidade || "São Paulo"}
                </p>
              )}

              {material.descricao && (
                <p>
                  <strong>Descrição:</strong>{" "}
                  {material.descricao}
                </p>
              )}

              <p>
                <strong>Status:</strong>{" "}
                {formatarStatus(material.status)}
              </p>

              {material.coletador && (
                <p>
                  <strong>Coletador:</strong>{" "}
                  {material.coletador.nome}{" "}
                  {material.coletador.sobrenome}
                </p>
              )}

              {material.status === "em_coleta" &&
                material.coletadorId && (
                  <button
                    className="botao-conversa"
                    onClick={() =>
                      navigate(
                        `/conversa/${material.id}`
                      )
                    }
                  >
                    Conversar com coletador
                  </button>
                )}
            </article>
          ))}
        </section>
      )}

      <button
        className="pontos-voltar"
        onClick={() => navigate("/gerador")}
      >
        Voltar
      </button>
    </main>
  );
}

export default MeusMateriais;