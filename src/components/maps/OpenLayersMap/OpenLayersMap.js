import React from 'react';
import { useOpenLayersMap } from '../../../hooks/maps/useOpenLayersMap';
import { useMapInitialization } from '../../../hooks/maps/useMapInitialization';
import { useMapEvents } from '../../../hooks/maps/useMapEvents';
import { useMapView } from '../../../hooks/maps/useMapView';
import { useMarkerClustering } from '../../../hooks/markers/useMarkerClustering';
import { useMarkerStyles } from '../../../hooks/markers/useMarkerStyles';
import { useMarkerInteractions } from '../../../hooks/markers/useMarkerInteractions';
import BaseLayer from '../../layers/BaseLayer';
import GeoJSONLayer from '../../layers/GeoJSONLayer';
import MapInfo from './MapInfo';
import { findNearbyPairs } from '../../../utils/markers/proximityUtils';
import { MAP_CONFIG } from '../../../utils/mapConfig';

/**
 * Componente principal do mapa OpenLayers refatorado
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.dataPoints - Array de pontos de dados
 * @param {Function} props.onPainelOpen - Callback para abrir painel
 * @param {Array} props.center - Centro inicial do mapa [lng, lat]
 * @param {number} props.zoom - Zoom inicial do mapa
 * @param {string} props.className - Classe CSS do container
 * @param {Object} props.terrasIndigenasData - Dados GeoJSON das terras indígenas
 * @param {Object} props.estadoSPData - Dados GeoJSON do estado SP
 * @param {boolean} props.showTerrasIndigenas - Se deve mostrar terras indígenas
 * @param {boolean} props.showEstadoSP - Se deve mostrar estado SP
 * @param {boolean} props.showMarcadores - Se deve mostrar marcadores
 * @param {boolean} props.showNomesEscolas - Se deve mostrar nomes das escolas
 */
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
  // Hook principal do mapa
  const {
    map,
    mapContainer,
    mapInfo,
    setMapInfo,
    initialCenter,
    initialZoom,
    isMobileDevice
  } = useOpenLayersMap({ center, zoom });

  // Hook de estilos de marcadores
  const { createMarkerStyle, createClusterStyle } = useMarkerStyles({ showNomesEscolas });

  // Hook de interações de marcadores
  const { handleMarkerClick, handleClusterClick } = useMarkerInteractions({ 
    onPainelOpen, 
    map,
    isMobileDevice 
  });

  // Hook de clustering de marcadores
  const { vectorLayer } = useMarkerClustering({ 
    dataPoints, 
    showMarcadores, 
    showNomesEscolas,
    createStyle: createClusterStyle,
    map 
  });

  // Inicializar mapa
  useMapInitialization({ 
    map, 
    mapContainer, 
    center: initialCenter, 
    zoom: initialZoom 
  });

  // Eventos do mapa
  useMapEvents({ map, setMapInfo });

  // Controle de visualização
  useMapView({ map, center, zoom });

  // Estilos para camadas GeoJSON
  const terrasIndigenasStyle = (feature) => {
    const properties = feature.getProperties();
    const isRegularizada = properties.fase_ti === 'Regularizada';
    
    return {
      fill: {
        color: isRegularizada ? 'rgba(220, 20, 60, 0.3)' : 'rgba(139, 0, 0, 0.25)'
      },
      stroke: {
        color: '#B22222',
        width: 2,
        lineDash: [3, 3]
      }
    };
  };

  const estadoSPStyle = {
    fill: {
      color: 'rgba(0, 0, 0, 0.3)'
    },
    stroke: {
      color: '#000000',
      width: 2
    }
  };

  // Handler para clique em features GeoJSON
  const handleGeoJSONClick = (feature, event) => {
    const terraIndigenaInfo = feature.get('terraIndigenaInfo');
    if (terraIndigenaInfo && onPainelOpen) {
      onPainelOpen(terraIndigenaInfo);
    }
  };

  return (
    <div className={className} ref={mapContainer}>
      {/* Camada base */}
      <BaseLayer map={map} type="satellite" />
      
      {/* Camada Estado SP */}
      {showEstadoSP && estadoSPData && (
        <GeoJSONLayer 
          map={map}
          data={estadoSPData}
          style={estadoSPStyle}
          zIndex={5}
          interactive={false}
        />
      )}
      
      {/* Camada Terras Indígenas */}
      {showTerrasIndigenas && terrasIndigenasData && (
        <GeoJSONLayer 
          map={map}
          data={terrasIndigenasData}
          style={terrasIndigenasStyle}
          zIndex={10}
          interactive={true}
          onFeatureClick={handleGeoJSONClick}
        />
      )}
      
      {/* Informações do mapa */}
      <MapInfo mapInfo={mapInfo} />
    </div>
  );
};

export default OpenLayersMap; 