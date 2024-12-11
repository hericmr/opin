import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GPXComponent from "./GPXComponent"; // Importa o novo componente GPX

const pontos = [
  { lat: -23.9851111, lng: -46.3088611, desc: "Câmera perto da estátua da Iemanjá" },
  { lat: -23.986537968087983, lng: -46.313389755692555, desc: "Farolzin do Canal 6" },
  { lat: -23.991274504274266, lng: -46.31691750701601, desc: "Boia Verde" },
];

// Coordenadas de Héric
const hericLocation = { lat: -23.9876543, lng: -46.3051234 };

const MapaSantos = () => {
  const mapRef = useRef(null);
  const [gpxData, setGpxData] = useState([]);

  // Função para atualizar os pontos do GPX (diretamente chamada do GPXComponent)
  const updateGpxData = (points) => {
    setGpxData(points);
  };

  // Função para criar o ícone com efeitos personalizados
  const createCustomIcon = (iconUrl, size = [40, 40], iconAnchor = [20, 40]) => {
    return new L.Icon({
      iconUrl,
      iconSize: size,
      iconAnchor: iconAnchor,
      popupAnchor: [1, -34],
      className: "marker-icon transition-transform duration-300 hover:scale-125", // Efeito de zoom ao passar o mouse
    });
  };

  return (
    <div className="relative h-screen">
      <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-gray-900 via-gray-800 to-transparent text-white text-center">
        <p className="text-lg font-semibold tracking-wide animate-pulse">
          📍 Rastreamento em tempo real
        </p>
      </div>
      <MapContainer
        center={[hericLocation.lat, hericLocation.lng]} // Centraliza o mapa na localização do Héric
        zoom={15} // Nível de zoom
        className="h-full w-full"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Exibe os pontos fixos */}
        {pontos.map((ponto, index) => (
          <Marker
            key={index}
            position={[ponto.lat, ponto.lng]}
            icon={createCustomIcon(
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Ícone padrão para pontos fixos
              [30, 45], // Tamanho menor para ícones fixos
              [15, 45]
            )}
          >
            <Popup>
              <span className="text-base font-medium text-gray-700">{ponto.desc}</span>
            </Popup>
          </Marker>
        ))}

        {/* Exibe os pontos do GPX carregados */}
        {gpxData.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lon]}
            icon={createCustomIcon(
              "https://hericmr.github.io/me/imagens/heric.png", // Ícone do Heric
              [50, 50], // Tamanho maior para o ícone do Héric
              [25, 50]
            )}
          >
            <Popup>
              <span className="text-base font-medium text-green-600">
                Localização do Héric: ({point.lat.toFixed(6)}, {point.lon.toFixed(6)})
              </span>
            </Popup>
          </Marker>
        ))}

        {/* Componente GPX, passando a função para atualizar os dados */}
        <GPXComponent
          gpxUrl="https://corsproxy.io/https://www.openstreetmap.org/trace/11704581/data"
          updateGpxData={updateGpxData}
        />
      </MapContainer>
      <div className="absolute bottom-0 left-0 w-full z-10 p-4 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent text-white text-center">
        <p className="text-sm">🔍 Para localização avançada do Héric</p>
      </div>
    </div>
  );
};

export default MapaSantos;
