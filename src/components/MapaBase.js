import React from 'react';
import { MapContainer, TileLayer } from "react-leaflet";

const isMobile = () => {
  return window.innerWidth <= 768; // Define mobile para telas menores que 768px
};

const MapaBase = ({ children }) => {
  // Define coordenadas e zoom baseados no dispositivo
  const defaultPosition = isMobile() ? [-23.96, -46.36] : [-23.97, -46.29];
  const defaultZoom = isMobile() ? 12 : 13; // Ajuste do zoom para mobile

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapContainer
        center={defaultPosition}
        zoom={defaultZoom}
        className="h-full w-full"
        attributionControl={true} // Ativa o controle de atribuição padrão do Leaflet
      >
        {/* TileLayer com o mapa de fundo */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        />

        {/* Conteúdo adicional do mapa (marcadores, camadas, etc.) */}
        {children}
      </MapContainer>
    </div>
  );
};

export default MapaBase;