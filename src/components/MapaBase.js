import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const MapaBase = ({ children }) => (
  <div className="h-screen w-screen overflow-hidden">
    <MapContainer
      center={[-23.97, -46.29]}
      zoom={13}
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

export default MapaBase;
