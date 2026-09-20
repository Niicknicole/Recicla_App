import "./Home.css";
import { Link } from "react-router-dom";
import imagem from "../assets/imagem1.jpg";

function Home() {
  return (
    <main
      className="home"
      style={{ backgroundImage: `url(${imagem})` }}
    >
      <header className="home-header">
        <div className="home-logo">
          <span className="home-logo-icon">♻</span>
          <span>Recicla<span>+</span></span>
        </div>

        <nav className="home-nav">
          <a href="#inicio">Início</a>
          <a href="#como-funciona">Sobre</a>

          <Link to="/login" className="home-nav-login">
            Entrar
          </Link>

          <Link to="/cadastro" className="home-nav-register">
            Criar minha conta
          </Link>
        </nav>
      </header>

      <section className="home-hero" id="inicio">
        <div className="home-hero-content">
          <h1 className="home-title">
            <span>Recicla</span>
            <strong>+</strong>
          </h1>

          <h2 className="home-subtitle">
            Conectando pessoas para construir
            <br />
            uma comunidade <span>mais sustentável.</span>
          </h2>

        
          <div className="home-actions">
            <Link
              to="/cadastro"
              className="home-button home-button-primary"
            >
              Criar minha conta
              <span>→</span>
            </Link>

            <Link
              to="/login"
              className="home-button home-button-secondary"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-how-it-works"
        id="como-funciona"
      >
        <div className="home-glass-section">
          <h2 className="home-section-title">
            <span></span>
            Como funciona?
            <span></span>
          </h2>

          <div className="home-steps">
            <div className="home-step">
              <div className="home-step-icon">♙</div>

              <div className="home-step-number">1</div>

              <h3>Cadastre-se</h3>

              <p>
                Crie sua conta e escolha como deseja participar.
              </p>
            </div>

            <div className="home-step">
              <div className="home-step-icon">🍃</div>

              <div className="home-step-number">2</div>

              <h3>Disponibilize ou encontre materiais</h3>

              <p>
                Você pode disponibilizar materiais recicláveis ou
                encontrar materiais disponíveis para coleta.
              </p>
            </div>

            <div className="home-step">
              <div className="home-step-icon">🌎</div>

              <div className="home-step-number">3</div>

              <h3>Contribua com a comunidade</h3>

              <p>
                Ajude a promover a reciclagem, o reaproveitamento
                e uma economia mais sustentável.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-impact">
        <div className="home-impact-content">
          <h2 className="home-section-title">
            <span></span>
            Nosso impacto
            <span></span>
          </h2>

          <p className="home-impact-description">
            O Recicla+ busca conectar pessoas, incentivar a reciclagem
            e fortalecer iniciativas sustentáveis dentro da comunidade.
          </p>

          <div className="home-impact-cards">
            <div className="home-impact-card">
              <div className="home-impact-icon">♻</div>

              <h3>Economia circular</h3>

              <p>
                Incentivamos o reaproveitamento de materiais e reduzimos
                o descarte desnecessário de recursos.
              </p>
            </div>

            <div className="home-impact-card">
              <div className="home-impact-icon">♧</div>

              <h3>Comunidade</h3>

              <p>
                Conectamos pessoas que possuem materiais recicláveis
                com coletadores e pontos de coleta da região.
              </p>
            </div>

            <div className="home-impact-card">
              <div className="home-impact-icon">🍃</div>

              <h3>Sustentabilidade</h3>

              <p>
                Facilitamos pequenas ações que podem contribuir para
                uma comunidade mais consciente e sustentável.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;