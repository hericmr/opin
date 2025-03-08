import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion"; 
import { orangeIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon } from "./CustomIcon"; // Ícones personalizados

const Marcadores = ({ dataPoints, visibility, onClick }) => {
  const DataPointType = Object.freeze({
    ASSISTENCIA: { icon: greenIcon, enabled: visibility.assistencia },
    HISTORICO:   { icon: yellowIcon, enabled: visibility.historicos },
    LAZER:       { icon: blueIcon, enabled: visibility.culturais },
    COMUNIDADES: { icon: redIcon, enabled: visibility.comunidades },
    EDUCACAO:    { icon: violetIcon, enabled: visibility.educação },
    RELIGIAO:    { icon: blackIcon, enabled: visibility.religiao },
    BAIRRO:      { icon: orangeIcon, enabled: visibility.bairro },
  });

  // Variantes para animação inicial e efeito de pulsação
  const markerVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: [1, 1.2, 1] }
  };

  return (
    <>
      {dataPoints.map((ponto, index) => {
        if (!ponto.tipo) {
          console.warn(`Ponto sem tipo definido: ${ponto.titulo}`);
          return null;
        }

        let dataPointType;
        switch (ponto.tipo.toLowerCase()) {
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

        if (isNaN(ponto.latitude) || isNaN(ponto.longitude)) {
          console.warn(`Coordenadas inválidas para o ponto: ${ponto.titulo}`);
          return null;
        }

        return (
          <motion.div
            key={index}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.3 }}
            variants={markerVariants}
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
              <Tooltip 
                className="bg-white text-gray-800 font-medium p-2 rounded shadow-md"
                direction="top" 
                offset={[0, -20]} 
                opacity={0.9}
              >
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
