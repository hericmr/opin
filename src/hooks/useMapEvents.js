import { useEffect, useRef } from 'react';
import { toLonLat } from 'ol/proj';
import { createTooltipHTML, createClusterTooltipHTML } from '../utils/mapUtils';

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
              onPainelOpen(schoolData);
            }
          } else {
            // Cluster com múltiplos marcadores, fazer zoom inteligente
            console.log(`useMapEvents: Cluster clicado com ${features.length} escolas`);
            
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
            
            console.log(`useMapEvents: Fazendo zoom de ${currentZoom} para ${targetZoom}`);
            
            // Fazer zoom suave para a extensão do cluster
            map.getView().fit(clusterExtent, {
              duration: 800, // Animação mais suave
              padding: [80, 80, 80, 80], // Padding maior para melhor visualização
              maxZoom: targetZoom, // Limitar o zoom máximo
              callback: () => {
                console.log(`useMapEvents: Zoom concluído para cluster com ${features.length} escolas`);
              }
            });
          }
        } else {
          // Marcador individual
          const schoolData = feature.get('schoolData');
          if (schoolData && onPainelOpen) {
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
    element.textContent = createTooltipHTML(schoolData);
    element.style.position = 'absolute';
    element.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    element.style.color = 'white';
    element.style.padding = '6px 10px';
    element.style.borderRadius = '4px';
    element.style.fontSize = '13px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontWeight = 'normal';
    element.style.maxWidth = '200px';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    element.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
    
    const coordinate = event.coordinate;
    const pixel = map.getPixelFromCoordinate(coordinate);
    element.style.left = (pixel[0] + 10) + 'px';
    element.style.top = (pixel[1] - 10) + 'px';
    
    container.appendChild(element);
    return element;
  };

  // Função para criar tooltip de cluster
  const createClusterTooltipElement = (event, count, container) => {
    const element = document.createElement('div');
    element.className = 'ol-tooltip';
    element.textContent = createClusterTooltipHTML(count);
    element.style.position = 'absolute';
    element.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    element.style.color = 'white';
    element.style.padding = '6px 10px';
    element.style.borderRadius = '4px';
    element.style.fontSize = '13px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontWeight = 'normal';
    element.style.maxWidth = '200px';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    element.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
    
    const coordinate = event.coordinate;
    const pixel = map.getPixelFromCoordinate(coordinate);
    element.style.left = (pixel[0] + 10) + 'px';
    element.style.top = (pixel[1] - 10) + 'px';
    
    container.appendChild(element);
    return element;
  };
}; 