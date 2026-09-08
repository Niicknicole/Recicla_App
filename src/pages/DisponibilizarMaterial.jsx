import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import app from "../firebase";

function DisponibilizarMaterial() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    material: "",
    quantidade: "",
    unidade: "",
    descricao: "",
    data: "",
    horario: "",
  });

  const unidadesPorMaterial = {
  papelao: ["caixas", "unidades"],
  plastico: ["unidades", "saco-1L", "saco-5L"],
  latas: ["unidades", "saco-1L", "saco-5L"],
  "garrafas-pet": ["unidades"],
  vidro: ["unidades"],
  eletronicos: ["unidades"],
  outros: ["unidades", "saco-1L", "saco-5L"],
};

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDados({
      ...dados,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !dados.material ||
      !dados.quantidade ||
      !dados.unidade ||
      !dados.data ||
      !dados.horario
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const auth = getAuth(app);
    const db = getDatabase(app);

    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      alert("Você precisa estar logado para disponibilizar um material.");
      navigate("/login");
      return;
    }

    try {
      const materiaisRef = ref(db, "materiais");
      const novoMaterialRef = push(materiaisRef);

      await set(novoMaterialRef, {
        usuarioId: usuarioAtual.uid,
        material: dados.material,
        quantidade: Number(dados.quantidade),
        unidade: dados.unidade,
        descricao: dados.descricao,
        data: dados.data,
        horario: dados.horario,
        status: "disponivel",
        criadoEm: Date.now(),
      });

      alert("Material disponibilizado com sucesso!");

      navigate("/gerador");
    } catch (error) {
      console.error(error);
      alert("Não foi possível disponibilizar o material.");
    }
  };

  return (
    <main>
      <h1>Disponibilizar material</h1>

      <p>
        Informe os materiais que você deseja disponibilizar para coleta.
      </p>

      <form onSubmit={handleSubmit}>
       <label>Material</label>

<select
  name="material"
  value={dados.material}
  onChange={handleChange}
>
  <option value="">Selecione um material</option>
  <option value="papelao">Papelão</option>
  <option value="plastico">Plástico</option>
  <option value="latas">Latas</option>
  <option value="garrafas-pet">Garrafas PET</option>
  <option value="vidro">Vidro</option>
  <option value="eletronicos">Eletrônicos</option>
  <option value="outros">Outros</option>
</select>

        <label>Quantidade</label>

        <input
          type="number"
          name="quantidade"
          min="1"
          placeholder="Ex.: 10"
          value={dados.quantidade}
          onChange={handleChange}
        />

        <label>Unidade</label>

<select
  name="unidade"
  value={dados.unidade}
  onChange={handleChange}
  disabled={!dados.material}
>
  <option value="">Selecione uma unidade</option>

  {dados.material &&
    unidadesPorMaterial[dados.material].map((unidade) => (
      <option key={unidade} value={unidade}>
        {unidade}
      </option>
    ))}
</select>

        <label>Descrição (opcional)</label>

        <textarea
          name="descricao"
          placeholder="Descreva melhor os materiais, se necessário."
          value={dados.descricao}
          onChange={handleChange}
        />

        <label>Data disponível para coleta</label>

        <input
          type="date"
          name="data"
          value={dados.data}
          onChange={handleChange}
        />

        <label>Horário disponível para coleta</label>

        <input
          type="time"
          name="horario"
          value={dados.horario}
          onChange={handleChange}
        />

        <button type="submit">
          Disponibilizar material
        </button>
      </form>
    </main>
  );
}

export default DisponibilizarMaterial;