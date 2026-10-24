import { Style, Fill, Stroke, Text, Icon, Circle as CircleStyle } from 'ol/style';
import { Point } from 'ol/geom';

// Caminho para o marcador SVG
const MARKER_SVG_PATH = `${import.meta.env.BASE_URL}map-marker.svg`;

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

// Compatibilidade com possíveis chamadas anteriores
export const setOrbitPaused = () => {};

/**
 * Cria estilo para o nó central do desabrochar (bloom)
 */
export const createBloomCenterStyle = (feature, zoomScale = 1.0) => {
  const progress = feature.get('bloomProgress') || 0;
  const hoverMult = feature.get('hoverScale') || 1.0;
  const isHovered = hoverMult > 1.05;
  const time = Date.now();
  const pulse = Math.sin(time / 350) * 0.04;

  if (progress <= 0.05) {
    // ESTADO FECHADO (CONJUNTO DE SERES PRÓXIMOS)
    // Pequeno brilho/halo orgânico sutil de fundo para unir o par harmonicamente no mapa
    const haloRadius = (32 + (isHovered ? 4 : 0)) * zoomScale * (1 + pulse);
    
    return new Style({
      image: new CircleStyle({
        radius: Math.max(14, haloRadius),
        fill: new Fill({ color: isHovered ? 'rgba(5, 150, 105, 0.18)' : 'rgba(5, 150, 105, 0.08)' }),
        stroke: new Stroke({ 
          color: isHovered ? '#10B981' : 'rgba(16, 185, 129, 0.40)', 
          width: isHovered ? 2 : 1.2,
          lineDash: [3, 3]
        })
      }),
      geometry: feature.getGeometry(),
      zIndex: 100
    });
  }

  // ESTADO DESABROCHADO OU EM TRANSIÇÃO
  // Botão central sutil de recolher (✕) quando expandido
  const nodeRadius = 13 * zoomScale * Math.min(1, progress * 1.2);
  if (nodeRadius <= 1) return null;

  return new Style({
    image: new CircleStyle({
      radius: nodeRadius * (isHovered ? 1.2 : 1.0),
      fill: new Fill({ color: isHovered ? '#FDE68A' : '#FEF3C7' }),
      stroke: new Stroke({ color: isHovered ? '#047857' : '#059669', width: isHovered ? 2.5 : 2 })
    }),
    text: new Text({
      text: progress > 0.6 ? '✕' : '✦',
      font: `bold ${Math.round((isHovered ? 13 : 11) * zoomScale)}px sans-serif`,
      fill: new Fill({ color: isHovered ? '#064E3B' : '#065F46' }),
      offsetY: 0
    }),
    geometry: feature.getGeometry(),
    zIndex: 5000
  });
};

// Cores dos ramos (cipós) de cada ser do grupo, em ordem de bloomIndex
const BLOOM_BRANCH_COLORS = [
  [16, 185, 129],
  [217, 119, 6],
  [99, 102, 241],
  [219, 39, 119],
  [14, 165, 233],
  [132, 204, 22]
];

/**
 * Calcula o deslocamento (em px, antes do zoomScale) de cada ser do grupo
 * nos estados fechado e desabrochado.
 */
const getBloomOffsets = (bloomIndex, bloomCount) => {
  if (bloomCount <= 2) {
    // Par de seres: um à esquerda/abaixo e outro à direita/acima
    return {
      closeDx: bloomIndex === 0 ? -36 : 36,
      closeDy: bloomIndex === 0 ? -16 : 18,
      openDx: bloomIndex === 0 ? -85 : 85,
      openDy: bloomIndex === 0 ? -38 : 42
    };
  }

  // Três ou mais seres: distribuídos em círculo, começando no alto à esquerda
  const angle = (150 - bloomIndex * (360 / bloomCount)) * (Math.PI / 180);
  const closeRadius = 30 + bloomCount * 3;
  const openRadius = 60 + bloomCount * 12;
  return {
    closeDx: Math.cos(angle) * closeRadius,
    closeDy: Math.sin(angle) * closeRadius,
    openDx: Math.cos(angle) * openRadius,
    openDy: Math.sin(angle) * openRadius
  };
};

