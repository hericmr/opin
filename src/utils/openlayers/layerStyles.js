import { Style, Fill, Stroke, Text } from 'ol/style';

// Configurações de cores para camadas GeoJSON
export const LAYER_COLORS = {
  terrasIndigenas: {
    regularizada: {
      fill: 'rgba(220, 20, 60, 0.3)',
      stroke: '#B22222',
      hover: {
        fill: 'rgba(220, 20, 60, 0.45)',
        stroke: '#FF0000'
      }
    },
    declarada: {
      fill: 'rgba(139, 0, 0, 0.25)',
      stroke: '#B22222',
      hover: {
        fill: 'rgba(139, 0, 0, 0.4)',
        stroke: '#FF0000'
      }
    }
  },
  estadoSP: {
    fill: 'rgba(0, 0, 0, 0.3)',
    stroke: '#000000',
    hover: {
      fill: 'rgba(0, 0, 0, 0.4)',
      stroke: '#333333'
    }
  }
};

/**
 * Cria estilo para terras indígenas baseado no status
 * @param {Object} feature - Feature do GeoJSON
 * @param {boolean} isHovered - Se está em estado hover
 * @returns {Style} Estilo da terra indígena
 */
export const createTerrasIndigenasStyle = (feature, isHovered = false) => {
  if (!feature || !feature.properties) {
    return new Style({
      fill: new Fill({
        color: LAYER_COLORS.terrasIndigenas.regularizada.fill
      }),
      stroke: new Stroke({
        color: LAYER_COLORS.terrasIndigenas.regularizada.stroke,
        width: 2
      })
    });
  }

  const isRegularizada = feature.properties.fase_ti === 'Regularizada';
  const colorConfig = isRegularizada 
    ? LAYER_COLORS.terrasIndigenas.regularizada 
    : LAYER_COLORS.terrasIndigenas.declarada;

  const colors = isHovered ? colorConfig.hover : colorConfig;

  return new Style({
    fill: new Fill({
      color: colors.fill
    }),
    stroke: new Stroke({
      color: colors.stroke,
      width: isHovered ? 3 : 2,
      lineDash: isHovered ? [] : [3, 3]
    })
  });
};

/**
 * Cria estilo para estado de São Paulo
 * @param {Object} feature - Feature do GeoJSON
 * @param {boolean} isHovered - Se está em estado hover
 * @returns {Style} Estilo do estado
 */
export const createEstadoSPStyle = (feature, isHovered = false) => {
  const colors = isHovered ? LAYER_COLORS.estadoSP.hover : LAYER_COLORS.estadoSP;

  return new Style({
    fill: new Fill({
      color: colors.fill
    }),
    stroke: new Stroke({
      color: colors.stroke,
      width: isHovered ? 2 : 1
    })
  });
};

/**
 * Cria estilo para feature com label
 * @param {Object} feature - Feature do GeoJSON
 * @param {string} labelProperty - Propriedade para usar como label
 * @param {Object} styleOptions - Opções de estilo
 * @returns {Style} Estilo com label
 */
export const createLabeledFeatureStyle = (feature, labelProperty, styleOptions = {}) => {
  const {
    fillColor = 'rgba(0, 0, 0, 0.1)',
    strokeColor = '#000000',
    strokeWidth = 1,
    labelColor = '#000000',
    labelSize = '12px',
    labelFont = 'Arial'
  } = styleOptions;

  const labelText = feature.properties?.[labelProperty] || '';

  const styles = [
    new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth
      })
    })
  ];

  // Adicionar label se houver texto
  if (labelText) {
    styles.push(new Style({
      text: new Text({
        text: labelText,
        font: `${labelSize} ${labelFont}`,
        fill: new Fill({
          color: labelColor
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2
        }),
        offsetY: 0,
        textAlign: 'center'
      })
    }));
  }

  return styles;
};

/**
 * Cria estilo para feature com tooltip
 * @param {Object} feature - Feature do GeoJSON
 * @param {string} tooltipText - Texto do tooltip
 * @param {Object} styleOptions - Opções de estilo
 * @returns {Style} Estilo com tooltip
 */
