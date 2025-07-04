import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Text, Icon } from 'ol/style';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import 'ol/ol.css';
import { MAP_CONFIG } from '../utils/mapConfig';
import { isMobile } from '../utils/mobileUtils';
import MapWrapper from './map/MapWrapper';
import { findNearbyPairs } from '../utils/markers/proximityUtils';
import { terrasIndigenasStyle, estadoSPStyle } from '../utils/markers/featureStyles';
import { handleMarkerClick, handleGeoJSONClick } from '../utils/markers/handlers';
import { createMarkerStyle, createClusterStyle } from '../utils/markers/markerStyles';

// Componentes GeoJSON
// import OpenLayersTerrasIndigenas from './OpenLayersTerrasIndigenas';
// import OpenLayersEstadoSP from './OpenLayersEstadoSP';

// Registrar projeção SIRGAS 2000 (EPSG:4674) usada nos dados GeoJSON
proj4.defs('EPSG:4674', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs');
register(proj4);

// Constante para definir a proximidade entre marcadores (em graus) - mesma do Leaflet
const PROXIMITY_THRESHOLD = 0.00005;

// Função para criar SVG base do marcador (gota invertida com bolinha branca)
const createMarkerSVG = (color, size = 24, options = {}) => {
  const {
    borderColor = null,
    showShadow = true,
    showGradient = true,
    showGlow = false,
    isNearbyPair = false
  } = options;

  const baseColor = color;
  const borderColorFinal = borderColor || baseColor;
  const center = size / 2;

  // Calcular dimensões proporcionais baseadas no tamanho original de 24px
  const scale = size / 24;
  const circleRadius = 3 * scale;
  const glowRadius = 2 * scale;

  // Path da gota invertida (marcador) - usando o path original que funcionava bem
  const markerPath = `M${center} ${2 * scale}C${center - 3.87 * scale} ${2 * scale} ${center - 7 * scale} ${5.13 * scale} ${center - 7 * scale} ${9 * scale}c0 ${5.25 * scale} ${7 * scale} ${13 * scale} ${7 * scale} ${13 * scale}s${7 * scale} -${7.75 * scale} ${7 * scale} -${13 * scale}c0 -${3.87 * scale} -${3.13 * scale} -${7 * scale} -${7 * scale} -${7 * scale}z`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${showShadow ? `
        <filter id="shadow-${size}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="${2 * scale}" stdDeviation="${3 * scale}" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
        ` : ''}
        ${showGradient ? `
        <linearGradient id="gradient-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${baseColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${borderColorFinal};stop-opacity:1" />
        </linearGradient>
        ` : ''}
        ${showGlow ? `
        <filter id="glow-${size}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="${1 * scale}" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        ` : ''}
      </defs>
      
      <!-- Brilho sutil de fundo -->
      ${showGlow ? `
      <circle cx="${center - 2 * scale}" cy="${center - 2 * scale}" r="${glowRadius}" fill="white" opacity="0.2"/>
      ` : ''}
      
      <!-- Marcador principal (gota invertida) -->
      <path d="${markerPath}" 
            fill="${showGradient ? `url(#gradient-${size})` : baseColor}" 
            ${showShadow ? `filter="url(#shadow-${size})"` : ''}
            ${showGlow ? `filter="url(#glow-${size})"` : ''}/>
      
      <!-- Círculo interno branco (bolinha) -->
      <circle cx="${center}" cy="${9 * scale}" r="${circleRadius}" fill="white" opacity="0.9"/>
      
      <!-- Brilho sutil no círculo -->
      <circle cx="${center - 2 * scale}" cy="${7 * scale}" r="${circleRadius * 0.6}" fill="white" opacity="0.4"/>
      
      <!-- Indicador de par próximo (se aplicável) -->
      ${isNearbyPair ? `
      <circle cx="${size - 4 * scale}" cy="${4 * scale}" r="${3 * scale}" fill="#FF6B6B" opacity="0.8"/>
      <text x="${size - 4 * scale}" y="${6 * scale}" text-anchor="middle" font-size="${8 * scale}" fill="white" font-weight="bold">P</text>
      ` : ''}
    </svg>
  `;
};

const OpenLayersMap = ({ 
  dataPoints = [], 
  onPainelOpen,
  center = MAP_CONFIG.center, // Usar configuração padrão
  zoom = MAP_CONFIG.zoom, // Usar configuração padrão
  className = "h-screen w-full",
  // Props para camadas GeoJSON
  terrasIndigenasData = null,
  estadoSPData = null,
  showTerrasIndigenas = true,
  showEstadoSP = true,
  // Props para marcadores
  showMarcadores = true,
  showNomesEscolas = false
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const vectorSource = useRef(null);
  const clusterSource = useRef(null);
  const vectorLayer = useRef(null);
  const baseLayer = useRef(null);
  const [mapInfo, setMapInfo] = useState({
    lng: center[0],
    lat: center[1],
    zoom: zoom
  });

  // Referências para as camadas GeoJSON
  const terrasIndigenasLayerRef = useRef(null);
  const estadoSPLayerRef = useRef(null);

  // Função para gerenciar cliques em marcador de escola (um clique abre o painel)
  const handleMarkerClick = useCallback((feature, event) => {
    const schoolData = feature.get('schoolData');
    if (schoolData) {
      if (isMobile()) {
        console.log('[MOBILE] Marcador de escola clicado:', schoolData);
      }
      onPainelOpen?.(schoolData);
    }
  }, [onPainelOpen]);

  // Criar camadas base
  const createBaseLayers = useCallback(() => {
    const satelliteLayer = new TileLayer({
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

    return { satelliteLayer };
  }, []);

  // Função para criar tooltip HTML
  const createTooltipHTML = useCallback((schoolData) => {
    return schoolData.titulo || 'Escola Indígena';
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (map.current) return;

    // Verificar se é mobile e ajustar configurações
    const isMobileDevice = isMobile();
    const initialCenter = isMobileDevice ? MAP_CONFIG.mobile.center : center;
    const initialZoom = isMobileDevice ? MAP_CONFIG.mobile.zoom : zoom;

    // Criar fonte vetorial para marcadores
    vectorSource.current = new VectorSource();
    
    // Criar fonte de cluster
    clusterSource.current = new ClusterSource({
      distance: showNomesEscolas ? 15 : 5, // Distância maior quando nomes estão ativados
      source: vectorSource.current,
      // Função customizada para determinar se deve fazer cluster
      geometryFunction: (feature) => {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'Point') {
          return geometry;
        }
        return null;
      }
    });
    
    // Criar camada vetorial para marcadores com clustering
    vectorLayer.current = new VectorLayer({
      source: clusterSource.current,
      style: (feature) => createClusterStyle(feature, (f) => createMarkerStyle(f, showNomesEscolas)),
      zIndex: 15
    });

    // Criar camadas base
    const { satelliteLayer } = createBaseLayers();
    baseLayer.current = satelliteLayer;

    // Criar mapa com configurações ajustadas para mobile
    map.current = new Map({
      target: mapContainer.current,
      layers: [
        baseLayer.current,
        vectorLayer.current
      ],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: initialZoom,
        maxZoom: 18,
        minZoom: 4,
        enableRotation: false // Desabilitar rotação
      }),
      controls: defaultControls(),
      interactions: defaultInteractions({
        dragRotate: false, // Desabilitar rotação com arraste
        pinchRotate: false // Desabilitar rotação com pinch (dois dedos)
      })
    });

    // Event listeners
    map.current.on('moveend', () => {
      const view = map.current.getView();
      const center = toLonLat(view.getCenter());
      const newView = {
        lng: center[0].toFixed(4),
        lat: center[1].toFixed(4),
        zoom: view.getZoom().toFixed(2)
      };
      
      setMapInfo(newView);
    });

    // Event listener para mudanças de zoom - atualizar clusterização
    map.current.on('moveend', () => {
      // Atualizar estilos dos clusters quando o zoom mudar
      if (vectorLayer.current) {
        vectorLayer.current.changed();
      }
    });

    // Event listener para cliques nos marcadores e clusters
    map.current.on('click', (event) => {
      const feature = map.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        // Verificar se é um cluster
        if (feature.get('features')) {
          const features = feature.get('features');
          if (features.length === 1) {
            console.log('[CLUSTER] Clique em cluster com 1 marcador', features[0].get('schoolData'));
            handleMarkerClick(features[0], event);
          } else if (features.length > 1) {
            console.log('[CLUSTER] Clique em cluster com', features.length, 'marcadores. Fazendo zoom.');
            // Cluster com múltiplos marcadores, fazer zoom inteligente
            const clusterExtent = feature.getGeometry().getExtent();
            const currentZoom = map.current.getView().getZoom();
            let targetZoom = 12;
            if (features.length > 20) {
              targetZoom = 10;
            } else if (features.length > 10) {
              targetZoom = 11;
            } else if (features.length > 5) {
              targetZoom = 12;
            } else {
              targetZoom = 13;
            }
            targetZoom = Math.max(targetZoom, currentZoom + 1);
            map.current.getView().fit(clusterExtent, {
              duration: 800,
              padding: [80, 80, 80, 80],
              maxZoom: targetZoom
            });
          }
        } else {
          console.log('[MARCADOR] Clique em marcador individual', feature.get('schoolData'));
          // Marcador individual
          handleMarkerClick(feature, event);
        }
      }
    });

    // Event listener para hover nos marcadores (tooltips)
    let tooltipElement = null;

    map.current.on('pointermove', (event) => {
      // Desabilitar tooltips de hover no mobile
      if (isMobile()) return;
      
      if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
      }

      const feature = map.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        // Verificar se é um cluster
        if (feature.get('features')) {
          const features = feature.get('features');
          if (features.length === 1) {
            // Cluster com apenas um marcador, mostrar tooltip
            const schoolData = features[0].get('schoolData');
            if (schoolData) {
              tooltipElement = createTooltipElement(event, schoolData);
            }
          } else {
            // Cluster com múltiplos marcadores, mostrar tooltip do cluster
            tooltipElement = createClusterTooltipElement(event, features.length);
          }
        } else {
          // Marcador individual
          const schoolData = feature.get('schoolData');
          if (schoolData) {
            tooltipElement = createTooltipElement(event, schoolData);
          }
        }
      }
    });

    // Função para criar tooltip de marcador individual
    const createTooltipElement = (event, schoolData) => {
      const element = document.createElement('div');
      element.className = 'ol-tooltip';
      element.textContent = createTooltipHTML(schoolData);
      element.style.position = 'absolute';
      element.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      element.style.color = '#374151';
      element.style.padding = '8px 12px';
      element.style.borderRadius = '8px';
      element.style.fontSize = '13px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontWeight = '500';
      element.style.maxWidth = '200px';
      element.style.whiteSpace = 'nowrap';
      element.style.overflow = 'hidden';
      element.style.textOverflow = 'ellipsis';
      element.style.zIndex = '1000';
      element.style.pointerEvents = 'none';
      element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      element.style.border = '1px solid rgba(0, 0, 0, 0.1)';
      element.style.backdropFilter = 'blur(4px)';
      
      const coordinate = event.coordinate;
      const pixel = map.current.getPixelFromCoordinate(coordinate);
      
      // Centralizar o tooltip horizontalmente com o marcador
      const elementWidth = 200; // Largura estimada do tooltip
      const offsetX = -elementWidth / 2; // Centralizar horizontalmente
      const offsetY = -40; // Posicionar acima do marcador
      
      element.style.left = (pixel[0] + offsetX) + 'px';
      element.style.top = (pixel[1] + offsetY) + 'px';
      
      mapContainer.current.appendChild(element);
      return element;
    };

    // Função para criar tooltip de cluster
    const createClusterTooltipElement = (event, count) => {
      const element = document.createElement('div');
      element.className = 'ol-tooltip';
      element.textContent = `${count} escolas indígenas`;
      element.style.position = 'absolute';
      element.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      element.style.color = '#374151';
      element.style.padding = '8px 12px';
      element.style.borderRadius = '8px';
      element.style.fontSize = '13px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontWeight = '500';
      element.style.maxWidth = '200px';
      element.style.whiteSpace = 'nowrap';
      element.style.overflow = 'hidden';
      element.style.textOverflow = 'ellipsis';
      element.style.zIndex = '1000';
      element.style.pointerEvents = 'none';
      element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      element.style.border = '1px solid rgba(0, 0, 0, 0.1)';
      element.style.backdropFilter = 'blur(4px)';
      
      const coordinate = event.coordinate;
      const pixel = map.current.getPixelFromCoordinate(coordinate);
      
      // Centralizar o tooltip horizontalmente com o cluster
      const elementWidth = 200; // Largura estimada do tooltip
      const offsetX = -elementWidth / 2; // Centralizar horizontalmente
      const offsetY = -40; // Posicionar acima do cluster
      
      element.style.left = (pixel[0] + offsetX) + 'px';
      element.style.top = (pixel[1] + offsetY) + 'px';
      
      mapContainer.current.appendChild(element);
      return element;
    };

    // Desabilitar zoom no double click em marcadores individuais ou cluster de 1 escola
    map.current.on('dblclick', (event) => {
      const feature = map.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        // Se for marcador individual ou cluster de 1 escola, previne o zoom
        if (!feature.get('features') || (feature.get('features') && feature.get('features').length === 1)) {
          event.preventDefault();
          event.stopPropagation();
          console.log('[DBLCLICK] Zoom desabilitado em marcador individual ou cluster de 1 escola');
        }
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [center, zoom, createBaseLayers, createClusterStyle, createTooltipHTML, onPainelOpen, handleMarkerClick]);

  // Atualizar configurações do mapa quando props mudarem
  useEffect(() => {
    if (!map.current) return;

    const isMobileDevice = isMobile();
    const newCenter = isMobileDevice ? MAP_CONFIG.mobile.center : center;
    const newZoom = isMobileDevice ? MAP_CONFIG.mobile.zoom : zoom;

    const view = map.current.getView();
    const currentCenter = toLonLat(view.getCenter());
    const currentZoom = view.getZoom();

    // Só atualizar se as configurações realmente mudaram
    if (currentCenter[0] !== newCenter[0] || currentCenter[1] !== newCenter[1] || currentZoom !== newZoom) {
      view.setCenter(fromLonLat(newCenter));
      view.setZoom(newZoom);
    }
  }, [center, zoom, showNomesEscolas]);

  // Atualizar marcadores quando dataPoints mudar
  useEffect(() => {
    if (!vectorSource.current || !dataPoints || !showMarcadores) return;

    // Limpar marcadores existentes
    vectorSource.current.clear();
    
    // Filtrar pontos válidos
    const pontosValidos = dataPoints.filter(point => {
      if (!point.latitude || !point.longitude) return false;
      const lat = parseFloat(point.latitude);
      const lng = parseFloat(point.longitude);
      return !isNaN(lat) && !isNaN(lng) && 
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180;
    });

    // Encontrar pares de marcadores próximos (lógica do Leaflet)
    const nearbyPairs = findNearbyPairs(pontosValidos);
    const usedIndices = new Set(nearbyPairs.flat());

    // Adicionar novos marcadores
    pontosValidos.forEach((point, index) => {
      if (point.latitude && point.longitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([point.longitude, point.latitude]))
        });
        feature.set('schoolData', point);
        
        // Marcar se este marcador faz parte de um par próximo
        const pairIndex = nearbyPairs.findIndex(pair => pair.includes(index));
        if (pairIndex !== -1) {
          feature.set('isNearbyPair', true);
        }
        
        vectorSource.current.addFeature(feature);
      }
    });
  }, [dataPoints, showMarcadores]);

  // Atualizar estilo dos marcadores quando o tipo de mapa mudar
  useEffect(() => {
    if (vectorLayer.current) {
      vectorLayer.current.setStyle((feature) => createClusterStyle(feature, (f) => createMarkerStyle(f, showNomesEscolas)));
    }
  }, [showNomesEscolas, createClusterStyle]);

  // Atualizar estilo dos marcadores quando showNomesEscolas mudar
  useEffect(() => {
    if (vectorLayer.current) {
      vectorLayer.current.setStyle((feature) => createClusterStyle(feature, (f) => createMarkerStyle(f, showNomesEscolas)));
      vectorLayer.current.changed(); // Força a atualização da renderização
    }
  }, [showNomesEscolas, createClusterStyle]);

  // Recriar ClusterSource quando showNomesEscolas mudar
  useEffect(() => {
    if (!map.current || !vectorSource.current) return;
    
    // Remover camada antiga
    if (vectorLayer.current) {
      map.current.removeLayer(vectorLayer.current);
    }

    // Criar novo ClusterSource com distância apropriada
    clusterSource.current = new ClusterSource({
      distance: showNomesEscolas ? 15 : 10,
      source: vectorSource.current,
      geometryFunction: (feature) => {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'Point') {
          return geometry;
        }
        return null;
      }
    });

    // Criar nova camada
    vectorLayer.current = new VectorLayer({
      source: clusterSource.current,
      style: (feature) => createClusterStyle(feature, (f) => createMarkerStyle(f, showNomesEscolas)),
      zIndex: 15
    });

    // Adicionar nova camada ao mapa
    map.current.addLayer(vectorLayer.current);

  }, [showNomesEscolas, createClusterStyle]);

  // Gerenciar camadas GeoJSON
  useEffect(() => {
    if (!map.current) return;

    // Remover camadas existentes primeiro
    if (terrasIndigenasLayerRef.current) {
      map.current.removeLayer(terrasIndigenasLayerRef.current);
      terrasIndigenasLayerRef.current = null;
    }
    if (estadoSPLayerRef.current) {
      map.current.removeLayer(estadoSPLayerRef.current);
      estadoSPLayerRef.current = null;
    }

    // Adicionar camada Terras Indígenas
    if (showTerrasIndigenas && terrasIndigenasData) {
      // Verificar se os dados têm a estrutura correta
      if (!terrasIndigenasData.features || terrasIndigenasData.features.length === 0) {
        return;
      }

      try {
        const geoJSONFormat = new GeoJSON({
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        const features = geoJSONFormat.readFeatures(terrasIndigenasData);
        
        if (features.length > 0) {
          const firstFeature = features[0];
          const geometry = firstFeature.getGeometry();
        }

        const terrasIndigenasLayer = new VectorLayer({
          source: new VectorSource({
            features: features
          }),
          style: terrasIndigenasStyle,
          zIndex: 10
        });

        // Adicionar interatividade
        terrasIndigenasLayer.getSource().getFeatures().forEach(feature => {
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

        map.current.addLayer(terrasIndigenasLayer);
        terrasIndigenasLayerRef.current = terrasIndigenasLayer;
      } catch (error) {
        // Error handling
      }
    }

    // Adicionar camada Estado SP
    if (showEstadoSP && estadoSPData) {
      // Verificar se os dados têm a estrutura correta
      if (!estadoSPData.features || estadoSPData.features.length === 0) {
        return;
      }

      try {
        const geoJSONFormat = new GeoJSON({
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        const features = geoJSONFormat.readFeatures(estadoSPData);
        
        if (features.length > 0) {
          const firstFeature = features[0];
          const geometry = firstFeature.getGeometry();
        }

        const estadoSPLayer = new VectorLayer({
          source: new VectorSource({
            features: features
          }),
          style: estadoSPStyle,
          zIndex: 5,
          interactive: false
        });

        map.current.addLayer(estadoSPLayer);
        estadoSPLayerRef.current = estadoSPLayer;
      } catch (error) {
        // Error handling
      }
    }
  }, [showTerrasIndigenas, showEstadoSP, terrasIndigenasData, estadoSPData]);

  // Adicionar event listeners para camadas GeoJSON
  useEffect(() => {
    if (!map.current) return;

    const handleClick = (event) => {
      const feature = map.current.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        const terraIndigenaInfo = feature.get('terraIndigenaInfo');
        if (terraIndigenaInfo && onPainelOpen) {
          onPainelOpen(terraIndigenaInfo);
        }
      }
    };

    map.current.on('click', handleClick);

    return () => {
      if (map.current) {
        map.current.un('click', handleClick);
      }
    };
  }, [onPainelOpen]);

  return (
    <MapWrapper ref={mapContainer}>
      {/* Informações do mapa */}
      {/* Bloco removido conforme solicitado */}
    </MapWrapper>
  );
};

export default OpenLayersMap; 