import React, { useCallback, useMemo } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const TerrasIndigenas = ({ data, onClick }) => {
  const map = useMap();

  // Estilo padrão das terras indígenas
  const defaultStyle = useMemo(
    () => ({
      color: '#FF4500',
      weight: 1,
      fillOpacity: 0.1,
      fillColor: '#FFA500'
    }),
    []
  );

  // Função para determinar o estilo baseado no status da terra indígena
  const style = useCallback(
    (feature) => {
      const isRegularizada = feature.properties.fase_ti === 'Regularizada';
      return {
        ...defaultStyle,
        fillColor: isRegularizada ? '#FFA500' : '#FFD700'
      };
    },
    [defaultStyle]
  );

  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#FF6347',
            fillOpacity: 0.3,
          });
          layer.bringToFront();
        },
        mouseout: (e) => {
          e.target.setStyle(style(feature));
        },
        click: (e) => {
          const layer = e.target;
          // Removido o zoom automático
          // const bounds = layer.getBounds();
          // map.fitBounds(bounds, { padding: [50, 50] });

          // Prepara os dados para o painel
          const terraIndigenaInfo = {
            titulo: feature.properties.terrai_nom,
            tipo: 'terra_indigena',
            etnia: feature.properties.etnia_nome,
            municipio: feature.properties.municipio_,
            uf: feature.properties.uf_sigla,
            superficie: feature.properties.superficie,
            fase: feature.properties.fase_ti,
            modalidade: feature.properties.modalidade,
            reestudo: feature.properties.reestudo_t,
            cr: feature.properties.cr,
            faixa_fron: feature.properties.faixa_fron,
            undadm_nom: feature.properties.undadm_nom,
            undadm_sig: feature.properties.undadm_sig,
            dominio_un: feature.properties.dominio_un,
            data_atual: feature.properties.data_atual,
            terrai_cod: feature.properties.terrai_cod,
            undadm_cod: feature.properties.undadm_cod
          };

          if (onClick) {
            onClick(terraIndigenaInfo);
          }
        }
      });
    },
    [map, style, onClick]
  );

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
};

export default TerrasIndigenas; 