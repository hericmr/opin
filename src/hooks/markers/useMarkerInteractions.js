import { useCallback, useEffect, useState } from 'react';
import { isMobile } from '../../utils/mobileUtils';

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

  // Função para gerenciar cliques no mobile
  const handleMobileClick = useCallback((feature, schoolData, event) => {
    if (!isMobileDevice) {
      // Desktop: abrir painel diretamente
      onPainelOpen?.(schoolData);
      return;
    }

    // Mobile: sistema de dois cliques
    if (lastClickedFeature === feature) {
      // Segundo clique no mesmo marcador
      setLastClickedFeature(null);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }
      onPainelOpen?.(schoolData);
    } else {
      // Primeiro clique ou clique em marcador diferente
      
      // Limpar clique anterior
      if (lastClickedFeature) {
        setLastClickedFeature(null);
      }
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      // Mostrar tooltip temporário
      const tooltipElement = document.createElement('div');
      tooltipElement.className = 'mobile-tooltip';
      tooltipElement.textContent = schoolData.titulo || 'Escola Indígena';
      tooltipElement.style.position = 'absolute';
      tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      tooltipElement.style.color = 'white';
      tooltipElement.style.padding = '8px 12px';
      tooltipElement.style.borderRadius = '6px';
      tooltipElement.style.fontSize = '14px';
      tooltipElement.style.fontFamily = 'Arial, sans-serif';
      tooltipElement.style.fontWeight = '500';
      tooltipElement.style.maxWidth = '250px';
      tooltipElement.style.whiteSpace = 'nowrap';
      tooltipElement.style.overflow = 'hidden';
      tooltipElement.style.textOverflow = 'ellipsis';
      tooltipElement.style.zIndex = '1000';
      tooltipElement.style.pointerEvents = 'none';
      tooltipElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      tooltipElement.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      
      if (map && event.coordinate) {
        const pixel = map.getPixelFromCoordinate(event.coordinate);
        if (pixel) {
          tooltipElement.style.left = (pixel[0] + 10) + 'px';
          tooltipElement.style.top = (pixel[1] - 10) + 'px';
          
          const mapContainer = map.getTargetElement();
          if (mapContainer) {
            mapContainer.appendChild(tooltipElement);

            // Auto-remove after 2 seconds
            setTimeout(() => {
              if (tooltipElement.parentNode) {
                tooltipElement.remove();
              }
            }, 2000);
          }
        }
      }

      // Configurar para segundo clique
      setLastClickedFeature(feature);
      const timeout = setTimeout(() => {
        setLastClickedFeature(null);
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  }, [lastClickedFeature, clickTimeout, onPainelOpen, map, isMobileDevice]);

  // Função para lidar com clique em marcador individual
  const handleMarkerClick = useCallback((feature, event) => {
    const schoolData = feature.get('schoolData');
    if (schoolData) {
      handleMobileClick(feature, schoolData, event);
    }
  }, [handleMobileClick]);

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
      
      // Calcular zoom ideal baseado na quantidade de escolas no cluster
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
      
      // Garantir que o zoom não seja menor que o atual
      targetZoom = Math.max(targetZoom, currentZoom + 1);
      
      // Fazer zoom suave para a extensão do cluster
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