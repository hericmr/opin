import React, { useRef } from 'react';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import 'ol/ol.css';

// Hooks customizados
import { useOpenLayersMap } from '../../hooks/useOpenLayersMap';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { useMapLayers } from '../../hooks/useMapLayers';

// Componentes
import MapInfo from './MapInfo';
import MapContainer from './MapContainer';

// Configurações
import { MAP_CONFIG } from '../../utils/mapConfig';

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
  showNomesEscolas = false
}) => {
  const mapContainer = useRef(null);

  // Hook principal do mapa
  const { map, mapInfo } = useOpenLayersMap(mapContainer, center, zoom);

  // Hook para marcadores e clusters
  useMapMarkers(map, dataPoints, showMarcadores);

  // Hook para camadas GeoJSON
  useMapLayers(map, terrasIndigenasData, estadoSPData, showTerrasIndigenas, showEstadoSP);

  return (
    <MapContainer ref={mapContainer} className={className}>
      {/* Informações do mapa */}
    </MapContainer>
  );
};

export default OpenLayersMap; 