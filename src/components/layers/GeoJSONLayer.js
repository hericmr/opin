import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';

/**
 * Componente para camada GeoJSON genérica
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.map - Referência do mapa OpenLayers
 * @param {Object} props.data - Dados GeoJSON
 * @param {Function} props.style - Função de estilo para as features
 * @param {number} props.zIndex - Índice Z da camada
 * @param {boolean} props.interactive - Se a camada é interativa
 * @param {Function} props.onFeatureClick - Callback para clique em features
 */
const GeoJSONLayer = ({ 
  map, 
  data, 
  style, 
  zIndex = 10, 
  interactive = false,
  onFeatureClick 
}) => {
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map || !data || layerRef.current) return;

    try {
      // Verificar se os dados têm a estrutura correta
      if (!data.features || data.features.length === 0) {
        return;
      }

      // Criar formato GeoJSON
      const geoJSONFormat = new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });

      // Ler features do GeoJSON
      const features = geoJSONFormat.readFeatures(data);

      // Criar camada vetorial
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: features
        }),
        style: style,
        zIndex: zIndex,
        interactive: interactive
      });

      // Adicionar camada ao mapa
      map.addLayer(vectorLayer);
      layerRef.current = vectorLayer;

      // Adicionar event listener se for interativa
      if (interactive && onFeatureClick) {
        const handleClick = (event) => {
          const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
          if (feature && vectorLayer.getSource().getFeatures().includes(feature)) {
            onFeatureClick(feature, event);
          }
        };

        map.on('click', handleClick);

        // Cleanup do event listener
        return () => {
          if (map) {
            map.un('click', handleClick);
          }
        };
      }

    } catch (error) {
      console.error('Erro ao processar camada GeoJSON:', error);
    }

    // Cleanup da camada
    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, data, style, zIndex, interactive, onFeatureClick]);

  return null; // Componente não renderiza nada visualmente
};

export default GeoJSONLayer; 