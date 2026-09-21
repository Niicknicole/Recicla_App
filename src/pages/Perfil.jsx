import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const carregarDados = async () => {
      const usuarioAtual = auth.currentUser;

      if (!usuarioAtual) {
        navigate("/login");
        return;
      }

      const referenciaUsuario = ref(
        db,
        `usuarios/${usuarioAtual.uid}`
      );

      const resultadoUsuario = await get(
        referenciaUsuario
      );

      if (!resultadoUsuario.exists()) {
        return;
      }

      setUsuario(resultadoUsuario.val());
    };

    carregarDados();
  }, []);

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
          <strong>Nome:</strong>{" "}
          {usuario.nome} {usuario.sobrenome}
        </p>

        <p>
          <strong>E-mail:</strong>{" "}
          {usuario.email}
        </p>

        <p>
          <strong>Idade:</strong>{" "}
          {usuario.idade}
        </p>
      </section>

      <section className="perfil-section">
        <h2>Endereço</h2>

        <p>
          <strong>CEP:</strong>{" "}
          {usuario.cep}
        </p>

        <p>
          <strong>Rua:</strong>{" "}
          {usuario.rua}
        </p>

        <p>
          <strong>Número:</strong>{" "}
          {usuario.numero}
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