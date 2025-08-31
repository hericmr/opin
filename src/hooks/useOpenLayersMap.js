import { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ClusterSource from 'ol/source/Cluster';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import { MAP_CONFIG } from '../utils/mapConfig';

export const useOpenLayersMap = (mapContainer, center = MAP_CONFIG.center, zoom = MAP_CONFIG.zoom) => {
  const map = useRef(null);
  const vectorSource = useRef(null);
  const clusterSource = useRef(null);
  const vectorLayer = useRef(null);
  const baseLayer = useRef(null);
  const [mapInfo, setMapInfo] = useState({
    lng: center[0],
    lat: center[1],
    zoom: zoom
  });

  // Criar camada base (satélite)
  const createBaseLayer = useCallback(() => {
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: '© <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19,
        wrapX: false,
        tilePixelRatio: 1,
        tileSize: 256
      }),
      preload: 1,
      useInterimTilesOnError: false
    });

    return satelliteLayer;
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (map.current) return;

    // Criar fonte vetorial para marcadores
    vectorSource.current = new VectorSource();
    
    // Criar fonte de cluster
    clusterSource.current = new ClusterSource({
      distance: MAP_CONFIG.clusterDistance,
      source: vectorSource.current,
      geometryFunction: (feature) => {
        const geometry = feature.getGeometry();
        if (geometry.getType() === 'Point') {
          return geometry;
        }
        return null;
      }
    });
    
    // Criar camada vetorial para marcadores com clustering
    vectorLayer.current = new VectorLayer({
      source: clusterSource.current,
      zIndex: 100
    });

    // Criar camada base
    baseLayer.current = createBaseLayer();

    // Criar mapa
    map.current = new Map({
      target: mapContainer.current,
      layers: [
        baseLayer.current,
        vectorLayer.current
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        maxZoom: MAP_CONFIG.maxZoom,
        minZoom: MAP_CONFIG.minZoom
      }),
      controls: defaultControls(),
      interactions: defaultInteractions()
    });

    // Event listener para atualizar informações do mapa
    map.current.on('moveend', () => {
      const view = map.current.getView();
      const center = view.getCenter();
      const newView = {
        lng: center[0].toFixed(4),
        lat: center[1].toFixed(4),
        zoom: view.getZoom().toFixed(2)
      };
      
      setMapInfo(newView);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [mapContainer, center, zoom, createBaseLayer]);

  return {
    map: map.current,
    vectorSource: vectorSource.current,
    clusterSource: clusterSource.current,
    vectorLayer: vectorLayer.current,
    mapInfo,
    setMapInfo
  };
}; 