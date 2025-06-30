import React from 'react';

/**
 * Componente para exibir informações do mapa
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.mapInfo - Informações do mapa {lng, lat, zoom}
 */
const MapInfo = ({ mapInfo }) => {
  if (!mapInfo) return null;

  return (
    <div className="absolute bottom-20 sm:bottom-4 left-4 z-10 bg-white bg-opacity-95 rounded-lg shadow-lg p-3">
      <div className="text-xs text-gray-600">
        Lat: {mapInfo.lat} | Lng: {mapInfo.lng}
      </div>
      <div className="text-xs text-gray-600">
        Zoom: {mapInfo.zoom}
      </div>
    </div>
  );
};

export default MapInfo; 