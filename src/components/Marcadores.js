import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion"; // Biblioteca de animação
import { redIcon, blueIcon, greenIcon, yellowIcon } from "./CustomIcon"; // Ícones personalizados

const Marcadores = ({ pontos, onClick }) => {
  if (!pontos || pontos.length === 0) {
    console.warn("Nenhum ponto para exibir."); // Log para depuração
    return null;
  }

  return (
    <>
      {pontos.map((ponto, index) => {
        let icon;
        switch (ponto.tipo) {
          case "assistencia":
            icon = greenIcon;
            break;
          case "historico":
            icon = yellowIcon;
            break;
          case "cultura":
            icon = redIcon;
            break;
          default:
            console.warn(`Tipo desconhecido: ${ponto.tipo}, usando ícone padrão.`);
            icon = blueIcon;
        }

        return (
          <motion.div
            key={index}
            className="animate-pulse"
            animate={{ scale: [1, 1.2, 1] }} // Efeito de pulsação
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Marker
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
          </motion.div>
        );
      })}
    </>
  );
};

export default Marcadores;
