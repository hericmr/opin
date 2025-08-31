import { Style, Fill, Stroke, Text, Icon } from 'ol/style';
import { Point } from 'ol/geom';
import { Feature } from 'ol';

// Caminho para o marcador SVG
const MARKER_SVG_PATH = `${process.env.PUBLIC_URL || ''}/map-marker.svg`;

// Configurações de cores dos marcadores
export const MARKER_COLORS = {
  individual: '#3B82F6',
  individualBorder: '#1E40AF',
  cluster: {
    small: '#60A5FA',
    medium: '#3B82F6',
    large: '#2563EB',
    xlarge: '#1E40AF'
  },
  nearbyPair: '#FF6B6B'
};

// Configurações de tamanhos dos clusters
export const CLUSTER_SIZES = {
  small: { min: 2, max: 10, size: 50 },
  medium: { min: 11, max: 20, size: 52 },
  large: { min: 21, max: 50, size: 56 },
  xlarge: { min: 51, max: 100, size: 64 },
  xxlarge: { min: 101, size: 72 }
};

// Configurações de fontes para clusters
export const CLUSTER_FONTS = {
  small: 'bold 14px Arial',
  medium: 'bold 15px Arial',
  large: 'bold 16px Arial',
  xlarge: 'bold 18px Arial'
};

/**
 * Cria estilo para marcador individual
 * @param {Object} feature - Feature do OpenLayers
 * @param {boolean} showNames - Se deve mostrar nomes das escolas
 * @returns {Style} Estilo do marcador
 */
