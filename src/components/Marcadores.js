import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { customIcon, greenIcon, yellowIcon } from "./CustomIcon"; // Importe os ícones

const Marcadores = ({ pontos, onClick }) => (
  <>
    {pontos.map((ponto, index) => {
      // Escolha o ícone com base no tipo
      let icon;
      if (ponto.tipo === "saude") {
        icon = greenIcon;
      } else if (ponto.tipo === "historico") {
        icon = yellowIcon;
      } else {
        icon = customIcon; // Ícone padrão (azul)
      }

      return (
        <Marker
          key={index}
          position={[ponto.lat, ponto.lng]}
          icon={icon} 
          eventHandlers={{
            click: () => onClick(ponto.detalhes),
          }}
        >
          <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
            {ponto.detalhes.titulo}
          </Tooltip>

        </Marker>
      );
    })}
  </>
);

export default Marcadores;