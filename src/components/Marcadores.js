import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { customIcon, greenIcon } from "./CustomIcon"; // Importe os ícones

const Marcadores = ({ pontos, onClick }) => (
  <>
    {pontos.map((ponto, index) => (
      <Marker
        key={index}
        position={[ponto.lat, ponto.lng]}
        icon={ponto.tipo === "saude" ? greenIcon : customIcon} // Escolha o ícone com base no tipo
        eventHandlers={{
          click: () => onClick(ponto.detalhes),
        }}
      >
        <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
          {ponto.detalhes.titulo}
        </Tooltip>
        <Popup>
          <span className="text-base font-medium text-gray-700">
            {ponto.desc}
          </span>
        </Popup>
      </Marker>
    ))}
  </>
);

export default Marcadores;