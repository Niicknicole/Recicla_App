import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <h1 className="home-title">Recicla+</h1>

        <h2 className="home-subtitle">
          Conectando pessoas para construir uma comunidade mais sustentável.
        </h2>

        <p className="home-description">
          O Recicla+ conecta pessoas que possuem materiais recicláveis
          a coletadores da comunidade, facilitando a reciclagem e o
          reaproveitamento de materiais.
        </p>

        <div className="home-actions">
      <Link
         to="/cadastro"
         className="home-button home-button-primary"
        >
         Criar minha conta
      </Link>

      <Link
       to="/login"
       className="home-button home-button-secondary"
      >
       Entrar
      </Link>
      </div>
      </section>

      <section className="home-how-it-works">
        <h2 className="home-section-title">Como funciona?</h2>

        <div className="home-steps">
          <div className="home-step">
            <h3>1. Cadastre-se</h3>
            <p>Crie sua conta e escolha como deseja participar.</p>
          </div>

          <div className="home-step">
            <h3>2. Disponibilize ou encontre materiais</h3>
            <p>
              Você pode disponibilizar materiais recicláveis ou encontrar
              pontos disponíveis para coleta.
            </p>
          </div>

          <div className="home-step">
            <h3>3. Contribua com a comunidade</h3>
            <p>
              Ajude a promover a reciclagem, o reaproveitamento e uma
              economia mais sustentável.
            </p>
          </div>
        </div>
      </section>
      <section className="home-impact">
  <h2 className="home-section-title">Nosso impacto</h2>

  <p className="home-impact-description">
    O Recicla+ busca conectar pessoas, incentivar a reciclagem e fortalecer
    iniciativas sustentáveis dentro da comunidade.
  </p>

  <div className="home-impact-cards">
    <div className="home-impact-card">
      <h3>Economia circular</h3>
      <p>
        Incentivamos o reaproveitamento de materiais e reduzimos o descarte
        desnecessário de recursos.
      </p>
    </div>

    <div className="home-impact-card">
      <h3>Comunidade</h3>
      <p>
        Conectamos pessoas que possuem materiais recicláveis com coletadores
        e pontos de coleta da região.
      </p>
    </div>

    <div className="home-impact-card">
      <h3>Sustentabilidade</h3>
      <p>
        Facilitamos pequenas ações que podem contribuir para uma comunidade
        mais consciente e sustentável.
      </p>
    </div>
  </div>
</section>
    </main>
  );
}

export default Home;