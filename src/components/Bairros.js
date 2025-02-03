import React, { useCallback, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const Bairros = ({ data }) => {
  const map = useMap();

  // Define a paleta de cores com base na densidade
  const getColor = useCallback((density) => {
    return density > 1000
      ? '#00441b'
      : density > 500
      ? '#006d2c'
      : density > 200
      ? '#238b45'
      : density > 100
      ? '#41ab5d'
      : '#74c476';
  }, []);

  // Estilo padrão dos bairros
  const defaultStyle = useMemo(
    () => ({
      color: '#ffffff',
      weight: 1,
      fillOpacity: 0.2,
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
            color: '#00441b',
            fillOpacity: 0.9,
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
            color: '#000000',
            fillOpacity: 0.8,
          });
        },
      });
    },
    [map, style]
  );

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
};

export default Bairros;
