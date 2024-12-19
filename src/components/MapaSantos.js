import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"; // Adicione o Tooltip aqui
import "leaflet/dist/leaflet.css";
import pontos from "./pontosData";
import { customIcon } from "./CustomIcon";
import PainelInformacoes from "./PainelInformacoes";
import TituloMapa from "./TituloMapa";
import RodapeMapa from "./RodapeMapa";
import "./MapaSantos.css";

const MapaSantos = () => {
  const [painelInfo, setPainelInfo] = useState(null);

  const handleMarkerClick = (detalhes) => {
    setPainelInfo(detalhes);
  };

  const closePainel = () => {
    setPainelInfo(null);
  };

  return (
    <div className="relative h-screen">
      <TituloMapa />

      <MapContainer
        center={[-23.968208, -46.322742]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        />
        {pontos.map((ponto, index) => (
          <Marker
            key={index}
            position={[ponto.lat, ponto.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(ponto.detalhes),
            }}
          >
            <Tooltip>{ponto.detalhes.titulo}</Tooltip> {/* Adicionando Tooltip para o título */}
            <Popup>
              <span className="text-base font-medium text-gray-700">
                {ponto.desc}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <PainelInformacoes painelInfo={painelInfo} closePainel={closePainel} />

      <RodapeMapa />
    </div>
  );
};

export default MapaSantos;
