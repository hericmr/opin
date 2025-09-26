import { useRef, useState } from 'react';
import useMapInitialization from './useMapInitialization';
import useMapEvents from './useMapEvents';
import useMapView from './useMapView';

/**
 * Hook principal para orquestração do mapa OpenLayers
 * @param {Object} params
 * @param {Array} params.center - Coordenadas iniciais [lng, lat]
 * @param {number} params.zoom - Nível de zoom inicial
 */
const useOpenLayersMap = ({ center, zoom }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapInfo, setMapInfo] = useState({ lng: center[0], lat: center[1], zoom });

  // Inicialização do mapa
  useMapInitialization({ map, mapContainer, center, zoom });
  // Eventos do mapa (move, zoom, etc)
  useMapEvents({ map, setMapInfo });
  // Controle de view (atualização programática de center/zoom)
  useMapView({ map, center, zoom });

  return { map: map.current, mapContainer, mapInfo };
};

export default useOpenLayersMap; 