/**
 * Cria estilo para cada ser do grupo desabrochado (bloom item)
 */
export const createBloomItemStyle = (feature, zoomScale = 1.0) => {
  const markerData = feature.get('markerData');
  if (!markerData) return null;

  const progress = feature.get('bloomProgress') || 0;
  const bloomIndex = feature.get('bloomIndex') || 0;
  const bloomCount = Math.max(1, (feature.get('bloomGroupFeatures')?.length || 3) - 1);
  const isSelected = feature.get('isSelected');
  const hoverMult = feature.get('hoverScale') || 1.0;
  const { extraDx, extraRotation } = getWobbleEffect(isSelected);

  const time = Date.now();

  // Deslocamentos nos estados fechado (progress = 0) e expandido (progress = 1)
  const offsets = getBloomOffsets(bloomIndex, bloomCount);
  const closeDx = offsets.closeDx * zoomScale;
  const closeDy = offsets.closeDy * zoomScale;
  const openDx = offsets.openDx * zoomScale;
  const openDy = offsets.openDy * zoomScale;
  const [br, bg, bb] = BLOOM_BRANCH_COLORS[bloomIndex % BLOOM_BRANCH_COLORS.length];
  const curveSign = bloomIndex % 2 === 0 ? -1 : 1;

  // Interpolação suave de posição entre fechado e expandido
  const curDx = closeDx + (openDx - closeDx) * progress;
  const curDy = closeDy + (openDy - closeDy) * progress;

  // Respiração e flutuação com sementes diferentes para cada ser
  const breath = Math.cos((time + bloomIndex * 600) / 550) * 0.015;
  const floatY = Math.sin((time + bloomIndex * 600) / 400) * 0.02;

  // Escala: ligeiramente mais compacto quando em repouso clusterizado, crescendo ao abrir
  // Grupos grandes usam seres um pouco menores para não se sobreporem
  const groupScaleMult = bloomCount >= 5 ? 0.8 : 1.0;
  const baseScale = (markerData.iconScale || 0.18) * zoomScale * groupScaleMult;
  const restingScaleMult = 0.88;
  const scaleProgressMult = restingScaleMult + (1.0 - restingScaleMult) * progress;
  const finalScale = baseScale * hoverMult * scaleProgressMult * (1 + breath);

  const styles = [];

  // 1. Ramo / cipó conectando a raiz central ao ser (aparece suavemente durante o desabrochar)
  if (progress > 0.1) {
    styles.push(new Style({
      renderer: (pixelCoordinates, state) => {
        const ctx = state.context;
        const [cx, cy] = pixelCoordinates;
        const targetPx = cx + curDx;
        const targetPy = cy - curDy; // canvas Y é invertido em relação ao displacement Y

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);

        // Curva orgânica de cipó
        const midX = (cx + targetPx) / 2 + curveSign * 10;
        const midY = (cy + targetPy) / 2 - curveSign * 8;
        ctx.quadraticCurveTo(midX, midY, targetPx, targetPy);

        ctx.strokeStyle = `rgba(${br}, ${bg}, ${bb}, ${0.85 * progress})`;
        ctx.lineWidth = 2.5 * zoomScale;
        ctx.setLineDash([4, 3]);
        ctx.stroke();

        // Pequeno broto vegetal no meio do ramo
        ctx.fillStyle = `rgb(${br}, ${bg}, ${bb})`;
        ctx.beginPath();
        ctx.arc(midX, midY, 3 * zoomScale, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
      },
      geometry: feature.getGeometry(),
      zIndex: 2500
    }));
  }

  // 2. Imagem da criatura
  let zIndex = 3000 + bloomIndex * 10;
  if (hoverMult > 1.05) zIndex = 6000;
  if (isSelected) zIndex = 7000;

  styles.push(new Style({
    image: new Icon({
      src: markerData.iconUrl || MARKER_SVG_PATH,
      scale: finalScale,
      anchor: [0.5, 0.5 + floatY],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      displacement: [curDx + extraDx, curDy],
      rotation: extraRotation
    }),
    geometry: feature.getGeometry(),
    zIndex: zIndex
  }));

  return styles;
};

