import { Style, Fill, Stroke } from 'ol/style';

/**
 * Função de estilo para features de Terras Indígenas.
 * @param {ol.Feature} feature - Feature do OpenLayers.
 * @returns {ol.style.Style} Objeto de estilo do OpenLayers para a feature.
 */
export function terrasIndigenasStyle(feature) {
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
} 