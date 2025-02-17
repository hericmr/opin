import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion"; 
import { orangeIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon } from "./CustomIcon"; // Ícones personalizados

const Marcadores = ({ dataPoints, visibility, onClick }) => {
  
  const DataPointType = Object.freeze({
    ASSISTENCIA: { icon: greenIcon , enabled: visibility.assistencia },
    HISTORICO:   { icon: yellowIcon, enabled: visibility.historicos },
    LAZER:       { icon: blueIcon  , enabled: visibility.culturais },
    COMUNIDADES: { icon: redIcon   , enabled: visibility.comunidades },
    EDUCACAO:    { icon: violetIcon, enabled: visibility.educação },
    RELIGIAO:    { icon: blackIcon , enabled: visibility.religiao },
    BAIRRO:      { icon: orangeIcon , enabled: visibility.bairro },
  });

  return (
    <>
      {
      dataPoints.map((ponto, index) => {
        
        let dataPointType;
        switch (ponto.tipo) {
          case "assistencia":
            dataPointType = DataPointType.ASSISTENCIA;
            break;
          case "historico":
            dataPointType = DataPointType.HISTORICO;
            break;
          case "lazer":
            dataPointType = DataPointType.LAZER;
            break;
          case "comunidades":
            dataPointType = DataPointType.COMUNIDADES;
            break;
          case "educação":
            dataPointType = DataPointType.EDUCACAO;
            break;
          case "religiao":
            dataPointType = DataPointType.RELIGIAO;
            break;
          case "bairro":
            dataPointType = DataPointType.BAIRRO;
            break;
          default:
            console.warn(`Tipo desconhecido: ${ponto.tipo}, usando ícone padrão.`);
            return null;
        }

        if (!dataPointType.enabled) return null;

        return (
          <motion.div
            key={index}
            className="animate-pulse"
            animate={{ scale: [1, 1.2, 1] }} // Efeito de pulsação
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Marker
              position={[ponto.latitude, ponto.longitude]}
              icon={dataPointType.icon}
              eventHandlers={{
                click: () => {
                  if (onClick) {
                    onClick(ponto);
                  } else {
                    console.warn("Nenhum handler onClick definido.");
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                {ponto.titulo || "Sem título"}
              </Tooltip>
            </Marker>
          </motion.div>
        );
      })}
    </>
  );
};

export default Marcadores;
