// Utilitários de marcadores

export function getMarkerColor(type) {
  // Retorna cor baseada no tipo de marcador
  switch (type) {
    case 'escola':
      return '#1976d2';
    case 'aldeia':
      return '#388e3c';
    default:
      return '#757575';
  }
} 