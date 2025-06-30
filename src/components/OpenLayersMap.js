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
import { createMarkerSVG } from '../utils/markers/svgGenerator';

// Componentes GeoJSON
// import OpenLayersTerrasIndigenas from './OpenLayersTerrasIndigenas';
// import OpenLayersEstadoSP from './OpenLayersEstadoSP';

// Registrar projeção SIRGAS 2000 (EPSG:4674) usada nos dados GeoJSON
proj4.defs('EPSG:4674', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs');
register(proj4);

// Constante para definir a proximidade entre marcadores (em graus) - mesma do Leaflet
const PROXIMITY_THRESHOLD = 0.00005;

// Função para criar estilo dos marcadores individuais
const createMarkerStyle = useCallback((feature) => {
  try {
    const schoolData = feature.get('schoolData');
    if (!schoolData) return null;

    const baseColor = '#3B82F6'; // Azul para satélite, violeta para rua
    const borderColor = '#1E40AF';

    // Verificar se é parte de um par próximo
    const isNearbyPair = feature.get('isNearbyPair');

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
    return null; // Return null on error to prevent rendering issues
  }
}, [createMarkerStyle]);

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
          // Cluster com apenas um marcador
          handleMarkerClick(features[0], event);
        } else {
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
    vectorLayer.current.setStyle(createClusterStyle);
  }
}, [createClusterStyle]);

// Atualizar estilo dos marcadores quando showNomesEscolas mudar
useEffect(() => {
  if (vectorLayer.current) {
    vectorLayer.current.setStyle(createClusterStyle);
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
    style: createClusterStyle,
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
    <div className="absolute bottom-20 sm:bottom-4 left-4 z-10 bg-white bg-opacity-95 rounded-lg shadow-lg p-3">
      <div className="text-xs text-gray-600">
        Lat: {mapInfo.lat} | Lng: {mapInfo.lng}
      </div>
      <div className="text-xs text-gray-600">
        Zoom: {mapInfo.zoom}
      </div>
    </div>
  </MapWrapper>
);
};

export default OpenLayersMap; 