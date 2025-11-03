import { useCallback, useEffect } from 'react';
import { showClickPulse, flyTo } from '../../utils/openlayers/effects';

/**
 * Hook para gerenciar interações com marcadores
 * @param {Object} options - Opções de interação
 * @param {Function} options.onPainelOpen - Callback para abrir painel
 * @param {Object} options.map - Referência do mapa
 * @param {boolean} options.isMobileDevice - Se é dispositivo mobile
 */
export const useMarkerInteractions = ({ onPainelOpen, map, isMobileDevice }) => {
  // Função para lidar com clique em marcador individual
  const handleMarkerClick = useCallback((feature, event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    const schoolData = feature.get('schoolData');
    if (schoolData) {
      const coord = feature.getGeometry()?.getCoordinates();
      if (map && coord) {
        flyTo(map, coord, { durationMs: 350 });
        showClickPulse(map, coord);
      }
      onPainelOpen?.(schoolData);
    }
  }, [onPainelOpen]);

  // Função para lidar com clique em cluster
  const handleClusterClick = useCallback((feature, event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    const features = feature.get('features');
    if (features.length === 1) {
      // Cluster com apenas um marcador
      const schoolData = features[0].get('schoolData');
      if (schoolData) {
        onPainelOpen?.(schoolData);
      }
    } else {
      // Cluster com múltiplos marcadores, fazer zoom inteligente
      const clusterExtent = feature.getGeometry().getExtent();
      const currentZoom = map.getView().getZoom();
      let targetZoom = 12;
      if (features.length > 20) {
        targetZoom = 10;
      } else if (features.length > 10) {
        targetZoom = 11;
      } else if (features.length > 5) {
        targetZoom = 12;
      } else {
        targetZoom = 13;
      }
      targetZoom = Math.max(targetZoom, currentZoom + 1);
      map.getView().fit(clusterExtent, {
        duration: 800,
        padding: [80, 80, 80, 80],
        maxZoom: targetZoom
      });
    }
  }, [onPainelOpen, map]);

  // Adicionar event listeners para cliques nos marcadores e clusters
  useEffect(() => {
    if (!map) return;

    const handleClick = (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        // Verificar se é um cluster
        if (feature.get('features')) {
          handleClusterClick(feature, event);
        } else {
          // Marcador individual
          handleMarkerClick(feature, event);
        }
      }
    };

    map.on('click', handleClick);

    return () => {
      if (map) {
        map.un('click', handleClick);
      }
    };
  }, [map, handleMarkerClick, handleClusterClick]);

  return {
    handleMarkerClick,
    handleClusterClick
  };
};

export default useMarkerInteractions; 