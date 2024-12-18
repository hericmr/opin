import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Lista de pontos no mapa
const pontos = [
  { lat: -23.9851111, lng: -46.3088611, desc: "Câmera perto da estátua da Iemanjá" },
  { lat: -23.986538, lng: -46.31339, desc: "Farolzin do Canal 6" },
  { lat: -23.991275, lng: -46.316918, desc: "Boia Verde" },
];

// Ícone personalizado para os marcadores
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [30, 45], // Tamanho do ícone
  iconAnchor: [15, 45], // Ponto de ancoragem
  popupAnchor: [1, -34], // Posição do popup em relação ao ícone
});

const MapaSantos = () => {
  return (
    <div className="relative h-screen">
      {/* Título no topo */}
      <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-gray-900 via-gray-800 to-transparent text-white text-center">
        <p className="text-lg font-semibold tracking-wide animate-pulse">
          Cartografia da Cidade de Santos
        </p>
        <p className="text-sm font-light">
          Territorialidades e lutas sociais, destacando a força das identidades coletivas e os movimentos sociais de Santos.
        </p>
      </div>

      {/* Contêiner do mapa */}
      <MapContainer
        center={[-23.968208, -46.322742]} // Coordenadas centrais de Santos
        zoom={13} // Nível de zoom inicial
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Exibe os pontos no mapa */}
        {pontos.map((ponto, index) => (
          <Marker
            key={index}
            position={[ponto.lat, ponto.lng]}
            icon={customIcon}
          >
            <Popup>
              <span className="text-base font-medium text-gray-700">{ponto.desc}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Rodapé no mapa */}
      <div className="absolute bottom-0 left-0 w-full z-10 p-4 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent text-white text-center">
        <p className="text-sm">
          Explore e conheça mais sobre os pontos destacados da cidade de Santos.
        </p>
      </div>
    </div>
  );
};

export default MapaSantos;
