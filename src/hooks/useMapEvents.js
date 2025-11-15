import { useEffect, useRef } from 'react';
import { showClickPulse, flyToAtFractionX } from '../utils/openlayers/effects';
import logger from '../utils/logger';
import { BREAKPOINTS } from '../constants/breakpoints';

export const useMapEvents = (map, mapContainer, onPainelOpen) => {
  const tooltipElement = useRef(null);

  // Event listener para cliques nos marcadores e clusters
  useEffect(() => {
    if (!map) return;

    const handleClick = (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        // Verificar se é um cluster
        if (feature.get('features')) {
          const features = feature.get('features');
          if (features.length === 1) {
            // Cluster com apenas um marcador, abrir painel
            const schoolData = features[0].get('schoolData');
            if (schoolData && onPainelOpen) {
              const coord = features[0].getGeometry()?.getCoordinates();
              if (coord) {
                let fractionX = 0.25; // regra: 25% por padrão
                try {
                  const panelEl = document.querySelector('.mj-panel');
                  const isPanelMaximized = panelEl?.classList?.contains('mj-maximized');
                  if (isPanelMaximized) fractionX = 0.5;
                } catch {}
                flyToAtFractionX(map, coord, { durationMs: 350, fractionX });
                showClickPulse(map, coord);
              }
              onPainelOpen(schoolData);
            }
          } else {
            // Cluster com múltiplos marcadores, fazer zoom inteligente
            logger.debug(`useMapEvents: Cluster clicado com ${features.length} escolas`);
            
            // Calcular a extensão específica do cluster clicado
            const clusterExtent = feature.getGeometry().getExtent();
            
            // Obter o zoom atual
            const currentZoom = map.getView().getZoom();
            
            // Calcular zoom ideal baseado na quantidade de escolas no cluster
            let targetZoom = 12; // Zoom padrão para clusters
            if (features.length > 20) {
              targetZoom = 10; // Zoom menor para clusters muito grandes
            } else if (features.length > 10) {
              targetZoom = 11; // Zoom médio para clusters grandes
            } else if (features.length > 5) {
              targetZoom = 12; // Zoom padrão para clusters médios
            } else {
              targetZoom = 13; // Zoom maior para clusters pequenos
            }
            
            // Garantir que o zoom não seja menor que o atual (evitar zoom out)
            targetZoom = Math.max(targetZoom, currentZoom + 1);
            
            logger.debug(`useMapEvents: Fazendo zoom de ${currentZoom} para ${targetZoom}`);
            
            // Fazer zoom suave para a extensão do cluster
            map.getView().fit(clusterExtent, {
              duration: 800, // Animação mais suave
              padding: [80, 80, 80, 80], // Padding maior para melhor visualização
              maxZoom: targetZoom, // Limitar o zoom máximo
              callback: () => {
                logger.debug(`useMapEvents: Zoom concluído para cluster com ${features.length} escolas`);
              }
            });
          }
        } else {
          // Marcador individual
          const schoolData = feature.get('schoolData');
          if (schoolData && onPainelOpen) {
            const coord = feature.getGeometry()?.getCoordinates();
            if (coord) {
              let fractionX = 0.25; // regra: 25% por padrão
              try {
                const panelEl = document.querySelector('.mj-panel');
                const isPanelMaximized = panelEl?.classList?.contains('mj-maximized');
                if (isPanelMaximized) fractionX = 0.5;
              } catch {}
              flyToAtFractionX(map, coord, { durationMs: 350, fractionX });
              showClickPulse(map, coord);
            }
            onPainelOpen(schoolData);
          }
        }
      }
    };

    map.on('click', handleClick);

    return () => {
      map.un('click', handleClick);
    };
  }, [map, onPainelOpen]);

  // Event listener para hover nos marcadores
  useEffect(() => {
    if (!map || !mapContainer) return;

    // Desabilitar hover automático em mobile - deixar o sistema de interações gerenciar
    if (typeof window !== 'undefined' && window.innerWidth <= BREAKPOINTS.mobile) return;

    const handlePointerMove = (event) => {
      if (tooltipElement.current) {
        tooltipElement.current.remove();
        tooltipElement.current = null;
      }

      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        // Verificar se é um cluster
        if (feature.get('features')) {
          const features = feature.get('features');
          if (features.length === 1) {
            // Cluster com apenas um marcador, mostrar tooltip
            const schoolData = features[0].get('schoolData');
            if (schoolData) {
              tooltipElement.current = createTooltipElement(event, schoolData, mapContainer);
            }
          } else {
            // Cluster com múltiplos marcadores, mostrar tooltip do cluster
            tooltipElement.current = createClusterTooltipElement(event, features.length, mapContainer);
          }
        } else {
          // Marcador individual
          const schoolData = feature.get('schoolData');
          if (schoolData) {
            tooltipElement.current = createTooltipElement(event, schoolData, mapContainer);
          }
        }
      }
    };

    map.on('pointermove', handlePointerMove);

    return () => {
      map.un('pointermove', handlePointerMove);
      if (tooltipElement.current) {
        tooltipElement.current.remove();
        tooltipElement.current = null;
      }
    };
  }, [map, mapContainer]);

  // Função para criar tooltip de marcador individual
  const createTooltipElement = (event, schoolData, container) => {
    const element = document.createElement('div');
    element.className = 'ol-tooltip';
    // Mostrar apenas o nome da escola
    const schoolName = schoolData?.titulo || 'Escola Indígena';
    element.textContent = schoolName;
    
    // Estilo minimalista e claro que combina com o design do site
    element.style.position = 'absolute';
    element.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    element.style.color = '#4B5563'; // Texto mais claro, não preto
    element.style.padding = '6px 10px';
    element.style.borderRadius = '6px';
    element.style.fontSize = '12px';
    element.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    element.style.fontWeight = '400'; // Peso mais leve, não bold
    element.style.maxWidth = '250px';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)';
    element.style.border = '1px solid rgba(5, 150, 105, 0.15)';
    element.style.transition = 'all 0.2s ease';
    element.style.backdropFilter = 'blur(8px)';
    
    const coordinate = event.coordinate;
    const pixel = map.getPixelFromCoordinate(coordinate);
    element.style.left = (pixel[0] + 15) + 'px';
    element.style.top = (pixel[1] - 45) + 'px';
    
    container.appendChild(element);
    return element;
  };

  // Função para criar tooltip de cluster
  const createClusterTooltipElement = (event, count, container) => {
    const element = document.createElement('div');
    element.className = 'ol-tooltip';
    element.textContent = `${count} escolas`;
    
    // Estilo minimalista e claro que combina com o design do site
    element.style.position = 'absolute';
    element.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    element.style.color = '#4B5563'; // Texto mais claro, não preto
    element.style.padding = '6px 10px';
    element.style.borderRadius = '6px';
    element.style.fontSize = '12px';
    element.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    element.style.fontWeight = '400'; // Peso mais leve, não bold
    element.style.maxWidth = '200px';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)';
    element.style.border = '1px solid rgba(5, 150, 105, 0.15)';
    element.style.transition = 'all 0.2s ease';
    element.style.backdropFilter = 'blur(8px)';
    
    const coordinate = event.coordinate;
    const pixel = map.getPixelFromCoordinate(coordinate);
    element.style.left = (pixel[0] + 15) + 'px';
    element.style.top = (pixel[1] - 45) + 'px';
    
    container.appendChild(element);
    return element;
  };
}; 