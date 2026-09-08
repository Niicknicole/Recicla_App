import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";
function Cadastro() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    idade: "",
    cep: "",
    rua:"",
    numero: "",
    perfil: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDados({
      ...dados,
      [name]: value,
    });
  };

  const buscarCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    return;
  }

  try {
    const resposta = await fetch(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    const dadosCep = await resposta.json();

    if (dadosCep.erro) {
      alert("CEP não encontrado.");
      return;
    }

    setDados({
      ...dados,
      rua: dadosCep.logradouro,
    });
  } catch (error) {
    alert("Não foi possível consultar o CEP.");
  }
};

  const handleSubmit = (event) => {
  event.preventDefault();

   if (
    !dados.nome ||
    !dados.sobrenome ||
    !dados.email ||
    !dados.idade ||
    !dados.cep ||
    !dados.rua ||
    !dados.numero ||
    !dados.perfil
  ) {
    alert("Preencha todos os campos e selecione um perfil.");
    return;
  }

  if (!dados.email.includes("@")) {
    alert("Digite um e-mail válido.");
    return;
  }

  const idade = Number(dados.idade);

  if (idade < 18 || idade > 90) {
    alert("Você deve ser maior de idade!");
    return;
  }

  console.log("Cadastro válido",dados); 
  navigate("/senha", {
    state: {
      dados,
    },
    
  });
};

  return (
    <main className="cadastro">
      <h1 className="cadastro-title">Crie sua conta</h1>

      <p className="cadastro-description">
        Faça parte da comunidade Recicla+ e escolha como deseja participar.
      </p>

      <form className="cadastro-form" onSubmit=
      {handleSubmit}>
        <label>Nome</label>
        <input type="text" name="nome"
         placeholder="Digite seu nome"
         value={dados.nome}
         onChange={handleChange}/>

        <label>Sobrenome</label>
        <input type="text" name="sobrenome"
         placeholder="Digite seu sobrenome"
         value={dados.sobrenome}
         onChange={handleChange}/>

        <label>E-mail</label>
        <input type="email" name="email"
         placeholder="Digite seu e-mail"
         value={dados.email}
         onChange={handleChange} />

        <label>Idade</label>
        <input type="number" name="idade"
         placeholder="Digite sua idade"
         value={dados.idade}
         onChange={handleChange}/>

        <label>CEP</label>
        <input type="text" name="cep"
         placeholder="Digite seu CEP"
         value={dados.cep}
         onChange={handleChange}
         onBlur={() => buscarCep(dados.cep)}/>

        <label>Rua</label>
        <input type="text" name="rua"
         placeholder="Sua rua"
         value={dados.rua}
         onChange={handleChange} />

        <label>Número</label>
        <input type="text" name="numero"
         placeholder="Número da residência"
         value={dados.numero}
         onChange={handleChange}/>

        <h2>Como você deseja participar?</h2>

       <label>
       <input
       type="radio"
       name="perfil"
       value="gerador"
       checked={dados.perfil === "gerador"}
       onChange={handleChange}
       />
        Quero disponibilizar materiais
      </label>

      <label>
      <input
       type="radio"
       name="perfil"
       value="coletador"
       checked={dados.perfil === "coletador"}
      onChange={handleChange}
      />
        Sou coletador
      </label>

        <button type="submit" className="cadastro-button">Continuar</button>
      </form>
    </main>
  );
}

export default Cadastro;