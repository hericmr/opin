import { useCallback, useEffect, useState } from 'react';
import { isMobile, MobileInteractionManager } from '../../utils/mobileUtils';

/**
 * Hook para gerenciar interações com marcadores
 * @param {Object} options - Opções de interação
 * @param {Function} options.onPainelOpen - Callback para abrir painel
 * @param {Object} options.map - Referência do mapa
 * @param {boolean} options.isMobileDevice - Se é dispositivo mobile
 */
export const useMarkerInteractions = ({ onPainelOpen, map, isMobileDevice }) => {
  const [lastClickedFeature, setLastClickedFeature] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  // Instância do gerenciador de interações mobile
  const mobileInteractionManager = useMemo(() => new MobileInteractionManager(), []);

  // Função para gerenciar cliques
  const handleFeatureClick = useCallback((feature, schoolData) => {
    mobileInteractionManager.handleClick(
      feature,
      () => {
        // Primeiro clique: mostrar tooltip
        // (se necessário, implementar tooltip)
      },
      () => {
        // Segundo clique: abrir painel
        onPainelOpen?.(schoolData);
      },
      isMobileDevice
    );
  }, [onPainelOpen, isMobileDevice, mobileInteractionManager]);

  // Função para lidar com clique em marcador individual
  const handleMarkerClick = useCallback((feature, event) => {
    const schoolData = feature.get('schoolData');
    if (schoolData) {
      handleFeatureClick(feature, schoolData);
    }
  }, [handleFeatureClick]);

  // Função para lidar com clique em cluster
  const handleClusterClick = useCallback((feature, event) => {
    const features = feature.get('features');
    if (features.length === 1) {
      // Cluster com apenas um marcador
      const schoolData = features[0].get('schoolData');
      if (schoolData) {
        handleMobileClick(feature, schoolData, event);
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
  }, [handleMobileClick, map]);

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

  // Cleanup de timeouts
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  return {
    handleMarkerClick,
    handleClusterClick,
    handleMobileClick
  };
};

export default useMarkerInteractions; 