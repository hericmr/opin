import React, { useEffect, useRef, useMemo } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { GeoJSON } from 'ol/format';

const OpenLayersEstadoSP = ({ data, visible = true }) => {
  const layerRef = useRef(null);
  const sourceRef = useRef(null);

  // Estilo para criar o efeito de contorno preto com escurecimento interno
  const defaultStyle = useMemo(() => {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.3)' // Preto sólido com 30% de opacidade para escurecer o mapa
      }),
      stroke: new Stroke({
        color: '#000000', // Linha preta
        width: 2 // Espessura da linha
      })
    });
  }, []);

  // Inicializar camada
  useEffect(() => {
    if (!data) {
      console.warn("OpenLayersEstadoSP: Nenhum dado recebido");
      return;
    }

    // Criar fonte vetorial
    sourceRef.current = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
      })
    });

    // Criar camada vetorial
    layerRef.current = new VectorLayer({
      source: sourceRef.current,
      style: defaultStyle,
      visible: visible,
      zIndex: 999, // Mantém acima da base
      interactive: false // Desativa interatividade para manter fixo
    });

    return () => {
      if (layerRef.current) {
        layerRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current = null;
      }
    };
  }, [data, defaultStyle, visible]);

  return null; // Este componente não renderiza nada, apenas gerencia a camada
};

export default OpenLayersEstadoSP; 