// Configurações centralizadas do mapa OpenLayers

export const MAP_CONFIG = {
  // Configurações iniciais
  center: [-48.4129, -22.3794], // longitude, latitude
  zoom: 7.63,
  maxZoom: 18,
  minZoom: 4,
  
  // Configurações específicas para mobile
  mobile: {
    center: [-48.5935, -21.9212], // longitude, latitude - Coordenadas especificadas
    zoom: 5.70 // Zoom ajustado para 5.70 conforme solicitado
  },
  
  // Configurações de clusterização
  clusterDistance: 30,
  
  // Configurações de proximidade para pares próximos
  proximityThreshold: 0.00005,
  
  // Configurações de zoom para clusters
  disableClusteringAtZoom: 12,
  
  // Configurações de tooltip
  tooltipOffset: 10
};

// Configurações de cores dos marcadores
export const MARKER_COLORS = {
  individual: '#3B82F6',
  individualBorder: '#1E40AF',
  cluster: {
    small: '#60A5FA',
    medium: '#3B82F6',
    large: '#2563EB',
    xlarge: '#1E40AF'
  }
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

// Configurações das camadas GeoJSON
export const GEOJSON_CONFIG = {
  terrasIndigenas: {
    regularizada: {
      fill: 'rgba(220, 20, 60, 0.3)',
      stroke: '#B22222'
    },
    declarada: {
      fill: 'rgba(139, 0, 0, 0.25)',
      stroke: '#B22222'
    }
  },
  estadoSP: {
    fill: 'rgba(0, 0, 0, 0.3)',
    stroke: '#000000'
  }
};

// Configurações de projeção
export const PROJECTION_CONFIG = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
}; 