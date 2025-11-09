import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import 'ol/ol.css';

// Componentes OpenLayers
import OpenLayersMarkers from './OpenLayers/OpenLayersMarkers';
import OpenLayersLayers from './OpenLayers/OpenLayersLayers';

// Componentes responsivos

// Configurações e utilitários
import { MAP_CONFIG, BASE_LAYER_CONFIG } from '../utils/mapConfig';
import { isMobile } from '../utils/mobileUtils';
import MapWrapper from './map/MapWrapper';

// Registrar projeção SIRGAS 2000 (EPSG:4674) usada nos dados GeoJSON
proj4.defs('EPSG:4674', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs');
register(proj4);

const OpenLayersMap = ({ 
  dataPoints = [], 
  onPainelOpen,
  center = MAP_CONFIG.center,
  zoom = MAP_CONFIG.zoom,
  className = "h-screen w-full",
  // Props para camadas GeoJSON
  terrasIndigenasData = null,
  estadoSPData = null,
  showTerrasIndigenas = true,
  showEstadoSP = true,
  // Props para marcadores
  showMarcadores = true,
  showNomesEscolas = false,
  onMapReady = null
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const baseLayer = useRef(null);
  const [, setMapInfo] = useState({
    lng: center[0],
    lat: center[1],
    zoom: zoom
  });

  // Verificar se é mobile e ajustar configurações
  const isMobileDevice = useMemo(() => isMobile(), []);
  const initialCenter = isMobileDevice ? MAP_CONFIG.mobile.center : center;
  const initialZoom = isMobileDevice ? MAP_CONFIG.mobile.zoom : zoom;

  /**
   * Cria camadas base do mapa
   */
  const createBaseLayers = useCallback(() => {
    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: BASE_LAYER_CONFIG.satellite.url,
        attributions: BASE_LAYER_CONFIG.satellite.attributions,
        maxZoom: BASE_LAYER_CONFIG.satellite.maxZoom,
        wrapX: BASE_LAYER_CONFIG.satellite.wrapX,
        tilePixelRatio: BASE_LAYER_CONFIG.satellite.tilePixelRatio,
        tileSize: BASE_LAYER_CONFIG.satellite.tileSize
      }),
      preload: 1,
      useInterimTilesOnError: false
    });

    return { satelliteLayer };
  }, []);

  /**
   * Inicializa o mapa OpenLayers
   */
  const initializeMap = useCallback(() => {
    if (map.current) return;

    // Criar camadas base
    const { satelliteLayer } = createBaseLayers();
    baseLayer.current = satelliteLayer;

    // Criar mapa com configurações ajustadas para mobile
    map.current = new Map({
      target: mapContainer.current,
      layers: [baseLayer.current],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: initialZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        minZoom: MAP_CONFIG.minZoom,
        enableRotation: false // Desabilitar rotação
      }),
      controls: defaultControls({
        zoom: false,
      }),
      // Remover interações padrão para evitar conflitos
      // interactions: defaultInteractions({
      //   dragRotate: false, // Desabilitar rotação com arraste
      //   pinchRotate: false // Desabilitar rotação com pinch (dois dedos)
      // })
    });

    // Event listeners para mudanças de view
    map.current.on('moveend', () => {
      const view = map.current.getView();
      const center = toLonLat(view.getCenter());
      const newView = {
        lng: center[0].toFixed(4),
        lat: center[1].toFixed(4),
        zoom: view.getZoom().toFixed(2)
      };
      
      setMapInfo(newView);
    });

    console.log('[OpenLayersMap] Mapa inicializado com sucesso');

    if (typeof onMapReady === 'function') {
      onMapReady(map.current);
    }

  }, [initialCenter, initialZoom, createBaseLayers, onMapReady]);

  /**
   * Atualiza configurações do mapa quando props mudarem
   */
  const updateMapConfig = useCallback(() => {
    if (!map.current) return;

    const isMobileDevice = isMobile();
    const newCenter = isMobileDevice ? MAP_CONFIG.mobile.center : center;
    const newZoom = isMobileDevice ? MAP_CONFIG.mobile.zoom : zoom;

    const view = map.current.getView();
    const currentCenter = toLonLat(view.getCenter());
    const currentZoom = view.getZoom();

    // Só atualizar se as configurações realmente mudaram
    if (currentCenter[0] !== newCenter[0] || currentCenter[1] !== newCenter[1] || currentZoom !== newZoom) {
      view.setCenter(fromLonLat(newCenter));
      view.setZoom(newZoom);
    }
  }, [center, zoom]);

  // Inicializar mapa quando componente montar
  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        if (typeof onMapReady === 'function') {
          onMapReady(null);
        }
        map.current = null;
      }
    };
  }, [initializeMap, onMapReady]);

  // Atualizar configurações quando props mudarem
  useEffect(() => {
    updateMapConfig();
  }, [updateMapConfig]);

  return (
    <MapWrapper ref={mapContainer}>
      {/* Mapa base OpenLayers */}
      {map.current && (
        <>
          {/* Componente de marcadores */}
          <OpenLayersMarkers
            dataPoints={dataPoints}
            onPainelOpen={onPainelOpen}
            showMarcadores={showMarcadores}
            showNomesEscolas={showNomesEscolas}
            map={map.current}
          />

          {/* Componente de camadas GeoJSON */}
          <OpenLayersLayers
            terrasIndigenasData={terrasIndigenasData}
            estadoSPData={estadoSPData}
            showTerrasIndigenas={showTerrasIndigenas}
            showEstadoSP={showEstadoSP}
            onPainelOpen={onPainelOpen}
            map={map.current}
          />

        </>
      )}
    </MapWrapper>
  );
};

export default OpenLayersMap; 