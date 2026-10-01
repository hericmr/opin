import { useEffect, useRef } from 'react';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import VectorLayer from 'ol/layer/Vector';
import { findNearbyPairs } from '../utils/markers/proximityUtils';
import { useMarkerStyles } from './markers/useMarkerStyles';
import { MAP_CONFIG } from '../utils/mapConfig';
import logger from '../utils/logger';

/**
 * Hook auto-contido para a camada de marcadores das escolas.
 *
 * Antes este hook dependia de um `vectorSourceRef.current` que nunca era
 * inicializado por ninguém, então o efeito sempre caía no early-return e
 * nenhum marcador era adicionado ao mapa (as escolas não apareciam). Agora o
 * hook cria sua própria VectorSource + ClusterSource + VectorLayer e chama
 * `map.addLayer(...)`, no mesmo padrão de `useMapLayers` (que já funciona para
 * as terras indígenas).
 */
export const useMapMarkers = (map, dataPoints, showMarcadores, showNomesEscolas = false) => {
  const vectorSourceRef = useRef(null);
  const clusterSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);

  const { createClusterStyle } = useMarkerStyles({ showNomesEscolas });

  // Criar a camada de marcadores e adicioná-la ao mapa.
  // Recriada quando `showNomesEscolas` muda, pois o estilo (createClusterStyle)
  // depende desse valor.
  useEffect(() => {
    if (!map) return;

    const vectorSource = new VectorSource();
    const clusterSource = new ClusterSource({
      distance: MAP_CONFIG.clusterDistance,
      minDistance: MAP_CONFIG.clusterMinDistance,
      source: vectorSource,
      geometryFunction: (feature) => {
        const geometry = feature.getGeometry();
        return geometry && geometry.getType() === 'Point' ? geometry : null;
      }
    });

    const vectorLayer = new VectorLayer({
      source: clusterSource,
      style: createClusterStyle,
      zIndex: 100,
      name: 'escolas-marcadores'
    });

    map.addLayer(vectorLayer);

    vectorSourceRef.current = vectorSource;
    clusterSourceRef.current = clusterSource;
    vectorLayerRef.current = vectorLayer;

    logger.debug('useMapMarkers: Camada de marcadores adicionada ao mapa');

    return () => {
      if (map && vectorLayer) {
        map.removeLayer(vectorLayer);
      }
      vectorSourceRef.current = null;
      clusterSourceRef.current = null;
      vectorLayerRef.current = null;
    };
  }, [map, createClusterStyle]);

  // Popular/atualizar os marcadores quando os dados ou a visibilidade mudarem.
  useEffect(() => {
    if (!map || !vectorSourceRef.current) return;

    // Limpar marcadores existentes
    vectorSourceRef.current.clear();

    // Se os marcadores estão ocultos, deixa a fonte vazia.
    if (!showMarcadores || !dataPoints) return;

    // Filtrar pontos com coordenadas válidas
    const pontosValidos = dataPoints.filter(point => {
      if (!point || point.latitude == null || point.longitude == null) return false;
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      return !isNaN(lat) && !isNaN(lng) &&
             lat >= -90 && lat <= 90 &&
             lng >= -180 && lng <= 180;
    });

    // Encontrar pares de marcadores próximos (para destaque visual)
    const nearbyPairs = findNearbyPairs(pontosValidos);

    logger.debug(`useMapMarkers: Processando ${pontosValidos.length} marcadores válidos`);
    logger.debug(`useMapMarkers: Encontrados ${nearbyPairs.length} pares próximos`);

    pontosValidos.forEach((point, index) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([parseFloat(point.longitude), parseFloat(point.latitude)]))
      });
      feature.set('schoolData', point);

      const pairIndex = nearbyPairs.findIndex(pair => pair.includes(index));
      if (pairIndex !== -1) {
        feature.set('isNearbyPair', true);
        feature.set('pairIndex', pairIndex);
      }

      vectorSourceRef.current.addFeature(feature);
    });

    logger.debug(`useMapMarkers: Adicionados ${pontosValidos.length} marcadores`);
  }, [map, dataPoints, showMarcadores]);

  return {
    vectorSourceRef,
    clusterSourceRef,
    vectorLayerRef
  };
};
