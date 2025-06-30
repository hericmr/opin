import { useEffect } from 'react';
import { toLonLat } from 'ol/proj';

/**
 * Hook para escutar eventos de movimentação e zoom do mapa
 * @param {Object} params
 * @param {Object} params.map - Ref do mapa
 * @param {Function} params.setMapInfo - Setter para atualizar info do mapa
 */
const useMapEvents = ({ map, setMapInfo }) => {
  useEffect(() => {
    if (!map.current) return;
    const view = map.current.getView();
    const handleMove = () => {
      const center = toLonLat(view.getCenter());
      const zoom = view.getZoom();
      setMapInfo({ lng: center[0], lat: center[1], zoom });
    };
    map.current.on('moveend', handleMove);
    return () => {
      map.current.un('moveend', handleMove);
    };
  }, [map, setMapInfo]);
};

export default useMapEvents; 