function getWobbleEffect(isSelected) {
  let extraDx = 0;
  let extraRotation = 0;
  
  if (isSelected) {
    const loopDuration = 2000;
    const p = (Date.now() % loopDuration) / loopDuration;
    
    // keyframes: [progress, translateX, rotateDeg]
    // Baseado na animação wobble-hor-bottom, com escala ajustada
    const keyframes = [
      [0, 0, 0],
      [0.15, -15, -6], 
      [0.30, 7.5, 6],
      [0.45, -7.5, -3.6],
      [0.60, 4.5, 2.4],
      [0.75, -3, -1.2],
      [1, 0, 0]
    ];
    
    let k1 = keyframes[0], k2 = keyframes[1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i][0] && p <= keyframes[i+1][0]) {
        k1 = keyframes[i];
        k2 = keyframes[i+1];
        break;
      }
    }
    
    const segmentProgress = (p - k1[0]) / (k2[0] - k1[0]);
    extraDx = k1[1] + (k2[1] - k1[1]) * segmentProgress;
    // Converte rotação de graus para radianos
    extraRotation = (k1[2] + (k2[2] - k1[2]) * segmentProgress) * (Math.PI / 180);
  }
  
  return { extraDx, extraRotation };
}

/**
 * Cria estilo para marcador individual
 * @param {Object} feature - Feature do OpenLayers
 * @param {boolean} showNames - Se deve mostrar nomes das escolas
 * @returns {Style} Estilo do marcador
 */
