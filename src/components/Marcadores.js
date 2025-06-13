import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion"; 
import { orangeIcon, orangeBairroIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon } from "./CustomIcon"; // Ícones personalizados

const Marcadores = ({ dataPoints, visibility, onClick }) => {
  console.log("Marcadores recebendo dataPoints:", {
    quantidade: dataPoints?.length || 0,
    visibility
  });

  const DataPointType = Object.freeze({
    ASSISTENCIA: { icon: greenIcon, enabled: visibility.assistencia },
    HISTORICO:   { icon: yellowIcon, enabled: visibility.historicos },
    LAZER:       { icon: blueIcon, enabled: visibility.culturais },
    COMUNIDADES: { icon: redIcon, enabled: visibility.comunidades },
    EDUCACAO:    { icon: violetIcon, enabled: visibility.educação },
    RELIGIAO:    { icon: blackIcon, enabled: visibility.religiao },
    BAIRRO:      { icon: orangeBairroIcon, enabled: visibility.bairrosLaranja }, // Pontos dos bairros
  });

  // Variantes para animação inicial e efeito de pulsação
  const markerVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: [1, 1.2, 1] }
  };

  if (!Array.isArray(dataPoints)) {
    console.error("dataPoints não é um array:", dataPoints);
    return null;
  }

  return (
    <>
      {dataPoints.map((ponto, index) => {
        // Log detalhado de cada ponto
        console.log(`Processando ponto ${index}:`, {
          titulo: ponto.titulo,
          tipo: ponto.tipo,
          coordenadas: [ponto.latitude, ponto.longitude]
        });

        if (!ponto.tipo) {
          console.warn(`Ponto sem tipo definido: ${ponto.titulo}`);
          return null;
        }

        let dataPointType;
        const tipoLowerCase = ponto.tipo.toLowerCase();
        console.log(`Tipo do ponto ${index}:`, tipoLowerCase);

        switch (tipoLowerCase) {
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
          case "educacao":
          case "educacao":
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

        // Validação mais rigorosa das coordenadas
        if (!ponto.latitude || !ponto.longitude || 
            isNaN(ponto.latitude) || isNaN(ponto.longitude) ||
            ponto.latitude < -90 || ponto.latitude > 90 ||
            ponto.longitude < -180 || ponto.longitude > 180) {
          console.warn(`Coordenadas inválidas para o ponto: ${ponto.titulo}`, ponto.latitude, ponto.longitude);
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
