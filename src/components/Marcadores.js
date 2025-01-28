import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { customIcon, greenIcon, yellowIcon } from "./CustomIcon"; // Ícones personalizados

const Marcadores = ({ pontos, onClick }) => {
  if (!pontos || pontos.length === 0) {
    console.warn("Nenhum ponto para exibir."); // Log para depuração
    return null;
  }

  return (
    <>
      {pontos.map((ponto, index) => {
        // Seleciona o ícone com base no tipo do ponto
        let icon;
        switch (ponto.tipo) {
          case "assistencia":
            icon = greenIcon;
            break;
          case "historico":
            icon = yellowIcon;
            break;
          default:
            icon = customIcon; // Ícone padrão
            break;
        }

        return (
          <Marker
            key={index}
            position={[ponto.lat, ponto.lng]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onClick) {
                  onClick(ponto.detalhes);
                } else {
                  console.warn("Nenhum handler onClick definido.");
                }
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
              {ponto.detalhes?.titulo || "Sem título"}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default Marcadores;
