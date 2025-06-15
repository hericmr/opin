import React from 'react';
import { MapContainer, TileLayer } from "react-leaflet";

const isMobile = () => {
  return window.innerWidth <= 768; // Define mobile para telas menores que 768px
};

const MapaBase = ({ children }) => {
  // Define coordenadas e zoom baseados no dispositivo para visualizar SP
  const defaultPosition = isMobile() ? [-23.5505, -48.6333] : [-23.305, -43.9];
  const defaultZoom = isMobile() ? 6 : 7; // Zoom mais aberto para visualizar mais do estado

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapContainer
        center={defaultPosition}
        zoom={defaultZoom}
        className="h-full w-full"
        attributionControl={false} // Ativa o controle de atribuição padrão do Leaflet
      >
        {/* TileLayer com o mapa de fundo */}
        <TileLayer
        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

        {/* Conteúdo adicional do mapa (marcadores, camadas, etc.) */}
        {children}
      </MapContainer>
    </div>
  );
};

export default MapaBase;