import React from 'react';

const MapInfo = ({ mapInfo }) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-95 rounded-lg shadow-lg p-3">
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