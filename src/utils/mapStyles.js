import { Style, Fill, Stroke, Text, Icon } from 'ol/style';
import { MARKER_COLORS, CLUSTER_SIZES, GEOJSON_CONFIG } from './mapConfig';

// Importar funções auxiliares
import { getClusterConfig, calculateClusterScale } from './mapUtils';

// Função para criar SVG base do marcador (gota invertida com bolinha branca)
export const createMarkerSVG = (color, size = 24, options = {}) => {
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

  // Path da gota invertida (marcador)
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

// Função para criar estilo dos marcadores individuais
export const createMarkerStyle = (feature) => {
  const schoolData = feature.get('schoolData');
  if (!schoolData) return null;

  const baseColor = MARKER_COLORS.individual;
  const borderColor = MARKER_COLORS.individualBorder;

  // Verificar se é parte de um par próximo
  const isNearbyPair = feature.get('isNearbyPair');

  // Usar a função createMarkerSVG para criar o marcador
  const svg = createMarkerSVG(baseColor, 32, {
    borderColor: borderColor,
    showShadow: true,
    showGradient: true,
    showGlow: false,
    isNearbyPair: isNearbyPair
  });

  // Criar URL de dados para o SVG
  const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

  // Criar estilo base com ícone
  return new Style({
    image: new Icon({
      src: svgUrl,
      scale: isNearbyPair ? 1.3 : 1.2, // Marcadores de pares próximos são ligeiramente maiores
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    })
  });
};

// Função para criar estilo dos clusters
export const createClusterStyle = (feature) => {
  const features = feature.get('features');
  const size = features.length;

  // Se for apenas um marcador, retorna estilo individual
  if (size === 1) {
    return createMarkerStyle(features[0]);
  }

  // Obter configuração do cluster
  const config = getClusterConfig(size);
  const scale = calculateClusterScale(size);
  const finalSize = Math.round(config.size * scale);

  // Usar a função createMarkerSVG para criar o cluster
  const svg = createMarkerSVG(config.color, finalSize, {
    borderColor: config.color,
    showShadow: true,
    showGradient: true,
    showGlow: size > 20, // Adicionar brilho para clusters grandes
    isNearbyPair: false // Clusters não têm indicador de par próximo
  });

  // Criar URL de dados para o SVG
  const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

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
      font: config.font,
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
};

// Função para criar estilo das Terras Indígenas
export const createTerrasIndigenasStyle = (feature) => {
  const properties = feature.getProperties();
  const isRegularizada = properties.fase_ti === 'Regularizada';
  
  const config = isRegularizada 
    ? GEOJSON_CONFIG.terrasIndigenas.regularizada
    : GEOJSON_CONFIG.terrasIndigenas.declarada;
  
  return new Style({
    fill: new Fill({
      color: config.fill
    }),
    stroke: new Stroke({
      color: config.stroke,
      width: 2,
      lineDash: [3, 3]
    })
  });
};

// Função para criar estilo do Estado SP
export const createEstadoSPStyle = () => {
  return new Style({
    fill: new Fill({
      color: GEOJSON_CONFIG.estadoSP.fill
    }),
    stroke: new Stroke({
      color: GEOJSON_CONFIG.estadoSP.stroke,
      width: 2
    })
  });
}; 