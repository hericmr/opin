/**
 * Handler para clique em marcador de escola.
 * @param {ol.Feature} feature - Feature do marcador.
 * @param {Event} event - Evento de clique.
 * @param {Function} onPainelOpen - Callback para abrir painel.
 */
export function handleMarkerClick(feature, event, onPainelOpen) {
  const schoolData = feature.get('schoolData');
  if (schoolData && typeof onPainelOpen === 'function') {
    onPainelOpen(schoolData);
  }
}

/**
 * Handler para clique em features GeoJSON (ex: terras indígenas).
 * @param {ol.Feature} feature - Feature do GeoJSON.
 * @param {Event} event - Evento de clique.
 * @param {Function} onPainelOpen - Callback para abrir painel.
 */
export function handleGeoJSONClick(feature, event, onPainelOpen) {
  const terraIndigenaInfo = feature.get('terraIndigenaInfo');
  if (terraIndigenaInfo && typeof onPainelOpen === 'function') {
    onPainelOpen(terraIndigenaInfo);
  }
} 