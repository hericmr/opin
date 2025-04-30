import React, { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';

const EstadoSP = ({ data }) => {
  // Estilo padrão do estado
  const defaultStyle = useMemo(
    () => ({
      color: '#3B82F6',
      weight: 2,
      fillOpacity: 0.1,
      fillColor: '#93C5FD',
      zIndex: 1 // Garante que fique abaixo das outras camadas
    }),
    []
  );

  return <GeoJSON data={data} style={defaultStyle} />;
};

export default EstadoSP; 