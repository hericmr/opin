import React, { useRef, useEffect } from 'react';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import 'ol/ol.css';

// Hooks customizados
import { useOpenLayersMap } from '../../hooks/useOpenLayersMap';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import { useMapLayers } from '../../hooks/useMapLayers';
import { useMapClick } from '../../hooks/useMapClick';

// Componentes
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
  showNomesEscolas = false,
  // Callback disparado quando o mapa está pronto (usado pelo MapSelector para
  // obter a instância do mapa — zoom pela busca, updateSize, etc.)
  onMapReady
}) => {
  const mapContainer = useRef(null);

  // Hook principal do mapa
  const { map } = useOpenLayersMap(mapContainer, center, zoom);

  // Hook para marcadores e clusters
  useMapMarkers(map, dataPoints, showMarcadores, showNomesEscolas);

  // Hook para camadas GeoJSON
  useMapLayers(map, terrasIndigenasData, estadoSPData, showTerrasIndigenas, showEstadoSP);

  // Hook para clique nos marcadores (abre o painel da escola)
  useMapClick(map, onPainelOpen);

  // Avisar o container (MapSelector) quando a instância do mapa estiver pronta
  useEffect(() => {
    if (map && typeof onMapReady === 'function') {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return (
    <MapContainer ref={mapContainer} className={className}>
      {/* Informações do mapa */}
    </MapContainer>
  );
};

export default OpenLayersMap; 