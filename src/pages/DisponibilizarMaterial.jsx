import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import app from "../firebase";
import "./DisponibilizarMaterial.css";

function DisponibilizarMaterial() {
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    descricao: "",
    data: "",
    horario: "",
    bairro: "",
  });

  const [materialAtual, setMaterialAtual] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState("");
  const [unidadeAtual, setUnidadeAtual] = useState("");

  const [materiais, setMateriais] = useState([]);

  const unidadesPorMaterial = {
    papelao: ["caixas", "unidades"],
    plastico: ["unidades"],
    latas: ["unidades", "sacos-1L", "sacos-5L"],
    "garrafas-pet": ["unidades"],
    vidro: ["unidades"],
    eletronicos: ["unidades"],
    outros: ["unidades","caixas", "sacos-1L", "sacos-5L"],
  };

  const nomesMateriais = {
    papelao: "Papelão",
    plastico: "Plástico",
    latas: "Latas",
    "garrafas-pet": "Garrafas PET",
    vidro: "Vidro",
    eletronicos: "Eletrônicos",
    outros: "Outros",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setDados({
      ...dados,
      [name]: value,
    });
  };

  const handleMaterialChange = (event) => {
    setMaterialAtual(event.target.value);

    // Quando mudar o material, limpa a unidade anterior
    setUnidadeAtual("");
  };

  const adicionarMaterial = () => {
    if (!materialAtual || !quantidadeAtual || !unidadeAtual) {
      alert("Preencha material, quantidade e unidade.");
      return;
    }

    const materialJaAdicionado = materiais.some(
      (item) => item.material === materialAtual
    );

    if (materialJaAdicionado) {
      alert("Esse material já foi adicionado à coleta.");
      return;
    }

    const novoMaterial = {
      material: materialAtual,
      quantidade: Number(quantidadeAtual),
      unidade: unidadeAtual,
    };

    setMateriais([...materiais, novoMaterial]);

    // Limpa os campos para permitir adicionar outro material
    setMaterialAtual("");
    setQuantidadeAtual("");
    setUnidadeAtual("");
  };

  const removerMaterial = (index) => {
    const novaLista = materiais.filter((_, i) => i !== index);

    setMateriais(novaLista);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (materiais.length === 0) {
      alert("Adicione pelo menos um material.");
      return;
    }

    if (!dados.data || !dados.horario || !dados.bairro) {
      alert("Preencha a data, o horário e o bairro.");
      return;
    }

    const auth = getAuth(app);
    const db = getDatabase(app);

    const usuarioAtual = auth.currentUser;

    if (!usuarioAtual) {
      alert("Você precisa estar logado para disponibilizar uma coleta.");
      navigate("/login");
      return;
    }

    try {
      const materiaisRef = ref(db, "materiais");
      const novaColetaRef = push(materiaisRef);

      await set(novaColetaRef, {
        usuarioId: usuarioAtual.uid,

        materiais: materiais,

        descricao: dados.descricao,

        data: dados.data,
        horario: dados.horario,

        bairro: dados.bairro,
        cidade: "São Paulo",

        status: "disponivel",

        criadoEm: Date.now(),
      });

      alert("Coleta disponibilizada com sucesso!");

      navigate("/gerador");
    } catch (error) {
      console.error(error);
      alert("Não foi possível disponibilizar a coleta.");
    }
  };

  return (
    <main className="disponibilizar-material">
      <h1>Disponibilizar material</h1>

      <p>
        Informe os materiais que você deseja disponibilizar para coleta.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Material</label>

        <select
          value={materialAtual}
          onChange={handleMaterialChange}
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
          min="1"
          placeholder="Ex.: 10"
          value={quantidadeAtual}
          onChange={(event) => setQuantidadeAtual(event.target.value)}
        />

        <label>Unidade</label>

        <select
          value={unidadeAtual}
          onChange={(event) => setUnidadeAtual(event.target.value)}
          disabled={!materialAtual}
        >
          <option value="">Selecione uma unidade</option>

          {materialAtual &&
            unidadesPorMaterial[materialAtual].map((unidade) => (
              <option key={unidade} value={unidade}>
                {unidade}
              </option>
            ))}
        </select>

        <button
          type="button"
          className="adicionar-material"
          onClick={adicionarMaterial}
        >
          + Adicionar outro material
        </button>

        {materiais.length > 0 && (
          <div className="materiais-adicionados">
            <h2>Materiais da coleta</h2>

            {materiais.map((item, index) => (
              <div className="material-item" key={index}>
                <div>
                  <strong>{nomesMateriais[item.material]}</strong>

                  <span>
                    {item.quantidade} {item.unidade}
                  </span>
                </div>

                <button
                  type="button"
                  className="remover-material"
                  onClick={() => removerMaterial(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

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

        <label>Localização aproximada</label>

        <select
          name="bairro"
          value={dados.bairro}
          onChange={handleChange}
        >
          <option value="">Selecione o bairro</option>

          <option value="São Miguel Paulista">
            São Miguel Paulista
          </option>

          <option value="Jardim Helena">
            Jardim Helena
          </option>

          <option value="Vila Jacuí">
            Vila Jacuí
          </option>

          <option value="Vila Curuçá">
            Vila Curuçá
          </option>

          <option value="Jardim Romano">
            Jardim Romano
          </option>

          <option value="Jardim Maia">
            Jardim Maia
          </option>

          <option value="Itaim Paulista">
            Itaim Paulista
          </option>

          <option value="Ermelino Matarazzo">
            Ermelino Matarazzo
          </option>

          <option value="Penha">
            Penha
          </option>

          <option value="Itaquera">
            Itaquera
          </option>

          <option value="Outro">
            Outro
          </option>
        </select>

        <small className="ajuda-localizacao">
          O bairro será mostrado ao coletador para indicar a região
          aproximada da coleta.
        </small>

        <button type="submit">
          Disponibilizar coleta
        </button>
      </form>

      <button
        className="pontos-voltar"
        onClick={() => navigate("/gerador")}
      >
        Voltar
      </button>
    </main>
  );
}

export default DisponibilizarMaterial;