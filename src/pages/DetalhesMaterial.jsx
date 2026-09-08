import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import app from "../firebase";

function DetalhesMaterial() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { id } = useParams();

  const [material, setMaterial] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const db = getDatabase(app);

  useEffect(() => {
    const carregarDetalhes = async () => {
      const referenciaMaterial = ref(db, `materiais/${id}`);
      const resultadoMaterial = await get(referenciaMaterial);

      if (!resultadoMaterial.exists()) {
        return;
      }

      const dadosMaterial = resultadoMaterial.val();
      setMaterial(dadosMaterial);

      const referenciaUsuario = ref(
        db,
        `usuarios/${dadosMaterial.usuarioId}`
      );

      const resultadoUsuario = await get(referenciaUsuario);

      if (resultadoUsuario.exists()) {
        setUsuario(resultadoUsuario.val());
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
    alert("Você não pode coletar um material que você mesmo disponibilizou.");
    return;
  }

  if (material.status !== "disponivel") {
    alert("Este material não está mais disponível para coleta.");
    return;
  }

  try {
    const referencia = ref(db, `materiais/${id}`);

    await update(referencia, {
      status: "em_coleta",
      coletadorId: usuarioAtual.uid,
    });

    alert("Coleta assumida com sucesso!");

    navigate("/coletador");
  } catch (error) {
    console.error(error);
    alert("Não foi possível assumir esta coleta.");
  }
};

  if (!material) {
    return (
      <main>
        <h1>Detalhes do material</h1>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Detalhes da coleta</h1>

      <section>
        <h2>{material.material}</h2>

        <p>
          <strong>Quantidade:</strong>{" "}
          {material.quantidade} {material.unidade}
        </p>

        <p>
          <strong>Data:</strong> {material.data}
        </p>

        <p>
          <strong>Horário:</strong> {material.horario}
        </p>

        {material.descricao && (
          <p>
            <strong>Descrição:</strong> {material.descricao}
          </p>
        )}
      </section>

      {usuario && (
        <section>
          <h2>Local da coleta</h2>

          <p>
            <strong>Rua:</strong> {usuario.rua}
          </p>

          <p>
            <strong>Número:</strong> {usuario.numero}
          </p>

          <p>
            <strong>CEP:</strong> {usuario.cep}
          </p>
        </section>
      )}

      <button onClick={assumirColeta}>
       Tenho interesse em coletar
      </button>
    </main>
  );
}

export default DetalhesMaterial;