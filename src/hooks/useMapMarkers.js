import { useEffect, useRef } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { findNearbyPairs } from '../utils/mapUtils';
import logger from '../utils/logger';

export const useMapMarkers = (map, dataPoints, showMarcadores) => {
  const vectorSourceRef = useRef(null);
  const clusterSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);

  // Atualizar marcadores quando dataPoints mudar
  useEffect(() => {
    if (!map || !vectorSourceRef.current || !dataPoints || !showMarcadores) return;

    // Limpar marcadores existentes
    vectorSourceRef.current.clear();

    // Filtrar pontos válidos
    const pontosValidos = dataPoints.filter(point => {
      if (!point.latitude || !point.longitude) return false;
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      return !isNaN(lat) && !isNaN(lng) && 
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180;
    });

    // Encontrar pares de marcadores próximos
    const nearbyPairs = findNearbyPairs(pontosValidos);

    logger.debug(`useMapMarkers: Processando ${pontosValidos.length} marcadores válidos`);
    logger.debug(`useMapMarkers: Encontrados ${nearbyPairs.length} pares próximos`);

    // Adicionar novos marcadores
    pontosValidos.forEach((point, index) => {
      if (point.latitude && point.longitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([point.longitude, point.latitude]))
        });
        feature.set('schoolData', point);
        
        // Marcar se este marcador faz parte de um par próximo
        const pairIndex = nearbyPairs.findIndex(pair => pair.includes(index));
        if (pairIndex !== -1) {
          feature.set('isNearbyPair', true);
          feature.set('pairIndex', pairIndex);
        }
        
        vectorSourceRef.current.addFeature(feature);
      }
    });

    logger.debug(`useMapMarkers: Adicionados ${pontosValidos.length} marcadores com clustering inteligente`);
  }, [map, dataPoints, showMarcadores]);

  return {
    vectorSourceRef,
    clusterSourceRef,
    vectorLayerRef
  };
}; 