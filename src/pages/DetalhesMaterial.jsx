import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../firebase";
import "./DetalhesMaterial.css";

function DetalhesMaterial() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { id } = useParams();

  const [material, setMaterial] = useState(null);

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

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        const referenciaMaterial = ref(db, `materiais/${id}`);
        const resultadoMaterial = await get(referenciaMaterial);

        if (!resultadoMaterial.exists()) {
          return;
        }

        const dadosMaterial = resultadoMaterial.val();

        setMaterial(dadosMaterial);
      } catch (error) {
        console.error(error);
      }
    };

    carregarDetalhes();
  }, [id]);

  const assumirColeta = async () => {
    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      alert("Você precisa estar logado para realizar esta ação.");
      navigate("/login");
      return;
    }

    if (material.usuarioId === usuarioAtual.uid) {
      alert(
        "Você não pode coletar uma coleta que você mesmo disponibilizou."
      );
      return;
    }

    if (material.status !== "disponivel") {
      alert("Esta coleta não está mais disponível.");
      return;
    }

    try {
      const referencia = ref(db, `materiais/${id}`);

      await update(referencia, {
        status: "em_coleta",
        coletadorId: usuarioAtual.uid,
      });

      setMaterial((materialAtual) => ({
        ...materialAtual,
        status: "em_coleta",
        coletadorId: usuarioAtual.uid,
      }));

      alert("Coleta assumida com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível assumir esta coleta.");
    }
  };

  const entrarEmContato = () => {
    navigate(`/conversa/${id}`);
  };

  if (!material) {
    return (
      <main className="detalhes-material">
        <section className="detalhes-card carregando">
          <h1>Detalhes da coleta</h1>
          <p>Carregando...</p>
        </section>
      </main>
    );
  }

  const coletaAssumida = material.status === "em_coleta";

  return (
    <main className="detalhes-material">
      <section className="detalhes-card">
        <header className="detalhes-header">
          <h1>Detalhes da coleta</h1>

          <p>
            Confira os materiais e as informações antes de assumir
            esta coleta.
          </p>
        </header>

        <section className="detalhes-secao">
          <h2>Materiais</h2>

          <div className="detalhes-materiais">
            {material.materiais?.map((item, index) => (
              <div
                className="detalhes-material-item"
                key={index}
              >
                <div>
                  <strong>
                    {nomesMateriais[item.material] ||
                      item.material}
                  </strong>

                  <span>
                    {item.quantidade}{" "}
                    {formatarUnidade(item.unidade)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="detalhes-secao">
          <h2>Disponibilidade</h2>

          <p>
            <strong>Data:</strong>{" "}
            {formatarData(material.data)}
          </p>

          <p>
            <strong>Horário:</strong> {material.horario}
          </p>
        </section>

        {material.descricao && (
          <section className="detalhes-secao">
            <h2>Descrição</h2>

            <p className="descricao">
              {material.descricao}
            </p>
          </section>
        )}

        <section className="detalhes-secao">
          <h2>Localização aproximada</h2>

          <div className="localizacao-box">
            <strong>
              {material.bairro || "Bairro não informado"}
            </strong>

            <span>
              {material.cidade || "São Paulo"} - SP
            </span>
          </div>

          <p className="aviso-localizacao">
            O endereço exato não é exibido nesta etapa. A
            localização aproximada será usada para indicar a
            região da coleta.
          </p>
        </section>

        <div className="detalhes-acoes">
          {!coletaAssumida ? (
            <button
              className="botao-assumir"
              onClick={assumirColeta}
              disabled={material.status !== "disponivel"}
            >
              {material.status === "disponivel"
                ? "Tenho interesse em coletar"
                : "Coleta não disponível"}
            </button>
          ) : (
            <button
              className="botao-assumir"
              onClick={entrarEmContato}
            >
              Entrar em contato com o gerador
            </button>
          )}

          <button
            className="botao-voltar"
            onClick={() => navigate("/coletador")}
          >
            Voltar
          </button>
        </div>
      </section>
    </main>
  );
}

export default DetalhesMaterial;