export const createFeatureWithTooltipStyle = (feature, tooltipText, styleOptions = {}) => {
  const {
    fillColor = 'rgba(0, 0, 0, 0.1)',
    strokeColor = '#000000',
    strokeWidth = 1,
    tooltipColor = '#1F2937',
    tooltipBackground = 'rgba(255, 255, 255, 0.95)',
    tooltipBorder = '#E5E7EB'
  } = styleOptions;

  const styles = [
    new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth
      })
    })
  ];

  // Adicionar tooltip como texto
  if (tooltipText) {
    styles.push(new Style({
      text: new Text({
        text: tooltipText,
        font: '11px Arial',
        fill: new Fill({
          color: tooltipColor
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2
        }),
        offsetY: -15,
        textAlign: 'center',
        backgroundFill: new Fill({
          color: tooltipBackground
        }),
        backgroundStroke: new Stroke({
          color: tooltipBorder,
          width: 1
        }),
        padding: [4, 8]
      })
    }));
  }

  return styles;
};

/**
 * Cria estilo para feature selecionada
 * @param {Object} feature - Feature do GeoJSON
 * @param {Style} baseStyle - Estilo base
 * @param {Object} selectionOptions - Opções de seleção
 * @returns {Style} Estilo com efeito de seleção
 */
export const applySelectionStyle = (feature, baseStyle, selectionOptions = {}) => {
  const {
    fillColor = 'rgba(59, 130, 246, 0.3)',
    strokeColor = '#1E40AF',
    strokeWidth = 3,
    lineDash = [5, 5]
  } = selectionOptions;

  const selectionStyle = new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
      lineDash: lineDash
    })
  });

  return Array.isArray(baseStyle) ? [...baseStyle, selectionStyle] : [baseStyle, selectionStyle];
};

/**
 * Cria estilo para feature com indicador de status
 * @param {Object} feature - Feature do GeoJSON
 * @param {string} statusProperty - Propriedade que indica o status
 * @param {Object} statusConfig - Configuração dos status
 * @returns {Style} Estilo com indicador de status
 */
export const createStatusFeatureStyle = (feature, statusProperty, statusConfig) => {
  if (!feature || !feature.properties) {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.1)'
      }),
      stroke: new Stroke({
        color: '#000000',
        width: 1
      })
    });
  }

  const status = feature.properties[statusProperty];
  const config = statusConfig[status] || statusConfig.default || {
    fill: 'rgba(0, 0, 0, 0.1)',
    stroke: '#000000'
  };

  return new Style({
    fill: new Fill({
      color: config.fill
    }),
    stroke: new Stroke({
      color: config.stroke,
      width: config.strokeWidth || 1
    })
  });
};

/**
 * Cria estilo para feature com gradiente baseado em valor numérico
 * @param {Object} feature - Feature do GeoJSON
 * @param {string} valueProperty - Propriedade com valor numérico
 * @param {Object} gradientConfig - Configuração do gradiente
 * @returns {Style} Estilo com gradiente
 */
export const createGradientFeatureStyle = (feature, valueProperty, gradientConfig) => {
  if (!feature || !feature.properties) {
    return new Style({
      fill: new Fill({
        color: gradientConfig.defaultColor || 'rgba(0, 0, 0, 0.1)'
      }),
      stroke: new Stroke({
        color: gradientConfig.strokeColor || '#000000',
        width: gradientConfig.strokeWidth || 1
      })
    });
  }

  const value = parseFloat(feature.properties[valueProperty]) || 0;
  const { min, max, colors } = gradientConfig;

  // Calcular cor baseada no valor
  let color;
  if (value <= min) {
    color = colors.min;
  } else if (value >= max) {
    color = colors.max;
  } else {
    // Interpolação linear entre cores
    const ratio = (value - min) / (max - min);
    color = interpolateColor(colors.min, colors.max, ratio);
  }

  return new Style({
    fill: new Fill({
      color: color
    }),
    stroke: new Stroke({
      color: gradientConfig.strokeColor || '#000000',
      width: gradientConfig.strokeWidth || 1
    })
  });
};

/**
 * Interpola entre duas cores
 * @param {string} color1 - Primeira cor (hex)
 * @param {string} color2 - Segunda cor (hex)
 * @param {number} ratio - Razão de interpolação (0-1)
 * @returns {string} Cor interpolada
 */
function interpolateColor(color1, color2, ratio) {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `rgb(${r}, ${g}, ${b})`;
}
