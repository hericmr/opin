import React from "react";
import { MapContainer, TileLayer, AttributionControl } from "react-leaflet";

const MapaBase = ({ children }) => (
  <MapContainer
    center={[-23.97, -46.29]}
    zoom={13}
    className="h-full w-full"
    attributionControl={false} // Desativa o controle de atribuição padrão
    style={{ position: "relative" }} // Garante posicionamento correto
  >
    {/* TileLayer com o mapa de fundo */}
    <TileLayer
      url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />

    {/* Controle de atribuição personalizado */}
    <AttributionControl
      position="bottomright" // Posição da atribuição
      prefix={'&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'}
    />

    {/* Conteúdo adicional do mapa (marcadores, camadas, etc.) */}
    {children}
  </MapContainer>
);

export default MapaBase;