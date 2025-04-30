import React from 'react';
import { MapContainer, TileLayer } from "react-leaflet";

const isMobile = () => {
  return window.innerWidth <= 768; // Define mobile para telas menores que 768px
};

const MapaBase = ({ children }) => {
  // Define coordenadas e zoom baseados no dispositivo para visualizar SP
  const defaultPosition = isMobile() ? [-23.5505, -46.6333] : [-23.5505, -46.6333];
  const defaultZoom = isMobile() ? 7 : 8; // Zoom ajustado para visualizar o estado de SP

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