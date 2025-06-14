import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { violetIcon } from "./CustomIcon"; // Mantendo apenas o ícone violeta para escolas

const Marcadores = ({ dataPoints, visibility, onClick }) => {
  // Log simplificado para debug
  if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
    console.warn("Marcadores: Nenhum ponto de dados válido recebido");
    return null;
  }

  // Configuração do ícone para escolas indígenas
  const escolaIcon = violetIcon;

  return (
    <>
      {dataPoints.map((ponto, index) => {
        // Validação básica do ponto
        if (!ponto.titulo || !ponto.latitude || !ponto.longitude) {
          return null;
        }

        // Validação das coordenadas
        const lat = parseFloat(ponto.latitude);
        const lng = parseFloat(ponto.longitude);
        
        if (
          isNaN(lat) || isNaN(lng) ||
          lat < -90 || lat > 90 ||
          lng < -180 || lng > 180
        ) {
          return null;
        }

        // Verifica se o ponto deve ser visível
        if (!visibility.educacao) {
          return null;
        }

        return (
          <Marker
            key={`${ponto.id || index}`}
            position={[lat, lng]}
            icon={escolaIcon}
            eventHandlers={{
              click: () => onClick?.(ponto)
            }}
          >
            <Tooltip 
              className="bg-white/95 text-gray-800 text-sm font-medium px-3 py-1.5 rounded shadow-sm border border-gray-100"
              direction="top" 
              offset={[0, -10]} 
              opacity={1}
              permanent={false}
            >
              {ponto.titulo}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default React.memo(Marcadores);
