import { useNavigate } from "react-router-dom";
import "./PontosColeta.css";

function PontosColeta() {
  const navigate = useNavigate();

  const pontos = [
    {
      id: 1,
      nome: "Ponto de Coleta Recicla+",
      endereco: "Rua Exemplo, 100",
      materiais: "Papelão, plástico, latas e garrafas PET",
      horario: "Segunda a sexta, das 8h às 17h",
    },
    {
      id: 2,
      nome: "Cooperativa Comunitária",
      endereco: "Avenida da Comunidade, 250",
      materiais: "Papelão, plástico, vidro e eletrônicos",
      horario: "Segunda a sábado, das 9h às 16h",
    },
    {
      id: 3,
      nome: "Ecoponto Recicla+",
      endereco: "Rua da Sustentabilidade, 50",
      materiais: "Materiais recicláveis diversos",
      horario: "Segunda a sexta, das 8h às 18h",
    },
  ];

  return (
    <main className="pontos-coleta">
      <header className="pontos-coleta-header">
        <h1>Pontos de coleta</h1>
        <p>
          Encontre locais onde você pode encaminhar materiais recicláveis.
        </p>
      </header>

      <section className="pontos-lista">
        {pontos.map((ponto) => (
          <article className="ponto-card" key={ponto.id}>
            <h2>{ponto.nome}</h2>

            <p>
              <strong>Endereço:</strong> {ponto.endereco}
            </p>

            <p>
              <strong>Materiais aceitos:</strong> {ponto.materiais}
            </p>

            <p>
              <strong>Horário:</strong> {ponto.horario}
            </p>
          </article>
        ))}
      </section>

      <button
        className="pontos-voltar"
        onClick={() => navigate("/gerador")}
      >
        Voltar
      </button>
    </main>
  );
}

export default PontosColeta;