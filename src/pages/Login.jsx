import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";
import "./Login.css";

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
    <main className="login">
      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

      <section className="login-card">
        <button
          className="login-back"
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>

        <div className="login-brand">
          <div className="login-brand-icon">♻</div>

          <h1>
            Recicla<span>+</span>
          </h1>
        </div>

        <div className="login-header">
          <h2>Bem-vindo de volta</h2>

          <p>
            Entre na sua conta para continuar contribuindo
            com a comunidade.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-submit"
          >
            Entrar
            <span>→</span>
          </button>
        </form>

        <div className="login-register">
          <p>
            Ainda não possui uma conta?
          </p>

          <button
            onClick={() => navigate("/cadastro")}
          >
            Criar minha conta
          </button>
        </div>
      </section>
    </main>
  );
}

export default Login;