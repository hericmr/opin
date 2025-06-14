import React, { useMemo, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

const EstadoSP = ({ data }) => {
  useEffect(() => {
    if (data) {
      console.log("EstadoSP: Dados recebidos:", data);
    }
  }, [data]);

  // Estilo para criar o efeito de contorno preto com escurecimento interno
  const defaultStyle = useMemo(
    () => ({
      color: '#000000',   // Linha preta
      weight: 2,          // Espessura da linha
      fillColor: '#000000', // Preto sólido
      fillOpacity: 0.3,   // 30% de opacidade para escurecer o mapa
      dashArray: '',      // Linha contínua
      zIndex: 999,        // Mantém acima da base
      interactive: false  // Desativa interatividade para manter fixo
    }),
    []
  );

  if (!data) return null;

  return (
    <GeoJSON 
      data={data} 
      style={defaultStyle}
      interactive={false} // Garante que não há interatividade
    />
  );
};

export default EstadoSP; 