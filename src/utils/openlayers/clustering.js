import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { MAP_CONFIG } from '../mapConfig';

export class OpenLayersClustering {
  constructor(options = {}) {
    this.options = {
      distance: options.distance || MAP_CONFIG.clusterMinDistance,
      disableClusteringAtZoom: options.disableClusteringAtZoom || 18,
      animate: options.animate !== false,
      animationDuration: options.animationDuration || MAP_CONFIG.clusterAnimationDuration,
      ...options
    };
    
    this.markers = new Map();
    this.nearbyPairs = new Map();
    this.clusterSource = null;
    this.vectorLayer = null;
  }

  addMarker(markerData, id) {
    if (!markerData.latitude || !markerData.longitude) {
      console.warn('[OpenLayersClustering] Dados de marcador inválidos:', markerData);
      return null;
    }

    const feature = new Feature({
      geometry: new Point(fromLonLat([markerData.longitude, markerData.latitude]))
    });

    feature.set('markerData', markerData);
    feature.set('markerId', id);
    feature.set('type', 'marker');

    this.markers.set(id, feature);
    return feature;
  }

  removeMarker(id) {
    const feature = this.markers.get(id);
    if (feature) {
      this.markers.delete(id);
      this.removeFromNearbyPairs(id);
      return feature;
    }
    return null;
  }

  updateMarker(id, newData) {
    const feature = this.markers.get(id);
    if (feature) {
      feature.set('markerData', newData);
      if (newData.latitude && newData.longitude) {
        feature.getGeometry().setCoordinates(fromLonLat([newData.longitude, newData.latitude]));
      }
      return feature;
    }
    return null;
  }

  clearMarkers() {
    this.markers.clear();
    this.nearbyPairs.clear();
  }

  /**
   * Calcula a distância entre dois pontos usando a fórmula de Haversine
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  checkNearbyPair(feature, markerData) {
    const currentId = feature.get('markerId');
    const currentCoords = feature.getGeometry().getCoordinates();
    
    for (const [id, otherFeature] of this.markers) {
      if (id === currentId) continue;
      
      const otherCoords = otherFeature.getGeometry().getCoordinates();
      const distance = this.calculateDistance(
        currentCoords[1], currentCoords[0],
        otherCoords[1], otherCoords[0]
      );
      
      if (distance <= this.options.distance) {
        this.nearbyPairs.set(currentId, id);
        this.nearbyPairs.set(id, currentId);
        return true;
      }
    }
    
    return false;
  }

  removeFromNearbyPairs(id) {
    const pairedId = this.nearbyPairs.get(id);
    if (pairedId) {
      this.nearbyPairs.delete(id);
      this.nearbyPairs.delete(pairedId);
    }
  }

  getMarkers() {
    return Array.from(this.markers.values());
  }

  getMarkersInExtent(extent) {
    return this.getMarkers().filter(feature => {
      const coords = feature.getGeometry().getCoordinates();
      return coords[0] >= extent[0] && coords[0] <= extent[2] &&
             coords[1] >= extent[1] && coords[1] <= extent[3];
    });
  }

  getMarkersByProperty(property, value) {
    return this.getMarkers().filter(feature => {
      const markerData = feature.get('markerData');
      return markerData && markerData[property] === value;
    });
  }

  getMarkersStats() {
    return {
      total: this.markers.size,
      nearbyPairs: this.nearbyPairs.size / 2,
      clusters: this.calculateClusterCount()
    };
  }

  calculateClusterCount() {
    // Implementação simplificada para contar clusters
    const extent = this.getMarkersExtent();
    if (!extent) return 0;
    
    const area = (extent[2] - extent[0]) * (extent[3] - extent[1]);
    const density = this.markers.size / area;
    
    return Math.max(1, Math.floor(density * 100));
  }

  getMarkersExtent() {
    if (this.markers.size === 0) return null;
    
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    for (const feature of this.markers.values()) {
      const coords = feature.getGeometry().getCoordinates();
      minX = Math.min(minX, coords[0]);
      minY = Math.min(minY, coords[1]);
      maxX = Math.max(maxX, coords[0]);
      maxY = Math.max(maxY, coords[1]);
    }
    
    return [minX, minY, maxX, maxY];
  }

  exportToGeoJSON() {
    const features = this.getMarkers().map(feature => {
      const coords = feature.getGeometry().getCoordinates();
      const markerData = feature.get('markerData');
      
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coords[0], coords[1]]
        },
        properties: {
          ...markerData,
          markerId: feature.get('markerId'),
          isNearbyPair: this.nearbyPairs.has(feature.get('markerId'))
        }
      };
    });
    
    return {
      type: 'FeatureCollection',
      features
    };
  }

  importFromGeoJSON(geoJSON, idProperty = 'id') {
    this.clearMarkers();
    
    if (geoJSON.features) {
      geoJSON.features.forEach(feature => {
        if (feature.geometry && feature.geometry.type === 'Point') {
          const coords = feature.geometry.coordinates;
          const properties = feature.properties;
          
          const markerData = {
            latitude: coords[1],
            longitude: coords[0],
            ...properties
          };
          
          const id = properties[idProperty] || `imported_${Date.now()}_${Math.random()}`;
          this.addMarker(markerData, id);
          
          // Restaurar pares próximos se existirem
          if (properties.isNearbyPair) {
            // Implementar lógica para restaurar pares
          }
        }
      });
    }
  }

  getClusteringConfig() {
    return {
      distance: this.options.distance,
      disableClusteringAtZoom: this.options.disableClusteringAtZoom,
      animate: this.options.animate,
      animationDuration: this.options.animationDuration
    };
  }

  updateClusteringOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Método para cleanup e destruição da instância
   */
  destroy() {
    try {
      // Limpar todos os marcadores
      this.clearMarkers();
      
      // Limpar referências
      this.markers.clear();
      this.nearbyPairs.clear();
      this.clusterSource = null;
      this.vectorLayer = null;
      
      // Limpar opções
      this.options = null;
      
      console.log('[OpenLayersClustering] Instância destruída com sucesso');
    } catch (error) {
      console.error('[OpenLayersClustering] Erro ao destruir instância:', error);
    }
  }
}

/**
 * Encontra pares de pontos próximos baseado em um threshold
 */
export function findNearbyPairs(pontos, threshold = 0.00005) {
  const pares = [];
  const pontosProcessados = new Set();

  for (let i = 0; i < pontos.length; i++) {
    if (pontosProcessados.has(i)) continue;

    for (let j = i + 1; j < pontos.length; j++) {
      if (pontosProcessados.has(j)) continue;

      const distancia = calculateDistance(
        pontos[i].latitude,
        pontos[i].longitude,
        pontos[j].latitude,
        pontos[j].longitude
      );

      if (distancia <= threshold) {
        pares.push([i, j]);
        pontosProcessados.add(i);
        pontosProcessados.add(j);
        break;
      }
    }
  }

  return pares;
}

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Agrupa marcadores por proximidade
 */
export function groupMarkersByProximity(markers, maxDistance = 0.001) {
  const groups = [];
  const processed = new Set();

  for (let i = 0; i < markers.length; i++) {
    if (processed.has(i)) continue;

    const group = [i];
    processed.add(i);

    for (let j = i + 1; j < markers.length; j++) {
      if (processed.has(j)) continue;

      const distance = calculateDistance(
        markers[i].latitude,
        markers[i].longitude,
        markers[j].latitude,
        markers[j].longitude
      );

      if (distance <= maxDistance) {
        group.push(j);
        processed.add(j);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  return groups;
}
