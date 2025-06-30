/**
 * Função de estilo para features de Terras Indígenas.
 * @param {ol.Feature} feature - Feature do OpenLayers.
 * @returns {Object} Objeto de estilo para a feature.
 */
export function terrasIndigenasStyle(feature) {
  const properties = feature.getProperties();
  const isRegularizada = properties.fase_ti === 'Regularizada';

  return {
    fill: {
      color: isRegularizada ? 'rgba(220, 20, 60, 0.3)' : 'rgba(139, 0, 0, 0.25)'
    },
    stroke: {
      color: '#B22222',
      width: 2,
      lineDash: [3, 3]
    }
  };
} 