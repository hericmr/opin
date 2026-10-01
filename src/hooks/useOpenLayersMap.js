import { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { MAP_CONFIG } from '../utils/mapConfig';

export const useOpenLayersMap = (mapContainer, center = MAP_CONFIG.center, zoom = MAP_CONFIG.zoom) => {
  const map = useRef(null);
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

    // Criar camada base. As camadas de marcadores (escolas) e GeoJSON (terras
    // indígenas / estado SP) são adicionadas pelos hooks useMapMarkers e
    // useMapLayers, respectivamente, para manter uma única fonte de verdade.
    baseLayer.current = createBaseLayer();

    // Criar mapa
    map.current = new Map({
      target: mapContainer.current,
      layers: [
        baseLayer.current
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        maxZoom: MAP_CONFIG.maxZoom,
        minZoom: MAP_CONFIG.minZoom
      }),
      controls: defaultControls(),
      // Remover interações padrão para evitar conflitos
      // interactions: defaultInteractions()
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
    mapInfo,
    setMapInfo
  };
}; 