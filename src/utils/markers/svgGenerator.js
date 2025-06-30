/**
 * Gera SVG de marcador customizado para o mapa.
 * @param {string} color - Cor base do marcador.
 * @param {number} [size=24] - Tamanho do marcador.
 * @param {Object} options - Opções de customização.
 * @returns {string} SVG como string.
 */
export function createMarkerSVG(color, size = 24, options = {}) {
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
  const scale = size / 24;
  const circleRadius = 3 * scale;
  const glowRadius = 2 * scale;

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
}

/**
 * Função para criar SVG de cluster
 * @param {string} color - Cor do cluster
 * @param {number} size - Tamanho do cluster
 * @param {number} count - Número de itens no cluster
 * @returns {string} SVG como string
 */
export const createClusterSVG = (color, size, count) => {
  return createMarkerSVG(color, size, {
    showShadow: true,
    showGradient: true,
    showGlow: count > 20,
    isNearbyPair: false
  });
}; 