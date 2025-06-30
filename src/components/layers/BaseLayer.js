import { useEffect, useRef } from 'react';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

/**
 * Componente para camada base do mapa (satélite)
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.map - Referência do mapa OpenLayers
 * @param {string} props.type - Tipo de camada base ('satellite', 'street', 'terrain')
 */
const BaseLayer = ({ map, type = 'satellite' }) => {
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map || layerRef.current) return;

    // Criar camada base baseada no tipo
    let baseLayer;
    
    switch (type) {
      case 'satellite':
        baseLayer = new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: '© <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
            wrapX: false,
            tilePixelRatio: 1,
            tileSize: 256
          }),
          preload: 1,
          useInterimTilesOnError: false
        });
        break;
      
      case 'street':
        baseLayer = new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          })
        });
        break;
      
      case 'terrain':
        baseLayer = new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attributions: '© <a href="https://opentopomap.org/">OpenTopoMap</a> contributors',
            maxZoom: 17
          })
        });
        break;
      
      default:
        baseLayer = new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: '© <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
            wrapX: false,
            tilePixelRatio: 1,
            tileSize: 256
          }),
          preload: 1,
          useInterimTilesOnError: false
        });
    }

    // Adicionar camada ao mapa
    map.addLayer(baseLayer);
    layerRef.current = baseLayer;

    // Cleanup
    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, type]);

  return null; // Componente não renderiza nada visualmente
};

export default BaseLayer; 