export const createMarkerStyle = (feature, showNames = false, resolution = null) => {
  const type = feature.get('type');

  // Escala adaptativa baseada no zoom para evitar sobreposição em visão geral (macro) do estado
  let zoomScale = 1.0;
  if (resolution) {
    const zoom = Math.log2(156543.03392804097 / resolution);
    if (zoom <= 7.5) {
      zoomScale = 0.60;
    } else if (zoom >= 10.5) {
      zoomScale = 1.05;
    } else {
      const t = (zoom - 7.5) / (10.5 - 7.5);
      zoomScale = 0.60 + t * (1.05 - 0.60);
    }
  }

  // Se for elemento do sistema de desabrochar (bloom)
  if (type === 'bloom_center') {
    return createBloomCenterStyle(feature, zoomScale);
  }
  if (type === 'bloom_item') {
    return createBloomItemStyle(feature, zoomScale);
  }

  const markerData = feature.get('markerData') || feature.get('schoolData'); // Suporta ambos
  const isNearbyPair = feature.get('isNearbyPair');
  
  if (!markerData) return null;

  // Usa o ícone customizado se existir, caso contrário o padrão
  const iconSrc = markerData.iconUrl || MARKER_SVG_PATH;
  // Ajusta a escala se for imagem customizada (geralmente vêm maiores)
  const defaultScale = isNearbyPair ? 1.2 : 1.0;
  let baseScale = markerData.iconUrl ? (markerData.iconScale || 0.15) : defaultScale;
  
  // Aplica escala adaptativa baseada no zoom para ícones customizados
  if (markerData.iconUrl) {
    baseScale = baseScale * zoomScale;
  }

  // Pegar multiplicador de escala (para animação de hover)
  const hoverMult = feature.get('hoverScale') || 1.0;
  let finalScale = baseScale * hoverMult;
  let finalAnchor = [0.5, 0.5];
  
  const isSelected = feature.get('isSelected');
  const { extraDx, extraRotation } = getWobbleEffect(isSelected);

  // Adicionar animação idle (flutuação/respiração) para os seres (ícones customizados normais)
  if (markerData.iconUrl) {
    const time = Date.now();
    // Usa latitude como seed para que cada ícone anime de forma dessincronizada
    const seed = (markerData.latitude || 0) * 10000;
    
    // Flutuação vertical (altera levemente o anchor Y)
    // Movimento mais suave e menos agressivo
    const float = Math.sin((time + seed) / 400) * 0.02;
    finalAnchor[1] = 0.5 + float;
    
    // Respiração (altera levemente a escala)
    const breath = Math.cos((time + seed) / 600) * 0.015;
    finalScale = finalScale * (1 + breath);
  }

  // zIndex para marcador individual (ex: Urutau, Periquito):
  // Hover (5000), Selecionado (6000), Normal (150)
  let zIndex = 150;
  if (hoverMult > 1.05) zIndex = 5000;
  if (isSelected) zIndex = 6000;

  // Estilo base do marcador (ícone SVG ou customizado)
  const markerStyle = new Style({
    image: new Icon({
      src: iconSrc,
      scale: finalScale,
      anchor: finalAnchor,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      displacement: [extraDx, 0],
      rotation: extraRotation
    }),
    geometry: feature.getGeometry(),
    zIndex: zIndex
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
      geometry: feature.getGeometry(),
      zIndex: 7000
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
  let clusterSize; // clusterColor removido - não utilizado
  const count = features.length;

  if (count <= CLUSTER_SIZES.small.max) {
    clusterSize = CLUSTER_SIZES.small.size;
    // clusterColor = MARKER_COLORS.cluster.small; // Removido - não utilizado
  } else if (count <= CLUSTER_SIZES.medium.max) {
    clusterSize = CLUSTER_SIZES.medium.size;
    // clusterColor = MARKER_COLORS.cluster.medium; // Removido - não utilizado
  } else if (count <= CLUSTER_SIZES.large.max) {
    clusterSize = CLUSTER_SIZES.large.size;
    // clusterColor = MARKER_COLORS.cluster.large; // Removido - não utilizado
  } else if (count <= CLUSTER_SIZES.xlarge.max) {
    clusterSize = CLUSTER_SIZES.xlarge.size;
    // clusterColor = MARKER_COLORS.cluster.xlarge; // Removido - não utilizado
  } else {
    clusterSize = CLUSTER_SIZES.xxlarge.size;
    // clusterColor = MARKER_COLORS.cluster.xlarge; // Removido - não utilizado
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
 * Aplica estilo de hover ao marcador com anel branco de seleção que segue o contorno
 * @param {Object} feature - Feature do marcador
 * @param {Style} baseStyle - Estilo base do marcador
 * @returns {Style} Estilo com efeito hover
 */
export const applyHoverStyle = (feature, baseStyle) => {
  if (!baseStyle) return null;

  const geometry = feature.getGeometry();
  const markerData = feature.get('markerData') || feature.get('schoolData');
  const iconSrc = (markerData && markerData.iconUrl) ? markerData.iconUrl : MARKER_SVG_PATH;
  const baseScale = (markerData && markerData.iconUrl) ? (markerData.iconScale || 0.15) : 1.0;
  
  // Escalar o marcador 2x no hover e trazer para o topo (zIndex 5000)
  const hoverStyle = new Style({
    image: new Icon({
      src: iconSrc,
      scale: baseScale * 2.0, // Aumenta 2x
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    geometry: geometry,
    zIndex: 5000
  });

  // Se o baseStyle já tiver texto embutido (ex: modo mostrar nomes permanentemente), nós o mantemos
  if (Array.isArray(baseStyle) && baseStyle.length > 1) {
    // Retorna a imagem do hover e os textos/indicadores pré-existentes
    return [hoverStyle, ...baseStyle.slice(1)];
  }

  // Apenas o ícone dobrado de tamanho, pois o tooltip HTML padrão fará o resto
  return hoverStyle;
};

/**
 * Cria estilo para marcador selecionado
 * @param {Object} feature - Feature do marcador
 * @param {Style} baseStyle - Estilo base do marcador
 * @returns {Style} Estilo com efeito de seleção
 */
export const applySelectionStyle = (feature, baseStyle) => {
  if (!baseStyle) return null;

  const markerData = feature.get('markerData') || feature.get('schoolData');
  const iconSrc = (markerData && markerData.iconUrl) ? markerData.iconUrl : MARKER_SVG_PATH;
  const baseScale = (markerData && markerData.iconUrl) ? (markerData.iconScale || 0.15) : 1.0;

  const selectionStyle = new Style({
    image: new Icon({
      src: iconSrc,
      scale: baseScale * 1.5,
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction'
    }),
    geometry: feature.getGeometry()
  });

  return Array.isArray(baseStyle) ? [...baseStyle, selectionStyle] : [baseStyle, selectionStyle];
};
