import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Circle, Fill, Stroke, Text, Icon } from 'ol/style';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import 'ol/ol.css';
import { MAP_CONFIG } from '../utils/mapConfig';
import { isMobile, MobileInteractionManager } from '../utils/mobileUtils';

// Componentes GeoJSON
import OpenLayersTerrasIndigenas from './OpenLayersTerrasIndigenas';
import OpenLayersEstadoSP from './OpenLayersEstadoSP';

// Registrar projeção SIRGAS 2000 (EPSG:4674) usada nos dados GeoJSON
proj4.defs('EPSG:4674', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs');
register(proj4);

// Constante para definir a proximidade entre marcadores (em graus) - mesma do Leaflet
const PROXIMITY_THRESHOLD = 0.00005;

// Função para encontrar pares de marcadores próximos (adaptada do Leaflet)
const findNearbyPairs = (pontos) => {
  const pairs = [];
  const used = new Set();

  for (let i = 0; i < pontos.length; i++) {
    if (used.has(i)) continue;

    for (let j = i + 1; j < pontos.length; j++) {
      if (used.has(j)) continue;

      const p1 = pontos[i];
      const p2 = pontos[j];

      const latDiff = Math.abs(parseFloat(p1.latitude) - parseFloat(p2.latitude));
      const lngDiff = Math.abs(parseFloat(p1.longitude) - parseFloat(p2.longitude));

      if (latDiff < PROXIMITY_THRESHOLD && lngDiff < PROXIMITY_THRESHOLD) {
        pairs.push([i, j]);
        used.add(i);
        used.add(j);
        break;
      }
    }
  }

  return pairs;
};

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
  // Log para debug do zoom recebido
  console.log('OpenLayersMap - Debug zoom recebido:', {
    center,
    zoom,
    defaultCenter: MAP_CONFIG.center,
    defaultZoom: MAP_CONFIG.zoom,
    mobileZoom: MAP_CONFIG.mobile.zoom
  });

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

  // Mobile interaction manager
  const mobileInteraction = useRef(null);
  const [tooltipElement, setTooltipElement] = useState(null);

  // Inicializar mobileInteraction de forma segura
  useEffect(() => {
    try {
      mobileInteraction.current = new MobileInteractionManager();
      console.log('OpenLayersMap: MobileInteractionManager inicializado com sucesso');
    } catch (error) {
      console.error('OpenLayersMap: Erro ao inicializar MobileInteractionManager:', error);
      mobileInteraction.current = null;
    }
  }, []);

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

  // Função para criar estilo dos marcadores individuais
  const createMarkerStyle = useCallback((feature) => {
    try {
      const schoolData = feature.get('schoolData');
      if (!schoolData) return null;

      const baseColor = '#3B82F6'; // Azul para satélite, violeta para rua
      const borderColor = '#1E40AF';

      // Verificar se é parte de um par próximo
      const isNearbyPair = feature.get('isNearbyPair');
      const pairIndex = feature.get('pairIndex');

      // Usar a função createMarkerSVG para criar o marcador (tamanho reduzido)
      const svg = createMarkerSVG(baseColor, 24, {
        borderColor: borderColor,
        showShadow: true,
        showGradient: true,
        showGlow: false,
        isNearbyPair: isNearbyPair
      });

      // Criar URL de dados para o SVG
      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

      // Criar estilo base com ícone (escala reduzida)
      const style = new Style({
        image: new Icon({
          src: svgUrl,
          scale: isNearbyPair ? 1.1 : 1.0, // Marcadores de pares próximos são ligeiramente maiores
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction'
        })
      });

      // Adicionar texto apenas se showNomesEscolas for true
      if (showNomesEscolas) {
        style.setText(new Text({
          text: schoolData.titulo || 'Escola',
          font: 'bold 10px Arial',
          fill: new Fill({
            color: '#FFFFFF'
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 2
          }),
          offsetY: isNearbyPair ? -35 : -30, // Ajustar posição para marcadores menores
          textAlign: 'center',
          textBaseline: 'middle'
        }));
      }

      return style;
    } catch (error) {
      console.error('OpenLayersMap: Erro ao criar estilo do marcador:', error);
      return null; // Return null on error to prevent rendering issues
    }
  }, [showNomesEscolas]);

  // Função para criar estilo dos clusters
  const createClusterStyle = useCallback((feature) => {
    try {
      const features = feature.get('features');
      if (!features || features.length === 0) {
        return null; // Return null for invalid features
      }
      
      const size = features.length;

      // Se for apenas um marcador, retorna estilo individual
      if (size === 1) {
        const singleFeature = features[0];
        if (!singleFeature) return null;
        return createMarkerStyle(singleFeature);
      }

      // Determinar cor e tamanho base baseado na quantidade de escolas (tamanhos reduzidos)
      let baseColor = '#3B82F6';
      let baseSize = 32; // Tamanho base reduzido para clusters
      
      if (size > 100) {
        baseColor = '#1E40AF';
        baseSize = 40;
      } else if (size > 50) {
        baseColor = '#2563EB';
        baseSize = 36;
      } else if (size > 20) {
        baseColor = '#3B82F6';
        baseSize = 34;
      } else if (size > 10) {
        baseColor = '#60A5FA';
        baseSize = 33;
      }

      // Calcular escala proporcional (mínimo 1.0x, máximo 1.8x)
      const scale = Math.min(1.0 + (size * 0.015), 1.8);
      const finalSize = Math.round(baseSize * scale);

      // Usar a função createMarkerSVG para criar o cluster
      const svg = createMarkerSVG(baseColor, finalSize, {
        borderColor: baseColor,
        showShadow: true,
        showGradient: true,
        showGlow: size > 20, // Adicionar brilho para clusters grandes
        isNearbyPair: false // Clusters não têm indicador de par próximo
      });

      // Criar URL de dados para o SVG
      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

      // Determinar tamanho da fonte baseado no tamanho do cluster (reduzido)
      let fontSize = '12px';
      let fontWeight = 'bold';
      
      if (size > 100) {
        fontSize = '14px';
      } else if (size > 50) {
        fontSize = '13px';
      } else if (size > 20) {
        fontSize = '12px';
      }

      return new Style({
        image: new Icon({
          src: svgUrl,
          scale: 1,
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction'
        }),
        text: new Text({
          text: size.toString(),
          font: `${fontWeight} ${fontSize} Arial`,
          fill: new Fill({
            color: '#FFFFFF'
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 2
          }),
          offsetY: finalSize * 0.6 // Posicionar texto abaixo do marcador
        })
      });
    } catch (error) {
      console.error('OpenLayersMap: Erro ao criar estilo do cluster:', error);
      return null; // Return null on error to prevent rendering issues
    }
  }, [createMarkerStyle]);

  // Função para criar tooltip HTML
  const createTooltipHTML = useCallback((schoolData) => {
    return schoolData.titulo || 'Escola Indígena';
  }, []);

  // Função para mostrar tooltip temporário em mobile
  const showMobileTooltip = useCallback((event, content) => {
    try {
      if (!isMobile()) {
        console.log('OpenLayersMap: showMobileTooltip chamado em desktop, ignorando');
        return;
      }

      if (!event || !content) {
        console.warn('OpenLayersMap: showMobileTooltip chamado sem event ou content');
        return;
      }

      console.log('OpenLayersMap: Mostrando tooltip mobile:', content);

      // Remove tooltip anterior
      if (tooltipElement && tooltipElement.parentNode) {
        tooltipElement.remove();
        setTooltipElement(null);
      }

      const element = document.createElement('div');
      element.className = 'mobile-tooltip';
      element.textContent = content;
      element.style.position = 'absolute';
      element.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      element.style.color = 'white';
      element.style.padding = '8px 12px';
      element.style.borderRadius = '6px';
      element.style.fontSize = '14px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontWeight = '500';
      element.style.maxWidth = '250px';
      element.style.whiteSpace = 'nowrap';
      element.style.overflow = 'hidden';
      element.style.textOverflow = 'ellipsis';
      element.style.zIndex = '1000';
      element.style.pointerEvents = 'none';
      element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      
      if (map.current && event.coordinate && mapContainer.current) {
        const coordinate = event.coordinate;
        const pixel = map.current.getPixelFromCoordinate(coordinate);
        if (pixel) {
          element.style.left = (pixel[0] + 10) + 'px';
          element.style.top = (pixel[1] - 10) + 'px';
          
          mapContainer.current.appendChild(element);
          setTooltipElement(element);

          // Auto-remove after 2 seconds
          setTimeout(() => {
            if (element.parentNode) {
              element.remove();
              setTooltipElement(null);
            }
          }, 2000);
        } else {
          console.warn('OpenLayersMap: Não foi possível obter pixel do coordinate');
        }
      } else {
        console.warn('OpenLayersMap: map.current, event.coordinate ou mapContainer.current não disponível');
      }
    } catch (error) {
      console.error('OpenLayersMap: Erro ao mostrar tooltip mobile:', error);
    }
  }, [tooltipElement]);

  // Inicializar mapa
  useEffect(() => {
    if (map.current) return;

    // Verificar se é mobile e ajustar configurações
    const isMobileDevice = isMobile();
    const initialCenter = isMobileDevice ? MAP_CONFIG.mobile.center : center;
    const initialZoom = isMobileDevice ? MAP_CONFIG.mobile.zoom : zoom;

    console.log('OpenLayersMap - Inicializando mapa:', {
      isMobile: isMobileDevice,
      initialCenter,
      initialZoom,
      originalCenter: center,
      originalZoom: zoom
    });

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
      style: createClusterStyle,
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
        minZoom: 4
      }),
      controls: defaultControls(),
      interactions: defaultInteractions()
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
            // Cluster com apenas um marcador
            const schoolData = features[0].get('schoolData');
            if (schoolData) {
              console.log('OpenLayersMap: Cluster com 1 marcador clicado:', schoolData.titulo);
              
              // Verificar se mobileInteraction está disponível
              if (mobileInteraction.current && typeof mobileInteraction.current.handleClick === 'function') {
                try {
                  mobileInteraction.current.handleClick(
                    feature,
                    // First click - show name
                    () => {
                      console.log('OpenLayersMap: Primeiro clique mobile (cluster) - mostrando nome');
                      showMobileTooltip(event, schoolData.titulo || 'Escola Indígena');
                    },
                    // Second click - open panel
                    () => {
                      console.log('OpenLayersMap: Segundo clique mobile (cluster) - abrindo painel');
                      onPainelOpen?.(schoolData);
                    },
                    isMobile()
                  );
                } catch (error) {
                  console.error('OpenLayersMap: Erro no handleClick do cluster:', error);
                  // Fallback para desktop behavior
                  onPainelOpen?.(schoolData);
                }
              } else {
                console.log('OpenLayersMap: MobileInteraction não disponível, usando fallback desktop');
                // Fallback para desktop behavior
                onPainelOpen?.(schoolData);
              }
            }
          } else {
            // Cluster com múltiplos marcadores, fazer zoom inteligente
            console.log(`OpenLayersMap: Cluster clicado com ${features.length} escolas`);
            
            // Calcular a extensão específica do cluster clicado
            const clusterExtent = feature.getGeometry().getExtent();
            
            // Obter o zoom atual
            const currentZoom = map.current.getView().getZoom();
            
            // Calcular zoom ideal baseado na quantidade de escolas no cluster
            let targetZoom = 12; // Zoom padrão para clusters
            if (features.length > 20) {
              targetZoom = 10; // Zoom menor para clusters muito grandes
            } else if (features.length > 10) {
              targetZoom = 11; // Zoom médio para clusters grandes
            } else if (features.length > 5) {
              targetZoom = 12; // Zoom padrão para clusters médios
            } else {
              targetZoom = 13; // Zoom maior para clusters pequenos
            }
            
            // Garantir que o zoom não seja menor que o atual (evitar zoom out)
            targetZoom = Math.max(targetZoom, currentZoom + 1);
            
            console.log(`OpenLayersMap: Fazendo zoom de ${currentZoom} para ${targetZoom}`);
            
            // Fazer zoom suave para a extensão do cluster
            map.current.getView().fit(clusterExtent, {
              duration: 800, // Animação mais suave
              padding: [80, 80, 80, 80], // Padding maior para melhor visualização
              maxZoom: targetZoom, // Limitar o zoom máximo
              callback: () => {
                console.log(`OpenLayersMap: Zoom concluído para cluster com ${features.length} escolas`);
              }
            });
          }
        } else {
          // Marcador individual
          const schoolData = feature.get('schoolData');
          if (schoolData) {
            console.log('OpenLayersMap: Marcador individual clicado:', schoolData.titulo);
            
            // Verificar se é mobile
            if (isMobile()) {
              console.log('OpenLayersMap: Clique mobile detectado no marcador individual');
              
              // Mobile: usar sistema de dois cliques
              if (mobileInteraction.current && typeof mobileInteraction.current.handleClick === 'function') {
                try {
                  mobileInteraction.current.handleClick(
                    feature,
                    // First click - show name
                    () => {
                      console.log('OpenLayersMap: Primeiro clique mobile - mostrando nome');
                      showMobileTooltip(event, schoolData.titulo || 'Escola Indígena');
                    },
                    // Second click - open panel
                    () => {
                      console.log('OpenLayersMap: Segundo clique mobile - abrindo painel');
                      onPainelOpen?.(schoolData);
                    },
                    isMobile()
                  );
                } catch (error) {
                  console.error('OpenLayersMap: Erro no handleClick do marcador individual:', error);
                  // Fallback se mobileInteraction falhar
                  onPainelOpen?.(schoolData);
                }
              } else {
                console.log('OpenLayersMap: MobileInteraction não disponível para marcador individual, usando fallback');
                // Fallback se mobileInteraction não estiver disponível
                onPainelOpen?.(schoolData);
              }
            } else {
              // Desktop: abrir painel diretamente
              console.log('OpenLayersMap: Clique desktop - abrindo painel diretamente');
              onPainelOpen?.(schoolData);
            }
          }
        }
      }
    });

    // Event listener para hover nos marcadores (tooltips)
    let tooltipElement = null;
    let currentFeature = null;

    map.current.on('pointermove', (event) => {
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

    // Cleanup
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [center, zoom, createBaseLayers, createClusterStyle, createTooltipHTML, showMobileTooltip, onPainelOpen]);

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
      console.log('OpenLayersMap - Atualizando configurações do mapa:', {
        isMobile: isMobileDevice,
        newCenter,
        newZoom,
        currentCenter,
        currentZoom
      });

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

    console.log(`OpenLayersMap: Processando ${pontosValidos.length} marcadores válidos`);
    console.log(`OpenLayersMap: Encontrados ${nearbyPairs.length} pares próximos`);

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
          feature.set('pairIndex', pairIndex);
        }
        
        vectorSource.current.addFeature(feature);
      }
    });

    console.log(`OpenLayersMap: Adicionados ${pontosValidos.length} marcadores com clustering inteligente`);
  }, [dataPoints, showMarcadores]);

  // Atualizar estilo dos marcadores quando o tipo de mapa mudar
  useEffect(() => {
    if (vectorLayer.current) {
      vectorLayer.current.setStyle(createClusterStyle);
    }
  }, [createClusterStyle]);

  // Atualizar estilo dos marcadores quando showNomesEscolas mudar
  useEffect(() => {
    if (vectorLayer.current) {
      console.log('OpenLayersMap: Atualizando estilo dos marcadores - showNomesEscolas:', showNomesEscolas);
      vectorLayer.current.setStyle(createClusterStyle);
      vectorLayer.current.changed(); // Força a atualização da renderização
    }
  }, [showNomesEscolas, createClusterStyle]);

  // Recriar ClusterSource quando showNomesEscolas mudar
  useEffect(() => {
    if (!map.current || !vectorSource.current) return;

    console.log('OpenLayersMap: Recriando ClusterSource - showNomesEscolas:', showNomesEscolas);
    
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
      style: createClusterStyle,
      zIndex: 15
    });

    // Adicionar nova camada ao mapa
    map.current.addLayer(vectorLayer.current);

  }, [showNomesEscolas, createClusterStyle]);

  // Gerenciar camadas GeoJSON
  useEffect(() => {
    if (!map.current) return;

    console.log('OpenLayersMap: Gerenciando camadas GeoJSON:', {
      showTerrasIndigenas,
      showEstadoSP,
      terrasIndigenasData: !!terrasIndigenasData,
      estadoSPData: !!estadoSPData,
      terrasFeatures: terrasIndigenasData?.features?.length || 0,
      estadoFeatures: estadoSPData?.features?.length || 0,
      mapLayers: map.current.getLayers().getLength()
    });

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
      console.log('OpenLayersMap: Adicionando camada Terras Indígenas');
      console.log('OpenLayersMap: Dados Terras Indígenas:', {
        type: terrasIndigenasData.type,
        features: terrasIndigenasData.features?.length || 0,
        crs: terrasIndigenasData.crs,
        firstFeature: terrasIndigenasData.features?.[0] ? {
          type: terrasIndigenasData.features[0].type,
          properties: terrasIndigenasData.features[0].properties ? Object.keys(terrasIndigenasData.features[0].properties) : 'Sem propriedades',
          geometry: terrasIndigenasData.features[0].geometry ? {
            type: terrasIndigenasData.features[0].geometry.type,
            coordinates: terrasIndigenasData.features[0].geometry.coordinates ? 
              `${terrasIndigenasData.features[0].geometry.coordinates.length} arrays` : 'Sem coordenadas'
          } : 'Sem geometria'
        } : 'Nenhum feature'
      });

      // Verificar se os dados têm a estrutura correta
      if (!terrasIndigenasData.features || terrasIndigenasData.features.length === 0) {
        console.error('OpenLayersMap: Dados Terras Indígenas não têm features válidas');
        return;
      }

      // Teste: verificar se as coordenadas estão no formato correto
      const firstFeature = terrasIndigenasData.features[0];
      if (firstFeature.geometry && firstFeature.geometry.coordinates) {
        const coords = firstFeature.geometry.coordinates[0][0]; // Primeira coordenada
        console.log('OpenLayersMap: Primeira coordenada das Terras Indígenas:', coords);
        console.log('OpenLayersMap: Tipo das coordenadas:', typeof coords[0], typeof coords[1]);
      }

      try {
        const geoJSONFormat = new GeoJSON({
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        const features = geoJSONFormat.readFeatures(terrasIndigenasData);
        console.log('OpenLayersMap: Features lidas do GeoJSON:', features.length);
        
        if (features.length > 0) {
          const firstFeature = features[0];
          const geometry = firstFeature.getGeometry();
          console.log('OpenLayersMap: Primeira feature processada:', {
            geometry: geometry ? geometry.getType() : 'Sem geometria',
            extent: geometry ? geometry.getExtent() : 'Sem extent',
            properties: firstFeature.getProperties()
          });
        }

        const terrasIndigenasLayer = new VectorLayer({
          source: new VectorSource({
            features: features
          }),
          style: (feature) => {
            const properties = feature.getProperties();
            const isRegularizada = properties.fase_ti === 'Regularizada';
            
            return new Style({
              fill: new Fill({
                color: isRegularizada ? 'rgba(220, 20, 60, 0.3)' : 'rgba(139, 0, 0, 0.25)'
              }),
              stroke: new Stroke({
                color: '#B22222',
                width: 2,
                lineDash: [3, 3]
              })
            });
          },
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
        console.log('OpenLayersMap: Camada Terras Indígenas adicionada com sucesso. Total de camadas:', map.current.getLayers().getLength());
      } catch (error) {
        console.error('OpenLayersMap: Erro ao processar Terras Indígenas:', error);
      }
    }

    // Adicionar camada Estado SP
    if (showEstadoSP && estadoSPData) {
      console.log('OpenLayersMap: Adicionando camada Estado SP');
      console.log('OpenLayersMap: Dados Estado SP:', {
        type: estadoSPData.type,
        features: estadoSPData.features?.length || 0,
        crs: estadoSPData.crs,
        firstFeature: estadoSPData.features?.[0] ? {
          type: estadoSPData.features[0].type,
          properties: estadoSPData.features[0].properties ? Object.keys(estadoSPData.features[0].properties) : 'Sem propriedades',
          geometry: estadoSPData.features[0].geometry ? {
            type: estadoSPData.features[0].geometry.type,
            coordinates: estadoSPData.features[0].geometry.coordinates ? 
              `${estadoSPData.features[0].geometry.coordinates.length} arrays` : 'Sem coordenadas'
          } : 'Sem geometria'
        } : 'Nenhum feature'
      });

      // Verificar se os dados têm a estrutura correta
      if (!estadoSPData.features || estadoSPData.features.length === 0) {
        console.error('OpenLayersMap: Dados Estado SP não têm features válidas');
        return;
      }

      // Teste: verificar se as coordenadas estão no formato correto
      const firstFeature = estadoSPData.features[0];
      if (firstFeature.geometry && firstFeature.geometry.coordinates) {
        const coords = firstFeature.geometry.coordinates[0][0]; // Primeira coordenada
        console.log('OpenLayersMap: Primeira coordenada do Estado SP:', coords);
        console.log('OpenLayersMap: Tipo das coordenadas Estado SP:', typeof coords[0], typeof coords[1]);
      }

      try {
        const geoJSONFormat = new GeoJSON({
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        const features = geoJSONFormat.readFeatures(estadoSPData);
        console.log('OpenLayersMap: Features Estado SP lidas do GeoJSON:', features.length);
        
        if (features.length > 0) {
          const firstFeature = features[0];
          const geometry = firstFeature.getGeometry();
          console.log('OpenLayersMap: Primeira feature Estado SP processada:', {
            geometry: geometry ? geometry.getType() : 'Sem geometria',
            extent: geometry ? geometry.getExtent() : 'Sem extent',
            properties: firstFeature.getProperties()
          });
        }

        const estadoSPLayer = new VectorLayer({
          source: new VectorSource({
            features: features
          }),
          style: new Style({
            fill: new Fill({
              color: 'rgba(0, 0, 0, 0.3)'
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 2
            })
          }),
          zIndex: 5,
          interactive: false
        });

        map.current.addLayer(estadoSPLayer);
        estadoSPLayerRef.current = estadoSPLayer;
        console.log('OpenLayersMap: Camada Estado SP adicionada com sucesso. Total de camadas:', map.current.getLayers().getLength());
      } catch (error) {
        console.error('OpenLayersMap: Erro ao processar Estado SP:', error);
      }
    }

    console.log('OpenLayersMap: Finalização - Total de camadas no mapa:', map.current.getLayers().getLength());
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
    <div className={className} ref={mapContainer}>
      {/* Informações do mapa */}
      <div className="absolute bottom-20 sm:bottom-4 left-4 z-10 bg-white bg-opacity-95 rounded-lg shadow-lg p-3">
        <div className="text-xs text-gray-600">
          Lat: {mapInfo.lat} | Lng: {mapInfo.lng}
        </div>
        <div className="text-xs text-gray-600">
          Zoom: {mapInfo.zoom}
        </div>
      </div>
    </div>
  );
};

export default OpenLayersMap; 