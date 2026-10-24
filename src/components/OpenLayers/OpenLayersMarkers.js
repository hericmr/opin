import React, { useEffect, useRef, useCallback } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { createMarkerStyle } from '../../utils/openlayers/markerStyles';
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
  painelAberto = false,
  map,
  className = "h-full w-full"
}) => {
  // Refs para controle das camadas e fontes
  const vectorSourceRef = useRef(null);
  const vectorLayerRef = useRef(null);
  
  // Refs para controle de interações
  const hoveredFeatureRef = useRef(null);
  const selectedFeatureRef = useRef(null);
  const interactionsRef = useRef(null);

  const animRefs = useRef(new Map());
  const bloomAnimRefs = useRef(new Map());

  const animateFeatureScale = useCallback((feature, targetScale, durationMs = 300) => {
    if (!feature) return;
    
    const existing = animRefs.current.get(feature);
    if (existing) cancelAnimationFrame(existing.reqId);

    const startScale = feature.get('hoverScale') || 1.0;
    const startTime = performance.now();

    const animate = (time) => {
      let progress = (time - startTime) / durationMs;
      if (progress > 1) progress = 1;

      // cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScale = startScale + (targetScale - startScale) * easeOut;
      
      feature.set('hoverScale', currentScale, true); // true to silence event
      feature.changed(); // force redraw
      
      if (progress < 1) {
        animRefs.current.set(feature, { reqId: requestAnimationFrame(animate) });
      } else {
        animRefs.current.delete(feature);
      }
    };
    
    animRefs.current.set(feature, { reqId: requestAnimationFrame(animate) });
  }, []);

  /**
   * Anima a abertura/fechamento orgânico de um grupo de desabrochar (bloom)
   * @param {Array<Feature>} features - Features do grupo (centro e itens)
   * @param {number} targetProgress - 1.0 (abrir) ou 0.0 (fechar)
   * @param {number} durationMs - Duração da transição
   */
  const animateBloom = useCallback((features, targetProgress, durationMs = 650) => {
    if (!features || features.length === 0) return;

    const bloomId = features[0].get('bloomId') || 'bloom_default';
    const existingAnim = bloomAnimRefs.current.get(bloomId);
    if (existingAnim) {
      cancelAnimationFrame(existingAnim.reqId);
    }

    const startProgress = features[0].get('bloomProgress') ?? 0;
    const startTime = performance.now();
    const isOpening = targetProgress > startProgress;

    const animate = (time) => {
      let p = (time - startTime) / durationMs;
      if (p > 1) p = 1;

      // Easing orgânico: leve elasticidade na abertura (easeOutBack), cubic suave no recolhimento
      let currentProgress;
      if (isOpening) {
        const c1 = 1.35;
        const c3 = c1 + 1;
        const eased = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
        currentProgress = startProgress + (targetProgress - startProgress) * Math.max(0, eased);
      } else {
        const eased = 1 - Math.pow(1 - p, 3);
        currentProgress = startProgress + (targetProgress - startProgress) * eased;
      }

      features.forEach(f => {
        f.set('bloomProgress', currentProgress, true);
        f.changed();
      });

      if (vectorLayerRef.current) {
        vectorLayerRef.current.changed();
      }

      if (p < 1) {
        bloomAnimRefs.current.set(bloomId, { reqId: requestAnimationFrame(animate) });
      } else {
        features.forEach(f => {
          f.set('bloomProgress', targetProgress, true);
          f.set('isOpen', targetProgress > 0.5, true);
          f.changed();
        });
        if (vectorLayerRef.current) {
          vectorLayerRef.current.changed();
        }
        bloomAnimRefs.current.delete(bloomId);
      }
    };

    bloomAnimRefs.current.set(bloomId, { reqId: requestAnimationFrame(animate) });
  }, []);

  // Limpeza de animações pendentes ao desmontar
  useEffect(() => {
    const bloomAnims = bloomAnimRefs.current;
    const anims = animRefs.current;
    return () => {
      bloomAnims.forEach(anim => cancelAnimationFrame(anim.reqId));
      bloomAnims.clear();
      anims.forEach(anim => cancelAnimationFrame(anim.reqId));
      anims.clear();
    };
  }, []);

  // Monitora painelAberto para resetar a escala do ícone selecionado
  useEffect(() => {
    if (!painelAberto && selectedFeatureRef.current) {
      selectedFeatureRef.current.set('isSelected', false);
      animateFeatureScale(selectedFeatureRef.current, 1.0, 400);
      selectedFeatureRef.current = null;
    }
  }, [painelAberto, animateFeatureScale]);

  /**
   * Handler para clique em marcador
   */
  const handleMarkerClick = useCallback((feature, event) => {
    if (!feature) return;

    const type = feature.get('type');
    const coord = feature.getGeometry()?.getCoordinates();

    // 1. NÓ CENTRAL DO DESABROCHAR (bloom_center)
    if (type === 'bloom_center') {
      const groupFeatures = feature.get('bloomGroupFeatures') || [];
      const isOpen = feature.get('isOpen') || (feature.get('bloomProgress') || 0) > 0.5;

      if (!isOpen) {
        // Estava fechado -> Desabrochar histórias originárias!
        animateBloom(groupFeatures, 1.0, 700);
        if (map && coord) {
          const currentZoom = map.getView()?.getZoom() || 8;
          flyToAtFractionX(map, coord, { 
            durationMs: 500, 
            fractionX: 0.5, 
            zoom: Math.max(currentZoom, 9.5) 
          });
          showClickPulse(map, coord);
        }
      } else {
        // Estava desabrochado -> Recolher (fechar)!
        animateBloom(groupFeatures, 0.0, 550);
        if (selectedFeatureRef.current && groupFeatures.includes(selectedFeatureRef.current)) {
          selectedFeatureRef.current.set('isSelected', false);
          animateFeatureScale(selectedFeatureRef.current, 1.0, 300);
          selectedFeatureRef.current = null;
        }
      }
      return;
    }

    // 2. ITEM DO GRUPO DESABROCHÁVEL (bloom_item)
    if (type === 'bloom_item') {
      const groupFeatures = feature.get('bloomGroupFeatures') || [];
      const isOpen = feature.get('isOpen') || (feature.get('bloomProgress') || 0) > 0.5;

      if (!isOpen) {
        // Clicou no ser quando ainda estava no ninho fechado -> Desabrochar!
        animateBloom(groupFeatures, 1.0, 700);
        if (map && coord) {
          const currentZoom = map.getView()?.getZoom() || 8;
          flyToAtFractionX(map, coord, { 
            durationMs: 500, 
            fractionX: 0.5, 
            zoom: Math.max(currentZoom, 9.5) 
          });
          showClickPulse(map, coord);
        }
        return;
      }

      // Já está desabrochado -> Selecionar este ser específico e abrir painel da história!
      const schoolData = feature.get('schoolData');
      if (schoolData && onPainelOpen) {
        if (selectedFeatureRef.current && selectedFeatureRef.current !== feature) {
          selectedFeatureRef.current.set('isSelected', false);
          animateFeatureScale(selectedFeatureRef.current, 1.0, 300);
        }

        selectedFeatureRef.current = feature;
        feature.set('isSelected', true);
        animateFeatureScale(feature, 1.35, 400);

        if (map && coord) {
          let fractionX = 0.25;
          try {
            const panelEl = document.querySelector('.mj-panel');
            const isPanelMaximized = panelEl?.classList?.contains('mj-maximized');
            if (isPanelMaximized) fractionX = 0.5;
          } catch {}

          flyToAtFractionX(map, coord, { durationMs: 550, fractionX });
          showClickPulse(map, coord);
        }

        logger.debug('[OpenLayersMarkers] História desabrochada selecionada:', schoolData.titulo);
        onPainelOpen(schoolData);
      }
      return;
    }

    // 3. MARCADOR INDIVIDUAL PADRÃO
    const schoolData = feature.get('schoolData');
    if (schoolData && onPainelOpen) {
      if (selectedFeatureRef.current && selectedFeatureRef.current !== feature) {
        selectedFeatureRef.current.set('isSelected', false);
        animateFeatureScale(selectedFeatureRef.current, 1.0, 400);
      }

      selectedFeatureRef.current = feature;
      feature.set('isSelected', true);
      animateFeatureScale(feature, 2.5, 600);

      if (map && coord) {
        let fractionX = 0.25;
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
  }, [onPainelOpen, map, animateFeatureScale, animateBloom]);

  /**
   * Handler para hover em marcador
   */
  const handleMarkerHover = useCallback((feature, event) => {
    hoveredFeatureRef.current = feature;

    const type = feature.get('type');
    if (type === 'bloom_center') {
      animateFeatureScale(feature, 1.2, 200);
      return;
    }

    if (type === 'bloom_item') {
      const isBloomed = (feature.get('bloomProgress') || 0) > 0.1;
      if (!isBloomed) {
        // Se ainda está fechado, hover destaca o halo central também
        const groupFeatures = feature.get('bloomGroupFeatures');
        const center = groupFeatures?.find(f => f.get('type') === 'bloom_center');
        if (center) animateFeatureScale(center, 1.25, 200);
      }
      if (selectedFeatureRef.current !== feature) {
        animateFeatureScale(feature, isBloomed ? 1.35 : 1.15, 250);
      }
      return;
    }

    if (selectedFeatureRef.current !== feature) {
      animateFeatureScale(feature, 2.0); // Cresce 2x no hover
    }
  }, [animateFeatureScale]);

  /**
   * Handler para saída do hover
   */
  const handleMarkerHoverOut = useCallback((feature) => {
    const targetFeature = feature || hoveredFeatureRef.current;
    hoveredFeatureRef.current = null;

    if (targetFeature) {
      const type = targetFeature.get('type');
      if (type === 'bloom_center') {
        animateFeatureScale(targetFeature, 1.0, 200);
        return;
      }
      if (type === 'bloom_item') {
        const groupFeatures = targetFeature.get('bloomGroupFeatures');
        const center = groupFeatures?.find(f => f.get('type') === 'bloom_center');
        if (center) animateFeatureScale(center, 1.0, 200);
        if (selectedFeatureRef.current !== targetFeature) {
          animateFeatureScale(targetFeature, 1.0, 200);
        }
        return;
      }
      if (selectedFeatureRef.current !== targetFeature) {
        animateFeatureScale(targetFeature, 1.0);
      }
    }
  }, [animateFeatureScale]);

  // Handlers mais recentes, lidos pelos listeners do mapa (registrados uma vez por inicialização)
  const handlersRef = useRef({});
  useEffect(() => {
    handlersRef.current = {
      click: handleMarkerClick,
      hover: handleMarkerHover,
      hoverOut: handleMarkerHoverOut
    };
  }, [handleMarkerClick, handleMarkerHover, handleMarkerHoverOut]);

  /**
   * Configura as interações dos marcadores
   */
  const setupInteractions = useCallback(() => {
    if (!map || !vectorLayerRef.current) return;

    logger.debug('[OpenLayersMarkers] Configurando interações com tooltips...');

    const onClick = (...args) => handlersRef.current.click?.(...args);
    const onHover = (...args) => handlersRef.current.hover?.(...args);
    const onHoverOut = (...args) => handlersRef.current.hoverOut?.(...args);

    // Criar interações específicas para marcadores com tooltips
    const interactions = createMarkerInteractions(map, onClick, onHover);
    interactions.on('hoverOut', onHoverOut);
    interactionsRef.current = interactions;

    logger.debug('[OpenLayersMarkers] Interações configuradas e integradas com o mapa');
  }, [map]);

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
      style: (feature, resolution) => createMarkerStyle(feature, showNomesEscolas, resolution),
      zIndex: 100
    });

    // Adicionar camada ao mapa
    map.addLayer(vectorLayerRef.current);

    // Configurar interações
    setupInteractions();
  }, [map, showNomesEscolas, setupInteractions]);

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
        if (point.bloomGroup && Array.isArray(point.bloomGroup) && point.bloomGroup.length > 0) {
          const bloomId = `bloom_${point.id || index}`;
          const centerCoord = fromLonLat([point.longitude, point.latitude]);

          // Centro do desabrochar (bloom_center)
          const centerFeature = new Feature({
            geometry: new Point(centerCoord)
          });
          centerFeature.set('type', 'bloom_center');
          centerFeature.set('bloomId', bloomId);
          centerFeature.set('bloomProgress', 0);
          centerFeature.set('isOpen', false);
          centerFeature.set('markerData', point);
          centerFeature.set('schoolData', {
            ...point,
            titulo: '✦ Clique para desabrochar histórias originárias'
          });
          centerFeature.set('markerId', `${bloomId}_center`);

          // Itens desabrocháveis (bloom_item)
          const itemFeatures = point.bloomGroup.map((item, itemIdx) => {
            const itemFeature = new Feature({
              geometry: new Point(centerCoord)
            });
            itemFeature.set('type', 'bloom_item');
            itemFeature.set('bloomId', bloomId);
            itemFeature.set('bloomIndex', itemIdx);
            itemFeature.set('bloomProgress', 0);
            itemFeature.set('markerData', item);
            itemFeature.set('schoolData', item);
            itemFeature.set('markerId', `${bloomId}_item_${item.id || itemIdx}`);
            return itemFeature;
          });

          // Vincular referências de grupo para sincronização
          const allFeatures = [centerFeature, ...itemFeatures];
          centerFeature.set('bloomGroupFeatures', allFeatures);
          itemFeatures.forEach(f => f.set('bloomGroupFeatures', allFeatures));

          vectorSourceRef.current.addFeature(centerFeature);
          itemFeatures.forEach(f => vectorSourceRef.current.addFeature(f));
        } else {
          const feature = new Feature({
            geometry: new Point(fromLonLat([point.longitude, point.latitude]))
          });
          
          feature.set('markerData', point);
          feature.set('schoolData', point); // Dados para tooltips
          feature.set('markerId', `marker_${index}`);
          feature.set('type', 'marker');
          
          vectorSourceRef.current.addFeature(feature);
        }
      }
    });

    logger.debug(`[OpenLayersMarkers] ${pontosValidos.length} marcadores individuais adicionados`);

  }, [dataPoints, showMarcadores]);

  /**
   * Atualiza estilo dos marcadores quando showNomesEscolas mudar
   */
  const updateMarkerStyles = useCallback(() => {
    if (!vectorLayerRef.current) return;

    vectorLayerRef.current.setStyle((feature, resolution) => createMarkerStyle(feature, showNomesEscolas, resolution));
    vectorLayerRef.current.changed();
  }, [showNomesEscolas]);

  // Inicializar marcadores quando componente montar
  useEffect(() => {
    if (map) {
      initializeMarkers();
    }

    return () => {
      // Cleanup
      interactionsRef.current?.destroy();
      interactionsRef.current = null;
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

  // Idle animation (floating effect para os seres gamificados)
  useEffect(() => {
    // Apenas ativa a animação contínua se existirem "seres" (ícones customizados) ou grupo de desabrochar no mapa
    const hasSeres = dataPoints && dataPoints.some(p => p.iconUrl || p.bloomGroup);
    if (!hasSeres || !vectorLayerRef.current) return;

    let reqId;
    const animateIdle = () => {
      if (vectorLayerRef.current) {
        vectorLayerRef.current.changed();
      }
      reqId = requestAnimationFrame(animateIdle);
    };
    reqId = requestAnimationFrame(animateIdle);

    return () => cancelAnimationFrame(reqId);
  }, [dataPoints, showMarcadores]);

  // Sempre renderizar o componente para manter a camada ativa
  return (
    <div className={className}>
      {/* Este componente não renderiza elementos visuais diretamente,
          apenas gerencia as camadas do OpenLayers */}
    </div>
  );
};

export default OpenLayersMarkers;
