import React, { useEffect, useRef, useCallback, forwardRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { createEstadoSPStyle } from '../../utils/openlayers/layerStyles';
import { PROJECTION_CONFIG } from '../../utils/mapConfig';

/**
 * Componente OpenLayersEstadoSP - Substitui completamente o EstadoSP.js do Leaflet
 * Implementa camada GeoJSON de fundo do estado de São Paulo (não-interativa)
 */
const OpenLayersEstadoSP = forwardRef(({ 
  data,
  showEstadoSP = true,
  map,
  className = "h-full w-full"
}, ref) => {
  // Refs para controle da camada
  const vectorSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);

  /**
   * Inicializa a camada do estado de São Paulo
   */
  const initializeLayer = useCallback(() => {
    if (!map || !data) return;

    // Verificar se os dados têm a estrutura correta
    if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
      console.warn('[OpenLayersEstadoSP] Dados inválidos ou vazios:', data);
      return;
    }

    try {
      // Criar formato GeoJSON com projeções corretas
      const geoJSONFormat = new GeoJSON({
        dataProjection: PROJECTION_CONFIG.sirgas2000 || PROJECTION_CONFIG.dataProjection,
        featureProjection: PROJECTION_CONFIG.featureProjection
      });

      // Ler features do GeoJSON
      const geoJSONFeatures = geoJSONFormat.readFeatures(data);

      // Criar fonte vetorial
      vectorSourceRef.current = new VectorSource({
        features: geoJSONFeatures
      });

      // Criar camada vetorial (não-interativa, apenas visual)
      vectorLayerRef.current = new VectorLayer({
        source: vectorSourceRef.current,
        style: (feature) => createEstadoSPStyle(feature, false),
        zIndex: 5, // Camada de fundo com zIndex baixo
        interactive: false // Desabilitar interações
      });

      // Adicionar camada ao mapa
      map.addLayer(vectorLayerRef.current);

      console.log(`[OpenLayersEstadoSP] Camada criada com ${geoJSONFeatures.length} features`);

    } catch (error) {
      console.error('[OpenLayersEstadoSP] Erro ao criar camada:', error);
    }

  }, [map, data]);

  // Inicializar camada quando componente montar
  useEffect(() => {
    if (map && data && showEstadoSP) {
      initializeLayer();
    }

    return () => {
      // Cleanup
      if (vectorLayerRef.current && map) {
        map.removeLayer(vectorLayerRef.current);
      }
    };
  }, [map, data, showEstadoSP, initializeLayer]);

  // Se não deve mostrar estado SP, não renderizar nada
  if (!showEstadoSP || !data) {
    return null;
  }

  return (
    <div className={className}>
      {/* Este componente não renderiza elementos visuais diretamente,
          apenas gerencia a camada GeoJSON de fundo do OpenLayers */}
    </div>
  );
});

export default OpenLayersEstadoSP;