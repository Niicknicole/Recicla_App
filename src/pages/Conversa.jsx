import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  onValue,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import app from "../firebase";
import "./Conversa.css";

function Conversa() {
  const navigate = useNavigate();
  const { id } = useParams();

  const auth = getAuth(app);
  const db = getDatabase(app);

  const [coleta, setColeta] = useState(null);
  const [conversaId, setConversaId] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarConversa = async () => {
      try {
        const usuarioAtual = auth.currentUser;

        if (!usuarioAtual) {
          navigate("/login");
          return;
        }

        // Busca a coleta
        const referenciaColeta = ref(db, `materiais/${id}`);
        const resultadoColeta = await get(referenciaColeta);

        if (!resultadoColeta.exists()) {
          alert("Coleta não encontrada.");
          navigate("/coletador");
          return;
        }

        const dadosColeta = resultadoColeta.val();
        setColeta(dadosColeta);

        // A coleta precisa estar assumida
        if (
          dadosColeta.status !== "em_coleta" ||
          !dadosColeta.coletadorId
        ) {
          alert("Esta coleta ainda não possui uma conversa.");
          navigate(`/material/${id}`);
          return;
        }

        // Verifica se o usuário participa da coleta
        const ehGerador =
          dadosColeta.usuarioId === usuarioAtual.uid;

        const ehColetador =
          dadosColeta.coletadorId === usuarioAtual.uid;

        if (!ehGerador && !ehColetador) {
          alert("Você não participa desta coleta.");
          navigate("/coletador");
          return;
        }

        // O ID da conversa será o mesmo ID da coleta
        const referenciaConversa = ref(
          db,
          `conversas/${id}`
        );

        const resultadoConversa = await get(
          referenciaConversa
        );

        // Se a conversa ainda não existe, cria
        if (!resultadoConversa.exists()) {
          await set(referenciaConversa, {
            coletaId: id,
            geradorId: dadosColeta.usuarioId,
            coletadorId: dadosColeta.coletadorId,
            criadaEm: Date.now(),
          });
        }

        setConversaId(id);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar conversa:", error);
        alert("Não foi possível carregar a conversa.");
      }
    };

    carregarConversa();
  }, [id, navigate]);

  useEffect(() => {
    if (!conversaId) {
      return;
    }

    const referenciaMensagens = ref(
      db,
      `conversas/${conversaId}/mensagens`
    );

    const cancelarListener = onValue(
      referenciaMensagens,
      (snapshot) => {
        if (!snapshot.exists()) {
          setMensagens([]);
          return;
        }

        const dados = snapshot.val();

        const listaMensagens = Object.entries(dados)
          .map(([chave, mensagem]) => ({
            id: chave,
            ...mensagem,
          }))
          .sort(
            (a, b) =>
              (a.enviadaEm || 0) -
              (b.enviadaEm || 0)
          );

        setMensagens(listaMensagens);
      },
      (error) => {
        console.error(
          "Erro ao carregar mensagens:",
          error
        );
      }
    );

    return () => cancelarListener();
  }, [conversaId]);

  const enviarMensagem = async (event) => {
    event.preventDefault();

    const textoLimpo = texto.trim();

    if (!textoLimpo || !conversaId) {
      return;
    }

    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const referenciaMensagens = ref(
        db,
        `conversas/${conversaId}/mensagens`
      );

      const novaMensagemRef = push(
        referenciaMensagens
      );

      await set(novaMensagemRef, {
        remetenteId: usuarioAtual.uid,
        texto: textoLimpo,
        enviadaEm: Date.now(),
      });

      setTexto("");
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem:",
        error
      );

      alert("Não foi possível enviar a mensagem.");
    }
  };

  if (carregando) {
    return (
      <main className="conversa">
        <section className="conversa-card carregando">
          <h1>Conversa</h1>
          <p>Carregando conversa...</p>
        </section>
      </main>
    );
  }

  const usuarioAtual = auth.currentUser;

  return (
    <main className="conversa">
      <section className="conversa-card">
        <header className="conversa-header">
          <button
  className="conversa-voltar"
  onClick={() => {
    const ehGerador =
      usuarioAtual?.uid ===
      coleta?.usuarioId;

    if (ehGerador) {
      navigate("/meus-materiais");
    } else {
      navigate("/coletador");
    }
  }}
>
  ← Voltar
</button>

          <div>
            <h1>Conversa sobre a coleta</h1>

            <p>
              Combine os detalhes da coleta com o outro
              participante.
            </p>
          </div>
        </header>

        <div className="mensagens">
          {mensagens.length === 0 ? (
            <div className="sem-mensagens">
              <p>Nenhuma mensagem ainda.</p>

              <span>
                Envie uma mensagem para iniciar a
                conversa.
              </span>
            </div>
          ) : (
            mensagens.map((mensagem) => {
              const minhaMensagem =
                mensagem.remetenteId ===
                usuarioAtual?.uid;

              return (
                <div
                  key={mensagem.id}
                  className={`mensagem ${
                    minhaMensagem
                      ? "mensagem-coletador"
                      : "mensagem-gerador"
                  }`}
                >
                  <span className="mensagem-remetente">
                    {minhaMensagem
                      ? "Você"
                      : "Outro participante"}
                  </span>

                  <p>{mensagem.texto}</p>
                </div>
              );
            })
          )}
        </div>

        <form
          className="campo-mensagem"
          onSubmit={enviarMensagem}
        >
          <input
            type="text"
            value={texto}
            onChange={(event) =>
              setTexto(event.target.value)
            }
            placeholder="Digite uma mensagem..."
          />

          <button type="submit">
            Enviar
          </button>
        </form>
      </section>
    </main>
  );
}

export default Conversa;