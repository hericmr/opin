// Configurações para OpenLayers (open source, sem token)

export const mapConfig = {
  // OpenLayers (open source, sem token)
  openlayers: {
    sources: {
      osm: {
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      cartodb: {
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
      },
      esri: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '© <a href="https://www.esri.com/">Esri</a>'
      },
      esriSatellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '© <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19
      }
    }
  },

  // Configurações gerais
  general: {
    center: [-46.6388, -23.5489], // São Paulo
    zoom: 8,
    maxZoom: 18,
    minZoom: 4,
    // Configurações para eliminar gaps
    tileSize: 256,
    tilePixelRatio: 1,
    wrapX: false,
    // Configurações de performance
    preload: 1,
    useInterimTilesOnError: false,
    crossSourceCollisions: false
  }
};

// Função para obter configuração específica
export const getMapConfig = (provider, type = 'general') => {
  return mapConfig[provider]?.[type] || mapConfig.general;
};

// Função para verificar se um provedor está disponível
export const isProviderAvailable = (provider) => {
  return provider === 'openlayers'; // Apenas OpenLayers disponível
};

// Função para obter provedor padrão
export const getDefaultProvider = () => {
  return 'openlayers';
};

export default mapConfig; 