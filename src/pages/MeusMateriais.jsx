import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebase";
import "./MeusMateriais.css";

function MeusMateriais() {
  const [materiais, setMateriais] = useState([]);

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const carregarMateriais = async () => {
      const usuarioAtual = auth.currentUser;

      if (!usuarioAtual) {
        return;
      }

      const referencia = ref(db, "materiais");
      const resultado = await get(referencia);

      if (!resultado.exists()) {
        setMateriais([]);
        return;
      }

      const dados = resultado.val();

      const lista = Object.entries(dados)
        .map(([id, material]) => ({
          id,
          ...material,
        }))
        .filter(
          (material) =>
            material.usuarioId === usuarioAtual.uid
        );

      const listaComColetador = await Promise.all(
        lista.map(async (material) => {
          if (!material.coletadorId) {
            return material;
          }

          const referenciaColetador = ref(
            db,
            `usuarios/${material.coletadorId}`
          );

          const resultadoColetador = await get(
            referenciaColetador
          );

          if (resultadoColetador.exists()) {
            return {
              ...material,
              coletador: resultadoColetador.val(),
            };
          }

          return material;
        })
      );

      setMateriais(listaComColetador);
    };

    carregarMateriais();
  }, []);

  return (
    <main className="meus-materiais">
      <header className="meus-materiais-header">
        <h1>Meus materiais</h1>

        <p>
          Consulte os materiais que você disponibilizou para coleta.
        </p>
      </header>

      {materiais.length === 0 ? (
        <section className="sem-materiais">
          <h2>Nenhum material disponível</h2>

          <p>
            Você ainda não disponibilizou nenhum material para coleta.
          </p>
        </section>
      ) : (
        <section className="materiais-lista">
          {materiais.map((material) => (
            <article
              className="material-card"
              key={material.id}
            >
              <h2>{material.material}</h2>

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
                <strong>Data:</strong> {material.data}
              </p>

              <p>
                <strong>Horário:</strong> {material.horario}
              </p>

              {material.descricao && (
                <p>
                  <strong>Descrição:</strong>{" "}
                  {material.descricao}
                </p>
              )}

              <p>
                <strong>Status:</strong>{" "}
                {material.status === "disponivel"
                  ? "Disponível"
                  : material.status === "em_coleta"
                  ? "Em coleta"
                  : material.status}
              </p>

              {material.coletador && (
                <p>
                  <strong>Coletador:</strong>{" "}
                  {material.coletador.nome}{" "}
                  {material.coletador.sobrenome}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MeusMateriais;
