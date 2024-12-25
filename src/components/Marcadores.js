import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { customIcon } from "./CustomIcon";

const Marcadores = ({ pontos, onClick }) => (
  <>
    {pontos.map((ponto, index) => (
      <Marker
        key={index}
        position={[ponto.lat, ponto.lng]}
        icon={customIcon}
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