export const createMarkerStyle = (feature, showNames = false) => {
  const markerData = feature.get('markerData') || feature.get('schoolData'); // Suporta ambos
  const isNearbyPair = feature.get('isNearbyPair');
  
  if (!markerData) return null;

  const baseColor = isNearbyPair ? MARKER_COLORS.nearbyPair : MARKER_COLORS.individual;
  const borderColor = isNearbyPair ? '#DC2626' : MARKER_COLORS.individualBorder;

  // Estilo base do marcador (ícone SVG)
  const markerStyle = new Style({
    image: new Icon({
      src: MARKER_SVG_PATH,
      scale: isNearbyPair ? 1.2 : 1.0,
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    geometry: feature.getGeometry()
  });

  // Se deve mostrar nomes, adicionar texto
  if (showNames && markerData.titulo) {
    const textStyle = new Style({
      text: new Text({
        text: markerData.titulo,
        font: '12px Arial',
        fill: new Fill({
          color: '#1F2937'
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2
        }),
        offsetY: -15,
        textAlign: 'center'
      }),
      geometry: feature.getGeometry()
    });
    
    return [markerStyle, textStyle];
  }

  return markerStyle;
};

/**
 * Cria estilo para cluster de marcadores
 * @param {Object} feature - Feature do cluster
 * @param {Function} markerStyleFunction - Função para estilizar marcadores individuais
 * @returns {Style} Estilo do cluster
 */
export const createClusterStyle = (feature, markerStyleFunction) => {
  const features = feature.get('features');
  
  if (!features || features.length === 0) {
    return markerStyleFunction(feature);
  }

  // Se for apenas um marcador, usar estilo de marcador individual
  if (features.length === 1) {
    return markerStyleFunction(features[0]);
  }

  // Determinar tamanho e cor do cluster baseado na quantidade
  let clusterSize, clusterColor;
  const count = features.length;

  if (count <= CLUSTER_SIZES.small.max) {
    clusterSize = CLUSTER_SIZES.small.size;
    clusterColor = MARKER_COLORS.cluster.small;
  } else if (count <= CLUSTER_SIZES.medium.max) {
    clusterSize = CLUSTER_SIZES.medium.size;
    clusterColor = MARKER_COLORS.cluster.medium;
  } else if (count <= CLUSTER_SIZES.large.max) {
    clusterSize = CLUSTER_SIZES.large.size;
    clusterColor = MARKER_COLORS.cluster.large;
  } else if (count <= CLUSTER_SIZES.xlarge.max) {
    clusterSize = CLUSTER_SIZES.xlarge.size;
    clusterColor = MARKER_COLORS.cluster.xlarge;
  } else {
    clusterSize = CLUSTER_SIZES.xxlarge.size;
    clusterColor = MARKER_COLORS.cluster.xlarge;
  }

  // Determinar fonte baseada no tamanho
  let font;
  if (count <= CLUSTER_SIZES.small.max) {
    font = CLUSTER_FONTS.small;
  } else if (count <= CLUSTER_SIZES.medium.max) {
    font = CLUSTER_FONTS.medium;
  } else if (count <= CLUSTER_SIZES.large.max) {
    font = CLUSTER_FONTS.large;
  } else {
    font = CLUSTER_FONTS.xlarge;
  }

  return new Style({
    image: new Icon({
      src: MARKER_SVG_PATH,
      scale: Math.max(0.8, clusterSize / 80),
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    text: new Text({
      text: count.toString(),
      font: font,
      fill: new Fill({
        color: '#FFFFFF'
      }),
      stroke: new Stroke({
        color: '#1F2937',
        width: 1
      })
    })
  });
};

/**
 * Cria estilo para marcador com indicador de par próximo
 * @param {Object} feature - Feature do marcador
 * @returns {Style} Estilo do marcador com indicador
 */
export const createNearbyPairStyle = (feature) => {
  const baseStyle = createMarkerStyle(feature, false);
  
  if (!baseStyle || !Array.isArray(baseStyle)) {
    return baseStyle;
  }

  // Adicionar indicador de par próximo
  const indicatorStyle = new Style({
    image: new Icon({
      src: MARKER_SVG_PATH,
      scale: 0.5,
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    geometry: feature.getGeometry()
  });

  // Posicionar indicador no canto superior direito
  const geometry = feature.getGeometry();
  const coordinates = geometry.getCoordinates();
  const offsetX = 0.0001; // Ajustar conforme necessário
  const offsetY = 0.0001;
  
  const indicatorGeometry = new Point([
    coordinates[0] + offsetX,
    coordinates[1] + offsetY
  ]);
  
  indicatorStyle.setGeometry(indicatorGeometry);
  
  return [...baseStyle, indicatorStyle];
};

/**
 * Cria estilo para marcador com tooltip
 * @param {Object} feature - Feature do marcador
 * @param {string} tooltipText - Texto do tooltip
 * @returns {Style} Estilo do marcador com tooltip
 */
export const createMarkerWithTooltipStyle = (feature, tooltipText) => {
  const baseStyle = createMarkerStyle(feature, false);
  
  if (!baseStyle) return null;

  // Adicionar tooltip como texto
  const tooltipStyle = new Style({
    text: new Text({
      text: tooltipText,
      font: '11px Arial',
      fill: new Fill({
        color: '#1F2937'
      }),
      stroke: new Stroke({
        color: '#FFFFFF',
        width: 2
      }),
      offsetY: -25,
      textAlign: 'center',
      backgroundFill: new Fill({
        color: 'rgba(255, 255, 255, 0.9)'
      }),
      backgroundStroke: new Stroke({
        color: '#E5E7EB',
        width: 1
      }),
      padding: [4, 8]
    }),
    geometry: feature.getGeometry()
  });

  return Array.isArray(baseStyle) ? [...baseStyle, tooltipStyle] : [baseStyle, tooltipStyle];
};

/**
 * Aplica estilo de hover ao marcador
 * @param {Object} feature - Feature do marcador
 * @param {Style} baseStyle - Estilo base do marcador
 * @returns {Style} Estilo com efeito hover
 */
export const applyHoverStyle = (feature, baseStyle) => {
  if (!baseStyle) return null;

  const hoverStyle = new Style({
    image: new Icon({
      src: MARKER_SVG_PATH,
      scale: 1.3,
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    geometry: feature.getGeometry()
  });

  return Array.isArray(baseStyle) ? [...baseStyle, hoverStyle] : [baseStyle, hoverStyle];
};

/**
 * Cria estilo para marcador selecionado
 * @param {Object} feature - Feature do marcador
 * @param {Style} baseStyle - Estilo base do marcador
 * @returns {Style} Estilo com efeito de seleção
 */
export const applySelectionStyle = (feature, baseStyle) => {
  if (!baseStyle) return null;

  const selectionStyle = new Style({
    image: new Icon({
      src: MARKER_SVG_PATH,
      scale: 1.5,
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    geometry: feature.getGeometry()
  });

  return Array.isArray(baseStyle) ? [...baseStyle, selectionStyle] : [baseStyle, selectionStyle];
};
