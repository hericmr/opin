/**
 * Constante para definir a proximidade entre marcadores (em graus)
 */
export const PROXIMITY_THRESHOLD = 0.00005;

/**
 * Função para encontrar pares de marcadores próximos
 * @param {Array} pontos - Array de pontos com latitude e longitude
 * @param {number} threshold - Limiar de proximidade (padrão: PROXIMITY_THRESHOLD)
 * @returns {Array} Array de pares de índices próximos
 */
export const findNearbyPairs = (pontos, threshold = PROXIMITY_THRESHOLD) => {
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

      if (latDiff < threshold && lngDiff < threshold) {
        pairs.push([i, j]);
        used.add(i);
        used.add(j);
        break;
      }
    }
  }

  return pairs;
};

/**
 * Função para calcular distância entre dois pontos
 * @param {Object} point1 - Primeiro ponto {latitude, longitude}
 * @param {Object} point2 - Segundo ponto {latitude, longitude}
 * @returns {number} Distância em graus
 */
export const calculateDistance = (point1, point2) => {
  const latDiff = Math.abs(parseFloat(point1.latitude) - parseFloat(point2.latitude));
  const lngDiff = Math.abs(parseFloat(point1.longitude) - parseFloat(point2.longitude));
  
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
};

/**
 * Função para verificar se dois pontos estão próximos
 * @param {Object} point1 - Primeiro ponto {latitude, longitude}
 * @param {Object} point2 - Segundo ponto {latitude, longitude}
 * @param {number} threshold - Limiar de proximidade
 * @returns {boolean} True se os pontos estão próximos
 */
export const arePointsNearby = (point1, point2, threshold = PROXIMITY_THRESHOLD) => {
  const distance = calculateDistance(point1, point2);
  return distance < threshold;
}; 