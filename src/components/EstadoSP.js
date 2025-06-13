import React, { useMemo, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

const EstadoSP = ({ data }) => {
  useEffect(() => {
    if (data) {
      console.log("EstadoSP: Dados recebidos:", {
        type: data.type,
        features: data.features ? data.features.length : 0,
        properties: data.properties,
        crs: data.crs
      });
    } else {
      console.warn("EstadoSP: Nenhum dado recebido");
    }
  }, [data]);

  // Estilo padrão do estado
  const defaultStyle = useMemo(
    () => ({
      color: '#1E3A8A', // Cor da borda (azul escuro)
      weight: 2, // Espessura da borda
      fillOpacity: 0.1, // Transparência do preenchimento
      fillColor: '#3B82F6', // Cor do preenchimento (azul)
      dashArray: '3', // Linha tracejada
      zIndex: 1 // Garante que fique abaixo das outras camadas
    }),
    []
  );

  // Estilo quando o mouse passa por cima
  const hoverStyle = {
    fillOpacity: 0.3,
    weight: 3,
    dashArray: '1',
    color: '#1E40AF'
  };

  if (!data) {
    console.warn("EstadoSP: Nenhum dado recebido");
    return null;
  }

  if (!data.type || data.type !== 'FeatureCollection') {
    console.error("EstadoSP: Formato de GeoJSON inválido. Esperado FeatureCollection, recebido:", data.type);
    return null;
  }

  if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
    console.error("EstadoSP: GeoJSON sem features válidas");
    return null;
  }

  return (
    <GeoJSON 
      data={data} 
      style={defaultStyle}
      onEachFeature={(feature, layer) => {
        if (feature && feature.properties) {
          layer.bindTooltip(feature.properties.name || 'São Paulo', {
            className: 'bg-white text-gray-800 font-medium p-2 rounded shadow-md',
            sticky: true
          });
        }
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle(hoverStyle);
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle(defaultStyle);
          }
        });
      }}
    />
  );
};

export default EstadoSP; 