import React, { useEffect, useRef, useCallback, useMemo, forwardRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { 
  createTerrasIndigenasStyle,
  applySelectionStyle 
} from '../../utils/openlayers/layerStyles';
import { createGeoJSONInteractions } from '../../utils/openlayers/interactions';
import { MAP_CONFIG, PROJECTION_CONFIG } from '../../utils/mapConfig';
import { isMobile } from '../../utils/mobileUtils';

/**
 * Componente OpenLayersTerrasIndigenas - Substitui completamente o TerrasIndigenas.js do Leaflet
 * Implementa camada GeoJSON de terras indígenas com estilos dinâmicos e interações
 */
const OpenLayersTerrasIndigenas = forwardRef(({ 
  data,
  onPainelOpen,
  showTerrasIndigenas = true,
  map,
  className = "h-full w-full"
}, ref) => {
  // Refs para controle da camada
  const vectorSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const interactionsRef = useRef(null);
  
  // Estados para controle de interações
  const [, setHoveredFeature] = React.useState(null);
  const [selectedFeature, setSelectedFeature] = React.useState(null);
  // const [features, setFeatures] = React.useState([]); // Removido - não utilizado

  // Verificar se é mobile
  const isMobileDevice = useMemo(() => isMobile(), []);

  /**
   * Inicializa a camada de terras indígenas
   */
  const initializeLayer = useCallback(() => {
    if (!map || !data) return;

    // Verificar se os dados têm a estrutura correta
    if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
      console.warn('[OpenLayersTerrasIndigenas] Dados inválidos ou vazios:', data);
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
      // setFeatures(geoJSONFeatures); // Removido - não utilizado

      // Criar fonte vetorial
      vectorSourceRef.current = new VectorSource({
        features: geoJSONFeatures
      });

      // Criar camada vetorial
      vectorLayerRef.current = new VectorLayer({
        source: vectorSourceRef.current,
        style: (feature) => createTerrasIndigenasStyle(feature, false),
        zIndex: 10
      });

      // Adicionar dados de terra indígena a cada feature
      geoJSONFeatures.forEach(feature => {
        const properties = feature.getProperties();
        feature.set('terraIndigenaInfo', {
          titulo: properties.terrai_nom,
          tipo: 'terra_indigena',
          etnia: properties.etnia_nome,
          municipio: properties.municipio_,
          uf: properties.uf_sigla,
          superficie: properties.superficie,
          fase: properties.fase_ti,
          modalidade: properties.modalidade,
          reestudo: properties.reestudo_t,
          cr: properties.cr,
          faixa_fron: properties.faixa_fron,
          undadm_nom: properties.undadm_nom,
          undadm_sig: properties.undadm_sig,
          dominio_un: properties.dominio_un,
          data_atual: properties.data_atual,
          terrai_cod: properties.terrai_cod,
          undadm_cod: properties.undadm_cod
        });
      });

      // Adicionar camada ao mapa
      map.addLayer(vectorLayerRef.current);

      // Configurar interações
      setupInteractions();

      console.log(`[OpenLayersTerrasIndigenas] Camada criada com ${geoJSONFeatures.length} features`);

    } catch (error) {
      console.error('[OpenLayersTerrasIndigenas] Erro ao criar camada:', error);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, data]);

  /**
   * Configura as interações da camada
   */
  const setupInteractions = useCallback(() => {
    if (!map || !vectorLayerRef.current) return;

    // Criar interações específicas para camadas GeoJSON
    interactionsRef.current = createGeoJSONInteractions(
      map,
      handleFeatureClick,
      handleFeatureHover
    );

    // Configurar handlers específicos
    interactionsRef.current.on('click', handleFeatureClick);
    interactionsRef.current.on('hover', handleFeatureHover);
    interactionsRef.current.on('hoverOut', handleFeatureHoverOut);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /**
   * Handler para clique em feature
   */
  const handleFeatureClick = useCallback((feature, event) => {
    if (!feature) return;

    const terraIndigenaInfo = feature.get('terraIndigenaInfo');
    if (!terraIndigenaInfo) return;

    if (isMobileDevice) {
      // No mobile: clique único abre o painel diretamente
      if (onPainelOpen) {
        onPainelOpen(terraIndigenaInfo);
      }
    } else {
      // No desktop: primeiro clique faz zoom, segundo abre painel
      if (selectedFeature === feature) {
        // Segundo clique: abrir painel
        if (onPainelOpen) {
          onPainelOpen(terraIndigenaInfo);
        }
        setSelectedFeature(null);
      } else {
        // Primeiro clique: fazer zoom
        setSelectedFeature(feature);
        
        const geometry = feature.getGeometry();
        if (geometry) {
          const extent = geometry.getExtent();
          map.getView().fit(extent, {
            duration: MAP_CONFIG.ANIMATION_CONFIG.duration.zoom,
            padding: [50, 50, 50, 50],
            maxZoom: 15
          });
        }
      }
    }
  }, [isMobileDevice, onPainelOpen, selectedFeature, map]);

  /**
   * Handler para hover em feature
   */
  const handleFeatureHover = useCallback((feature, event) => {
    if (isMobileDevice) return; // Desabilitar hover em mobile
    
    setHoveredFeature(feature);
    
    // Aplicar estilo de hover
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setStyle((f) => {
        if (f === feature) {
          return createTerrasIndigenasStyle(f, true); // true = hover
        }
        return createTerrasIndigenasStyle(f, false);
      });
      vectorLayerRef.current.changed();
    }
  }, [isMobileDevice]);

  /**
   * Handler para saída do hover
   */
  const handleFeatureHoverOut = useCallback((feature) => {
    setHoveredFeature(null);
    
    // Remover estilo de hover
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setStyle((f) => createTerrasIndigenasStyle(f, false));
      vectorLayerRef.current.changed();
    }
  }, []);

  /**
   * Aplica estilo de seleção a um feature
   */
  const applySelectionStyleToFeature = useCallback((feature) => {
    if (!vectorLayerRef.current) return;

    vectorLayerRef.current.setStyle((f) => {
      if (f === feature) {
        const baseStyle = createTerrasIndigenasStyle(f, false);
        return applySelectionStyle(f, baseStyle);
      }
      return createTerrasIndigenasStyle(f, false);
    });
    vectorLayerRef.current.changed();
  }, []);

  /**
   * Remove estilo de seleção de um feature
   */
  const removeSelectionStyleFromFeature = useCallback((feature) => {
    if (!vectorLayerRef.current) return;

    vectorLayerRef.current.setStyle((f) => createTerrasIndigenasStyle(f, false));
    vectorLayerRef.current.changed();
  }, []);

  // Inicializar camada quando componente montar
  useEffect(() => {
    if (map && data && showTerrasIndigenas) {
      initializeLayer();
    }

    return () => {
      // Cleanup
      if (interactionsRef.current) {
        interactionsRef.current.destroy();
      }
      if (vectorLayerRef.current && map) {
        map.removeLayer(vectorLayerRef.current);
      }
    };
  }, [map, data, showTerrasIndigenas, initializeLayer]);

  // Aplicar/remover estilo de seleção quando selectedFeature mudar
  useEffect(() => {
    if (selectedFeature) {
      applySelectionStyleToFeature(selectedFeature);
    } else if (vectorLayerRef.current) {
      // Remover seleção de todos os features
      removeSelectionStyleFromFeature();
    }
  }, [selectedFeature, applySelectionStyleToFeature, removeSelectionStyleFromFeature]);

  // Limpar seleção após timeout (para comportamento de clique duplo)
  useEffect(() => {
    if (selectedFeature) {
      const timeout = setTimeout(() => {
        setSelectedFeature(null);
      }, MAP_CONFIG.interaction.clickDelay);

      return () => clearTimeout(timeout);
    }
  }, [selectedFeature]);

  // Se não deve mostrar terras indígenas, não renderizar nada
  if (!showTerrasIndigenas || !data) {
    return null;
  }

  return (
    <div className={className}>
      {/* Este componente não renderiza elementos visuais diretamente,
          apenas gerencia a camada GeoJSON do OpenLayers */}
    </div>
  );
});

export default OpenLayersTerrasIndigenas;
