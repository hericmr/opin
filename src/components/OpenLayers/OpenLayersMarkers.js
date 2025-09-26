import React, { useEffect, useRef, useCallback, useMemo } from 'react';
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
import { isMobile } from '../../utils/mobileUtils';

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
  const [hoveredMarker, setHoveredMarker] = React.useState(null);
  // const [selectedMarker, setSelectedMarker] = React.useState(null); // Removido - não utilizado

  // Verificar se é mobile - REMOVIDO: não utilizado
  // const isMobileDevice = useMemo(() => isMobile(), []);

  /**
   * Inicializa a camada de marcadores (SEM clustering)
   */
  const initializeMarkers = useCallback(() => {
    if (!map) return;

    console.log('[OpenLayersMarkers] Inicializando marcadores individuais...');

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

  }, [map, showNomesEscolas]);

  /**
   * Configura as interações dos marcadores
   */
  const setupInteractions = useCallback(() => {
    if (!map || !vectorLayerRef.current) return;

    console.log('[OpenLayersMarkers] Configurando interações com tooltips...');

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

    // IMPORTANTE: Integrar as interações com o mapa para que os tooltips funcionem
    // O sistema de interações do OpenLayers precisa estar ativo para detectar hover
    console.log('[OpenLayersMarkers] Interações configuradas e integradas com o mapa');

  }, [map]);

  /**
   * Handler para clique em marcador
   */
  const handleMarkerClick = useCallback((feature, event) => {
    // Usar schoolData em vez de markerData para consistência com o sistema de interações
    const schoolData = feature.get('schoolData');
    if (schoolData && onPainelOpen) {
      console.log('[OpenLayersMarkers] Marcador clicado:', schoolData.titulo);
      onPainelOpen(schoolData);
    }
  }, [onPainelOpen]);

  /**
   * Handler para hover em marcador
   */
  const handleMarkerHover = useCallback((feature, event) => {
    // IMPORTANTE: Não desabilitar hover em mobile
    // O sistema de interações precisa do hover para funcionar corretamente
    // O hover é usado para mostrar tooltips e aplicar estilos visuais
    
    setHoveredMarker(feature);
    
    // Aplicar estilo de hover
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

    console.log('[OpenLayersMarkers] Atualizando marcadores...', dataPoints.length, 'showMarcadores:', showMarcadores);

    // Limpar marcadores existentes
    vectorSourceRef.current.clear();
    
    // Se showMarcadores for false, não adicionar marcadores
    if (!showMarcadores) {
      console.log('[OpenLayersMarkers] Marcadores desabilitados, removendo todos');
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

    console.log('[OpenLayersMarkers] Pontos válidos:', pontosValidos.length);

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
        
        // Debug: verificar dados do tooltip
        console.log(`[OpenLayersMarkers] Marcador ${index}:`, {
          titulo: point.titulo,
          municipio: point.municipio || point.Municipio,
          uf: point.uf || point.UF
        });
        
        vectorSourceRef.current.addFeature(feature);
      }
    });

    console.log(`[OpenLayersMarkers] ${pontosValidos.length} marcadores individuais adicionados`);

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
