import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getDatabase(app);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !senha) {
      alert("Preencha o e-mail e a senha.");
      return;
    }

    try {
      const usuario = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      console.log("Login realizado!", usuario.user);

      const uid = usuario.user.uid;

      const referencia = ref(db, `usuarios/${uid}`);
      const resultado = await get(referencia);

      if (!resultado.exists()) {
        alert("Os dados do usuário não foram encontrados.");
        return;
      }

      const dadosUsuario = resultado.val();

      console.log("Dados do usuário:", dadosUsuario);

      if (dadosUsuario.perfil === "gerador") {
        navigate("/gerador");
      } else if (dadosUsuario.perfil === "coletador") {
        navigate("/coletador");
      } else {
        alert("Perfil de usuário inválido.");
      }
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        alert("E-mail ou senha incorretos.");
      } else if (error.code === "auth/invalid-email") {
        alert("Digite um e-mail válido.");
      } else {
        alert("Não foi possível realizar o login.");
      }
    }
  };

  return (
    <main>
      <h1>Entrar no Recicla+</h1>

      <form onSubmit={handleSubmit}>
        <label>E-mail</label>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label>Senha</label>

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
        />

        <button type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}

export default Login;