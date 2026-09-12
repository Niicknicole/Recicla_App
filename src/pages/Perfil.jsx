import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [coletasEmAndamento, setColetasEmAndamento] = useState([]);
  const [coletasFinalizadas, setColetasFinalizadas] = useState([]);

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const carregarDados = async () => {
      const usuarioAtual = auth.currentUser;

      if (!usuarioAtual) {
        navigate("/login");
        return;
      }

      // Carrega os dados do usuário
      const referenciaUsuario = ref(
        db,
        `usuarios/${usuarioAtual.uid}`
      );

      const resultadoUsuario = await get(referenciaUsuario);

      if (!resultadoUsuario.exists()) {
        return;
      }

      const dadosUsuario = resultadoUsuario.val();
      setUsuario(dadosUsuario);

      // Se for coletador, carrega suas coletas
      if (dadosUsuario.perfil === "coletador") {
        const referenciaMateriais = ref(db, "materiais");
        const resultadoMateriais = await get(referenciaMateriais);

        if (resultadoMateriais.exists()) {
          const dadosMateriais = resultadoMateriais.val();

          const lista = Object.entries(dadosMateriais)
            .map(([id, material]) => ({
              id,
              ...material,
            }))
            .filter(
              (material) =>
                material.coletadorId === usuarioAtual.uid
            );

          setColetasEmAndamento(
            lista.filter(
              (material) => material.status === "em_coleta"
            )
          );

          setColetasFinalizadas(
            lista.filter(
              (material) => material.status === "finalizada"
            )
          );
        }
      }
    };

    carregarDados();
  }, []);

  const finalizarColeta = async (id) => {
    try {
      await update(ref(db, `materiais/${id}`), {
        status: "finalizada",
      });

      // Atualiza a tela sem precisar recarregar
      setColetasEmAndamento((coletas) =>
        coletas.filter((material) => material.id !== id)
      );

      const coletaFinalizada = coletasEmAndamento.find(
        (material) => material.id === id
      );

      if (coletaFinalizada) {
        setColetasFinalizadas((coletas) => [
          ...coletas,
          {
            ...coletaFinalizada,
            status: "finalizada",
          },
        ]);
      }

      alert("Coleta finalizada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível finalizar a coleta.");
    }
  };

  const sair = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Não foi possível sair da conta.");
    }
  };

  if (!usuario) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <main className="perfil">
      <h1>Meu perfil</h1>

      <section className="perfil-section">
        <h2>Dados pessoais</h2>

        <p>
          <strong>Nome:</strong> {usuario.nome}{" "}
          {usuario.sobrenome}
        </p>

        <p>
          <strong>E-mail:</strong> {usuario.email}
        </p>

        <p>
          <strong>Idade:</strong> {usuario.idade}
        </p>
      </section>

      <section className="perfil-section">
        <h2>Endereço</h2>

        <p>
          <strong>CEP:</strong> {usuario.cep}
        </p>

        <p>
          <strong>Rua:</strong> {usuario.rua}
        </p>

        <p>
          <strong>Número:</strong> {usuario.numero}
        </p>
      </section>

      <section className="perfil-section">
        <h2>Perfil no Recicla+</h2>

        <p>
          <strong>Tipo de usuário:</strong>{" "}
          {usuario.perfil === "gerador"
            ? "Gerador de materiais"
            : "Coletador"}
        </p>
      </section>

      {usuario.perfil === "coletador" && (
        <>
          <section className="perfil-section">
            <h2>Minhas coletas em andamento</h2>

            {coletasEmAndamento.length === 0 ? (
              <p>
                Você não possui coletas em andamento.
              </p>
            ) : (
              coletasEmAndamento.map((material) => (
                <article
                  className="coleta-card"
                  key={material.id}
                >
                  <h3>{material.material}</h3>

                  <p>
                    <strong>Quantidade:</strong>{" "}
                    {material.quantidade}{" "}
                    {material.unidade === "unidades"
                      ? "unidades"
                      : material.unidade === "caixas"
                      ? "caixas"
                      : material.unidade === "saco-1l"
                      ? "sacos de 1 L"
                      : material.unidade === "saco-5l"
                      ? "sacos de 5 L"
                      : material.unidade}
                  </p>

                  <p>
                    <strong>Data:</strong>{" "}
                    {material.data}
                  </p>

                  <p>
                    <strong>Horário:</strong>{" "}
                    {material.horario}
                  </p>

                  <button
                    onClick={() =>
                      finalizarColeta(material.id)
                    }
                  >
                    Finalizar coleta
                  </button>
                </article>
              ))
            )}
          </section>

          <section className="perfil-section">
            <h2>Minhas coletas finalizadas</h2>

            {coletasFinalizadas.length === 0 ? (
              <p>
                Você ainda não possui coletas finalizadas.
              </p>
            ) : (
              coletasFinalizadas.map((material) => (
                <article
                  className="coleta-card"
                  key={material.id}
                >
                  <h3>{material.material}</h3>

                  <p>
                    <strong>Quantidade:</strong>{" "}
                    {material.quantidade}{" "}
                    {material.unidade === "unidades"
                      ? "unidades"
                      : material.unidade === "caixas"
                      ? "caixas"
                      : material.unidade === "saco-1l"
                      ? "sacos de 1 L"
                      : material.unidade === "saco-10l"
                      ? "sacos de 10 L"
                      : material.unidade}
                  </p>

                  <p>
                    <strong>Data:</strong>{" "}
                    {material.data}
                  </p>

                  <p>
                    <strong>Horário:</strong>{" "}
                    {material.horario}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    Coleta finalizada
                  </p>
                </article>
              ))
            )}
          </section>
        </>
      )}

      <button
        className="perfil-voltar"
        onClick={() =>
          navigate(
            usuario.perfil === "gerador"
              ? "/gerador"
              : "/coletador"
          )
        }
      >
        Voltar
      </button>

      <button onClick={sair}>
        Sair da conta
      </button>
    </main>
  );
}

export default Perfil;