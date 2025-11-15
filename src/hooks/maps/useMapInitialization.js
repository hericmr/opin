import { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';

/**
 * Hook para inicializar o mapa OpenLayers
 * @param {Object} options - Opções de inicialização
 * @param {Object} options.map - Referência do mapa
 * @param {Object} options.mapContainer - Referência do container
 * @param {Array} options.center - Centro inicial [lng, lat]
 * @param {number} options.zoom - Zoom inicial
 * @param {Array} options.layers - Camadas iniciais do mapa
 */
export const useMapInitialization = ({ 
  map, 
  mapContainer, 
  center, 
  zoom, 
  layers = [] 
}) => {
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Criar mapa com configurações ajustadas para mobile
    map.current = new Map({
      target: mapContainer.current,
      layers: layers,
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        maxZoom: 18,
        minZoom: 4,
        enableRotation: false // Desabilitar rotação
      }),
      controls: defaultControls(),
      // IMPORTANTE: Não usar interações padrão para evitar conflitos
      // com nosso sistema de interações customizado
      interactions: [] // Array vazio - sem interações padrão
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [map, mapContainer, center, zoom, layers]);
};

export default useMapInitialization; 