import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import app from "../firebase";
import "./Senha.css";

function Senha() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dados = location.state?.dados;
  const auth = getAuth(app);
  const db = getDatabase(app);

   const senhaValida = {
   tamanho: senha.length >= 8,
   maiuscula: /[A-Z]/.test(senha),
   minuscula: /[a-z]/.test(senha),
   numero: /[0-9]/.test(senha),
   simbolo: /[!@#$%^&*()_+]/.test(senha),
   }; 

  const handleSubmit = async(event) => {
    event.preventDefault();

    if (senha.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(senha)) {
      alert("A senha deve conter pelo menos uma letra maiúscula.");
      return;
    }

    if (!/[a-z]/.test(senha)) {
      alert("A senha deve conter pelo menos uma letra minúscula.");
      return;
    }

    if (!/[0-9]/.test(senha)) {
      alert("A senha deve conter pelo menos um número.");
      return;
    }

    if (!/[!@#$%^&*()_+]/.test(senha)) {
      alert("A senha deve conter pelo menos um símbolo.");
      return;
    }

    if (senha !== confirmacao) {
      alert("As senhas não são iguais.");
      return;
    }

    try {
    const usuario = await createUserWithEmailAndPassword(
    auth,
    dados.email,
    senha
  );
  const uid = usuario.user.uid;

   await set(ref(db, `usuarios/${uid}`), {
    nome: dados.nome,
    sobrenome: dados.sobrenome,
    email: dados.email,
    idade: Number(dados.idade),
    cep: dados.cep,
    rua: dados.rua,
    numero: dados.numero,
    perfil: dados.perfil,
   }); 
   console.log("Conta e dados salvoss com sucesso!", usuario.user);

   alert("Conta criada com sucesso!");
   navigate("/login");
  } catch (error) {
    console.error(error);

    if (error.code === "auth/email-already-in-use") {
     alert("Este e-mail já está cadastrado.");
   } else if (error.code === "auth/invalid-email") {
     alert("O e-mail informado é inválido.");
   } else {
     alert("Não foi possível criar a conta.");
   }
  }
  };

  return (
    <main className="senha">
      <h1 className="senha-title">Crie sua senha</h1>

      <p className="senha-description">
        Crie uma senha segura para acessar sua conta do Recicla+.
      </p>

      <form className="senha-form" onSubmit={handleSubmit}>
        <label>Senha</label>

        <input
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          placeholder="Digite sua senha"
        />
        <ul className="senha-requisitos">
        <li>{senhaValida.tamanho ? "✓" : "○"} Pelo menos 8  caracteres</li>
        <li>{senhaValida.maiuscula ? "✓" : "○"} Uma letra maiúscula</li>
        <li>{senhaValida.minuscula ? "✓" : "○"} Uma letra minúscula</li>
        <li>{senhaValida.numero ? "✓" : "○"} Um número</li>
        <li>{senhaValida.simbolo ? "✓" : "○"} Um símbolo</li>
        </ul>

        <label>Confirme sua senha</label>

        <input
          type="password"
          value={confirmacao}
          onChange={(event) => setConfirmacao(event.target.value)}
          placeholder="Digite sua senha novamente"
        />

        <button type="submit" className="senha-button">
          Criar conta
        </button>
      </form>
    </main>
  );
}

export default Senha;