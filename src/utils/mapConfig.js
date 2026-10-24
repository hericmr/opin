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
  
  // Configurações de clusterização - Ajustadas para mostrar mais marcadores individuais
  clusterDistance: 15, // Reduzido para mostrar mais marcadores individuais
  clusterMinDistance: 3, // Reduzido para permitir marcadores mais próximos
  clusterAnimationDuration: 300,
  
  // Configurações de proximidade para pares próximos
  proximityThreshold: 0.00005,
  
  // Configurações de zoom para clusters
  disableClusteringAtZoom: 12,
  
  // Configurações de tooltip
  tooltipOffset: 10,
  tooltipDelay: 200,
  
  // Configurações de interação
  interaction: {
    enableHover: true,
    enableClick: true,
    enableDoubleClick: true,
    enableTouch: true,
    clickDelay: 300,
    hoverDelay: 200
  },
  
  // Configurações de performance
  performance: {
    enableLazyLoading: true,
    maxFeaturesPerTile: 1000,
    enableFeatureCulling: true,
    enableTileCaching: true
  },

  // Configurações de animação
  ANIMATION_CONFIG: {
    duration: {
      marker: 300,
      cluster: 500,
      zoom: 800,
      pan: 600
    },
    easing: {
      marker: 'ease-out',
      cluster: 'ease-in-out',
      zoom: 'ease-out',
      pan: 'ease-out'
    }
  }
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
  },
  nearbyPair: '#FF6B6B',
  selected: '#10B981',
  hover: '#F59E0B'
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

// Configurações de projeção
export const PROJECTION_CONFIG = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
  // Projeção SIRGAS 2000 (EPSG:4674) usada nos dados GeoJSON
  sirgas2000: 'EPSG:4674'
};

// Configurações de camadas base
export const BASE_LAYER_CONFIG = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: '© <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19,
    wrapX: false,
    tilePixelRatio: 1,
    tileSize: 256
  },
  osm: {
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  terrain: {
    url: 'https://{a-d}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attributions: '© <a href="https://opentopomap.org/">OpenTopoMap</a> contributors',
    maxZoom: 17
  }
};

// Configurações de estilos para diferentes tipos de marcadores
export const MARKER_STYLE_CONFIG = {
  escola: {
    default: {
      radius: 6,
      fillColor: MARKER_COLORS.individual,
      strokeColor: MARKER_COLORS.individualBorder,
      strokeWidth: 2
    },
    hover: {
      radius: 8,
      fillColor: MARKER_COLORS.hover,
      strokeColor: '#D97706',
      strokeWidth: 3
    },
    selected: {
      radius: 10,
      fillColor: MARKER_COLORS.selected,
      strokeColor: '#059669',
      strokeWidth: 3,
      lineDash: [5, 5]
    },
    nearbyPair: {
      radius: 8,
      fillColor: MARKER_COLORS.nearbyPair,
      strokeColor: '#DC2626',
      strokeWidth: 2
    }
  },
  cluster: {
    small: {
      radius: CLUSTER_SIZES.small.size / 2,
      fillColor: MARKER_COLORS.cluster.small,
      strokeColor: '#FFFFFF',
      strokeWidth: 3
    },
    medium: {
      radius: CLUSTER_SIZES.medium.size / 2,
      fillColor: MARKER_COLORS.cluster.medium,
      strokeColor: '#FFFFFF',
      strokeWidth: 3
    },
    large: {
      radius: CLUSTER_SIZES.large.size / 2,
      fillColor: MARKER_COLORS.cluster.large,
      strokeColor: '#FFFFFF',
      strokeWidth: 3
    },
    xlarge: {
      radius: CLUSTER_SIZES.xlarge.size / 2,
      fillColor: MARKER_COLORS.cluster.xlarge,
      strokeColor: '#FFFFFF',
      strokeWidth: 3
    }
  }
};

// Configurações de animações
export const ANIMATION_CONFIG = {
  duration: {
    marker: 300,
    cluster: 500,
    zoom: 800,
    pan: 600
  },
  easing: {
    marker: 'ease-out',
    cluster: 'ease-in-out',
    zoom: 'ease-out',
    pan: 'ease-out'
  }
};

// Configurações de responsividade
export const RESPONSIVE_CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  mobile: {
    clusterDistance: 12, // Reduzido para mobile
    tooltipOffset: 8,
    markerRadius: 5
  },
  tablet: {
    clusterDistance: 15, // Reduzido para tablet
    tooltipOffset: 10,
    markerRadius: 6
  },
  desktop: {
    clusterDistance: 15, // Reduzido para desktop
    tooltipOffset: 10,
    markerRadius: 6
  }
};

// Configurações de cache
export const CACHE_CONFIG = {
  markers: {
    maxSize: 1000,
    ttl: 300000, // 5 minutos
    enableCompression: true
  },
  tiles: {
    maxSize: 100,
    ttl: 600000, // 10 minutos
    enableCompression: true
  },
  geojson: {
    maxSize: 50,
    ttl: 1800000, // 30 minutos
    enableCompression: true
  }
};

// Configurações de debug
const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;
export const DEBUG_CONFIG = {
  enableLogging: isDevelopment,
  enablePerformanceMonitoring: isDevelopment,
  enableFeatureCount: isDevelopment,
  logLevel: isDevelopment ? 'debug' : 'error'
}; 