import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PontosColeta.css";

function PontosColeta() {
  const navigate = useNavigate();

  const pontos = [
    {
      id: 1,
      nome: "Ecoponto Imperador",
      endereco: "Av. Ribeirão Jacu, 201 – Jardim das Camélias",
      materiais: "Papelão, plástico, papéis e vidros",
      horario: "Segunda a sexta, das 6h às 22h | Domingos e feriados 6h ás 18h",
      latitude: -23.513400,
      longitude: -46.456300,
    },
    {
      id: 2,
      nome: "Ecoponto Carlito Maia",
      endereco: "Rua Domingos Fernandes Nobre, 109 – Vila Itaim",
      materiais: "Papelão, plástico, vidro e metais",
      horario: "Segunda a sábado, das 7h às 21h | Domingo 8h ás 16h",
      latitude: -23.490816,
      longitude: -46.394474,
    },
    {
      id: 3,
      nome: "Ecoponto Pedro Nunes",
      endereco: "Rua da Polka, 100 – Jardim Pedro José Nunes",
      materiais: "Papel, papelão, garrafas PET, plásticos e embalagens",
      horario: "Segunda a sexta, das 6h às 22h | Domingo 8h ás 18h",
      latitude: -23.506321,
      longitude: -46.462038,
    },
    {
      id: 4,
      nome: "Ecoponto Itaqueruna",
      endereco: "Rua Domitila d'Abril, 88 – Cidade Nova São Miguel",
      materiais: "Papel, papelão, plásticos, vidros e metais",
      horario: "Segunda a sexta, das 6h às 22h | Domingos e feriados 6h ás 18h",
      latitude:-23.510947,
      longitude: -46.432529,
    },
    {
      id: 5,
      nome: "Ecoponto Varre Vila",
      endereco: "Rua Primeiro de Maio, defronte nº 106 – União de Vila Nova",
      materiais: "Papel, papelão, plásticos, vidros e metais",
      horario: "Segunda a sexta, das 6h às 22h | Domingos e feriados 6h ás 18h ",
      latitude:-27.22286,
      longitude:-49.732004,
    },
    {
      id: 6,
      nome: "Ecoponto Jardim Helena",
      endereco: "Rua Cosme dos Santos, 110 – Jardim Helena",
      materiais: "Gesso, papel, papelão, plásticos, vidros e metais",
      horario: "Segunda a sexta, das 6h às 22h | Domingos e feriados 6h ás 18h",
      latitude:-23.480159,
      longitude:-46.412007,
    },
  ];

  const centroMapa = [-23.5505, -46.6333];

  return (
    <main className="pontos-coleta">
      <header className="pontos-coleta-header">
        <h1>Pontos de coleta</h1>

        <p>
          Encontre locais onde você pode encaminhar materiais recicláveis.
        </p>
      </header>

      <section className="mapa-container">
        <MapContainer
          center={centroMapa}
          zoom={13}
          scrollWheelZoom={true}
          className="mapa"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pontos.map((ponto) => (
            <Marker
              key={ponto.id}
              position={[ponto.latitude, ponto.longitude]}
            >
              <Popup>
                <strong>{ponto.nome}</strong>
                <br />
                {ponto.endereco}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

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