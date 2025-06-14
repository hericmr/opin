import React, { useCallback, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const Bairros = ({ data }) => {
  const map = useMap();

  // Define a paleta de cores com tons naturais e terrosos
  const getColor = useCallback((density) => {
    return density > 1000
      ? '#2d3436'    // Cinza escuro (pedra)
      : density > 500
      ? '#636e72'    // Cinza médio (rocha)
      : density > 200
      ? '#74b9ff'    // Azul suave (água)
      : density > 100
      ? '#81ecec'    // Verde-água claro (lagoa)
      : '#ddd6ba';   // Bege claro (areia/terra)
  }, []);

  // Estilo padrão dos bairros com cores mais naturais
  const defaultStyle = useMemo(
    () => ({
      color: '#a0956b',  // Marrom terra para as bordas
      weight: 1,
      fillOpacity: 0.3,
    }),
    []
  );

  // Função de estilo otimizada
  const style = useCallback(
    (feature) => ({
      ...defaultStyle,
      fillColor: getColor(feature.properties.DENSITY || 0),
    }),
    [defaultStyle, getColor]
  );

  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.bindPopup(`<strong>Bairro:</strong> ${feature.properties.NOME}<br/>`);
      
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#6c5ce7',  // Roxo suave para hover
            fillOpacity: 0.7,
          });
          layer.bringToFront();
        },
        mouseout: (e) => {
          e.target.setStyle(style(feature));
        },
        click: (e) => {
          const layer = e.target;
          const bounds = layer.getBounds();
          map.fitBounds(bounds, { padding: [50, 50] });
          
          // Restaura estilo de todos os bairros antes de destacar o selecionado
          e.target._map.eachLayer((l) => {
            if (l instanceof L.Path && l !== layer) {
              l.setStyle(style(l.feature));
            }
          });
          
          layer.setStyle({
            weight: 4,
            color: '#2d3436',  // Cinza escuro para seleção
            fillOpacity: 0.6,
          });
        },
      });
    },
    [map, style]
  );

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
};

export default Bairros;