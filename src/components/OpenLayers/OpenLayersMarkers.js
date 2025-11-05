import React, { useEffect, useRef, useCallback } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { 
  createMarkerStyle, 
  applyHoverStyle
} from '../../utils/openlayers/markerStyles';
import { createMarkerInteractions } from '../../utils/openlayers/interactions';
import { flyToAtFractionX, showClickPulse } from '../../utils/openlayers/effects';
import logger from '../../utils/logger';

/**
 * Componente OpenLayersMarkers - Substitui completamente o Marcadores.js do Leaflet
 * IMPLEMENTAÇÃO SIMPLIFICADA: Mostra todos os marcadores individuais sem clustering
 */
const OpenLayersMarkers = ({ 
  dataPoints = [], 
  onPainelOpen,
  showMarcadores = true,
  showNomesEscolas = false,
  map,
  className = "h-full w-full"
}) => {
  // Refs para controle das camadas e fontes
  const vectorSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);
  
  // Estados para controle de interações
  const [, setHoveredMarker] = React.useState(null);
  // const [selectedMarker, setSelectedMarker] = React.useState(null); // Removido - não utilizado

  // Verificar se é mobile - REMOVIDO: não utilizado
  // const isMobileDevice = useMemo(() => isMobile(), []);

  /**
   * Inicializa a camada de marcadores (SEM clustering)
   */
  const initializeMarkers = useCallback(() => {
    if (!map) return;

    logger.debug('[OpenLayersMarkers] Inicializando marcadores individuais...');

    // Criar fonte vetorial para marcadores
    vectorSourceRef.current = new VectorSource();
    
    // Criar camada vetorial para marcadores INDIVIDUAIS (sem clustering)
    vectorLayerRef.current = new VectorLayer({
      source: vectorSourceRef.current,
      style: (feature) => createMarkerStyle(feature, showNomesEscolas),
      zIndex: 100
    });

    // Adicionar camada ao mapa
    map.addLayer(vectorLayerRef.current);

    // Configurar interações
    setupInteractions();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, showNomesEscolas]);

  /**
   * Configura as interações dos marcadores
   */
  const setupInteractions = useCallback(() => {
    if (!map || !vectorLayerRef.current) return;

    logger.debug('[OpenLayersMarkers] Configurando interações com tooltips...');

    // Criar interações específicas para marcadores com tooltips
    const interactions = createMarkerInteractions(
      map,
      handleMarkerClick,
      handleMarkerHover
    );

    // Configurar handlers específicos
    interactions.on('click', handleMarkerClick);
    interactions.on('hover', handleMarkerHover);
    interactions.on('hoverOut', handleMarkerHoverOut);

    logger.debug('[OpenLayersMarkers] Interações configuradas e integradas com o mapa');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /**
   * Handler para clique em marcador
   */
  const handleMarkerClick = useCallback((feature, event) => {
    // Usar schoolData em vez de markerData para consistência com o sistema de interações
    const schoolData = feature.get('schoolData');
    if (schoolData && onPainelOpen) {
      const coord = feature.getGeometry()?.getCoordinates();
      if (map && coord) {
        // Ajustar a posição do alvo conforme o estado do painel de informações:
        // - Se houver painel não maximizado (ocupando metade da tela), usar 25%
        // - Caso contrário (sem painel ou maximizado), centralizar em 50%
        let fractionX = 0.25; // regra: 25% por padrão
        try {
          const panelEl = document.querySelector('.mj-panel');
          const isPanelMaximized = panelEl?.classList?.contains('mj-maximized');
          if (isPanelMaximized) fractionX = 0.5;
        } catch {}

        flyToAtFractionX(map, coord, { durationMs: 550, fractionX });
        showClickPulse(map, coord);
      }
      logger.debug('[OpenLayersMarkers] Marcador clicado:', schoolData.titulo);
      onPainelOpen(schoolData);
    }
  }, [onPainelOpen, map]);

  /**
   * Handler para hover em marcador
   */
  const handleMarkerHover = useCallback((feature, event) => {
    // IMPORTANTE: O hover deve funcionar no desktop
    // No mobile, o hover também é usado para mostrar tooltips
    
    setHoveredMarker(feature);
    
    // Aplicar estilo de hover (anel branco de seleção)
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setStyle((f) => {
        if (f === feature) {
          return applyHoverStyle(f, createMarkerStyle(f, showNomesEscolas));
        }
        return createMarkerStyle(f, showNomesEscolas);
      });
      vectorLayerRef.current.changed();
    }
  }, [showNomesEscolas]);

  /**
   * Handler para saída do hover
   */
  const handleMarkerHoverOut = useCallback(() => {
    setHoveredMarker(null);
    
    // Remover estilo de hover
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setStyle((f) => createMarkerStyle(f, showNomesEscolas));
      vectorLayerRef.current.changed();
    }
  }, [showNomesEscolas]);

  /**
   * Atualiza marcadores quando dataPoints mudar
   */
  const updateMarkers = useCallback(() => {
    if (!vectorSourceRef.current || !dataPoints) return;

    logger.debug('[OpenLayersMarkers] Atualizando marcadores...', dataPoints.length, 'showMarcadores:', showMarcadores);

    // Limpar marcadores existentes
    vectorSourceRef.current.clear();
    
    // Se showMarcadores for false, não adicionar marcadores
    if (!showMarcadores) {
      logger.debug('[OpenLayersMarkers] Marcadores desabilitados, removendo todos');
      return;
    }
    
    // Filtrar pontos válidos
    const pontosValidos = dataPoints.filter(point => {
      if (!point.latitude || !point.longitude) return false;
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      return !isNaN(lat) && !isNaN(lng) && 
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180;
    });

    logger.debug('[OpenLayersMarkers] Pontos válidos:', pontosValidos.length);

    // Adicionar novos marcadores INDIVIDUAIS
    pontosValidos.forEach((point, index) => {
      if (point.latitude && point.longitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([point.longitude, point.latitude]))
        });
        
        feature.set('markerData', point);
        feature.set('schoolData', point); // Dados para tooltips
        feature.set('markerId', `marker_${index}`);
        feature.set('type', 'marker');
        
        vectorSourceRef.current.addFeature(feature);
      }
    });

    logger.debug(`[OpenLayersMarkers] ${pontosValidos.length} marcadores individuais adicionados`);

  }, [dataPoints, showMarcadores]);

  /**
   * Atualiza estilo dos marcadores quando showNomesEscolas mudar
   */
  const updateMarkerStyles = useCallback(() => {
    if (!vectorLayerRef.current) return;

    vectorLayerRef.current.setStyle((feature) => createMarkerStyle(feature, showNomesEscolas));
    vectorLayerRef.current.changed();
  }, [showNomesEscolas]);

  // Inicializar marcadores quando componente montar
  useEffect(() => {
    if (map) {
      initializeMarkers();
    }

    return () => {
      // Cleanup
      if (vectorLayerRef.current && map) {
        map.removeLayer(vectorLayerRef.current);
      }
    };
  }, [map, initializeMarkers]);

  // Atualizar marcadores quando dataPoints mudar
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Atualizar estilos quando showNomesEscolas mudar
  useEffect(() => {
    updateMarkerStyles();
  }, [updateMarkerStyles]);

  // Sempre renderizar o componente para manter a camada ativa
  return (
    <div className={className}>
      {/* Este componente não renderiza elementos visuais diretamente,
          apenas gerencia as camadas do OpenLayers */}
    </div>
  );
};

export default OpenLayersMarkers;
