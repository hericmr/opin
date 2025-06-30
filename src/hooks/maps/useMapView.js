import { useEffect } from 'react';
import { fromLonLat } from 'ol/proj';

/**
 * Hook para atualizar programaticamente a view do mapa
 * @param {Object} params
 * @param {Object} params.map - Ref do mapa
 * @param {Array} params.center - Novo centro [lng, lat]
 * @param {number} params.zoom - Novo zoom
 */
const useMapView = ({ map, center, zoom }) => {
  useEffect(() => {
    if (!map.current) return;
    const view = map.current.getView();
    view.setCenter(fromLonLat(center));
    view.setZoom(zoom);
  }, [map, center, zoom]);

  /**
   * Função para fazer zoom para uma extensão específica
   * @param {Array} extent - Extensão [minX, minY, maxX, maxY]
   * @param {Object} options - Opções de zoom
   */
  const fitToExtent = (extent, options = {}) => {
    if (!map.current) return;

    const defaultOptions = {
      duration: 800,
      padding: [80, 80, 80, 80],
      maxZoom: 18
    };

    map.current.getView().fit(extent, { ...defaultOptions, ...options });
  };

  /**
   * Função para fazer zoom para um ponto específico
   * @param {Array} point - Ponto [lng, lat]
   * @param {number} zoom - Zoom desejado
   */
  const zoomToPoint = (point, zoom) => {
    if (!map.current) return;

    const view = map.current.getView();
    view.animate({
      center: fromLonLat(point),
      zoom: zoom,
      duration: 800
    });
  };

  return {
    fitToExtent,
    zoomToPoint
  };
};

export default useMapView; 