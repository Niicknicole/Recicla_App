import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  update,
} from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import "./DashboardColetador.css";

function DashboardColetador() {
  const [materiais, setMateriais] = useState([]);
  const [minhasColetas, setMinhasColetas] = useState([]);
  const [historico, setHistorico] = useState([]);

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

  const carregarMateriais = async () => {
    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      return;
    }

    try {
      const referencia = ref(db, "materiais");
      const resultado = await get(referencia);

      if (!resultado.exists()) {
        setMateriais([]);
        setMinhasColetas([]);
        setHistorico([]);
        return;
      }
      const finalizarColeta = async (id) => {
  const confirmar = window.confirm(
    "Deseja finalizar esta coleta?"
  );

  if (!confirmar) {
    return;
  }

  try {
    const referencia = ref(
      db,
      `materiais/${id}`
    );

    await update(referencia, {
      status: "finalizada",
    });

    await carregarMateriais();
  } catch (error) {
    console.error(
      "Erro ao finalizar coleta:",
      error
    );

    alert(
      "Não foi possível finalizar a coleta."
    );
  }
};

      const dados = resultado.val();

      const lista = Object.entries(dados).map(
        ([id, material]) => ({
          id,
          ...material,
        })
      );

      // Coletas disponíveis para qualquer coletador
      const coletasDisponiveis = lista.filter(
        (material) =>
          material.status === "disponivel"
      );

      // Coletas que este coletador assumiu
      const coletasEmAndamento = lista.filter(
        (material) =>
          material.status === "em_coleta" &&
          material.coletadorId === usuarioAtual.uid
      );

      // IDs que o usuário escolheu esconder do histórico
      const referenciaHistoricoOculto = ref(
        db,
        `usuarios/${usuarioAtual.uid}/historicoOculto`
      );

      const resultadoHistoricoOculto = await get(
        referenciaHistoricoOculto
      );

      const historicoOculto =
        resultadoHistoricoOculto.exists()
          ? resultadoHistoricoOculto.val()
          : {};

      // Coletas finalizadas pelo coletador
      const coletasFinalizadas = lista.filter(
        (material) =>
          material.status === "finalizada" &&
          material.coletadorId === usuarioAtual.uid &&
          !historicoOculto[material.id]
      );

      setMateriais(coletasDisponiveis);
      setMinhasColetas(coletasEmAndamento);
      setHistorico(coletasFinalizadas);
    } catch (error) {
      console.error(
        "Erro ao carregar materiais:",
        error
      );
    }
  };

  useEffect(() => {
    carregarMateriais();
  }, []);

  const excluirDoHistorico = async (id) => {
    const confirmar = window.confirm(
      "Deseja excluir esta coleta do seu histórico?"
    );

    if (!confirmar) {
      return;
    }

    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      return;
    }

    try {
      const referencia = ref(
        db,
        `usuarios/${usuarioAtual.uid}/historicoOculto/${id}`
      );

      await update(referencia, {
        oculto: true,
      });

      setHistorico((listaAtual) =>
        listaAtual.filter(
          (coleta) => coleta.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir do histórico:",
        error
      );

      alert(
        "Não foi possível excluir a coleta do histórico."
      );
    }
  };

  const renderMateriais = (coleta) => (
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
  );

  const renderInformacoes = (coleta) => (
    <>
      {coleta.bairro && (
        <p>
          <strong>Localização aproximada:</strong>{" "}
          {coleta.bairro},{" "}
          {coleta.cidade || "São Paulo"}
        </p>
      )}

      <p>
        <strong>Data:</strong>{" "}
        {formatarData(coleta.data)}
      </p>

      <p>
        <strong>Horário:</strong>{" "}
        {coleta.horario}
      </p>

      {coleta.descricao && (
        <p>
          <strong>Descrição:</strong>{" "}
          {coleta.descricao}
        </p>
      )}
    </>
  );

  return (
    <main className="dashboard-coletador">
      <header className="dashboard-coletador-header">
        <h1>Recicla+</h1>

        <button
          onClick={() => navigate("/perfil")}
        >
          Meu perfil
        </button>
      </header>

      <section className="dashboard-coletador-welcome">
        <h2>Área do Coletador</h2>

        <p>
          Encontre materiais disponíveis para coleta
          na comunidade.
        </p>
      </section>
      {/* COLETAS DISPONÍVEIS */}
      <section className="materiais-disponiveis">
        <h2>Coletas disponíveis</h2>

        {materiais.length === 0 ? (
          <p>
            No momento, não há materiais disponíveis
            para coleta.
          </p>
        ) : (
          <div className="materiais-coletador-lista">
            {materiais.map((coleta) => (
              <article
                className="material-coletador-card"
                key={coleta.id}
              >
                <h3>Materiais disponíveis</h3>

                {renderMateriais(coleta)}

                {renderInformacoes(coleta)}

                <button
                  onClick={() =>
                    navigate(
                      `/material/${coleta.id}`
                    )
                  }
                >
                  Ver detalhes
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* MINHAS COLETAS */}
      <section className="materiais-disponiveis">
        <h2>Minhas coletas</h2>

        {minhasColetas.length === 0 ? (
          <p>
            Você ainda não assumiu nenhuma coleta.
          </p>
        ) : (
          <div className="materiais-coletador-lista">
            {minhasColetas.map((coleta) => (
              <article
                className="material-coletador-card"
                key={coleta.id}
              >
                <h3>Coleta em andamento</h3>

                {renderMateriais(coleta)}

                {renderInformacoes(coleta)}

                <p>
                  <strong>Status:</strong>{" "}
                  Em coleta
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/conversa/${coleta.id}`
                    )
                  }
                >
                  Abrir conversa
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* HISTÓRICO */}
      <section className="materiais-disponiveis">
        <h2>Histórico de coletas</h2>

        {historico.length === 0 ? (
          <p>
            Você não possui coletas finalizadas no
            histórico.
          </p>
        ) : (
          <div className="materiais-coletador-lista">
            {historico.map((coleta) => (
              <article
                className="material-coletador-card"
                key={coleta.id}
              >
                <h3>Coleta finalizada</h3>

                {renderMateriais(coleta)}

                {renderInformacoes(coleta)}

                <p>
                  <strong>Status:</strong>{" "}
                  Coleta finalizada
                </p>

                <button
                  className="botao-excluir-historico"
                  onClick={() =>
                    excluirDoHistorico(coleta.id)
                  }
                >
                  Excluir do histórico
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