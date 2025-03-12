import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { greenIcon, blueIcon, yellowIcon, redIcon, violetIcon, blackIcon, orangeIcon } from "../../CustomIcon";
import MapClickHandler from "../../MapClickHandler";
import { crosshairColorMap } from "../constants";

const MapSection = ({ newLocation, setNewLocation, error }) => {
  const getIconByType = (tipo) => {
    console.log("Tipo atual do marcador:", tipo);
    switch (tipo?.toLowerCase()) {
      case 'assistencia':
        return greenIcon;
      case 'lazer':
        return blueIcon;
      case 'historico':
        return yellowIcon;
      case 'comunidades':
        return redIcon;
      case 'educação':
        return violetIcon;
      case 'religiao':
        return blackIcon;
      case 'bairro':
        return orangeIcon;
      default:
        console.log("Usando ícone padrão (verde) para tipo:", tipo);
        return greenIcon;
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          alert("Não foi possível obter sua localização.");
        }
      );
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
    }
  };

  return (
    <div>
      <label className="block font-medium" htmlFor="mapLocation">
        Localização <span className="text-red-500">*</span>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="mb-2">
        {newLocation.latitude || "Não selecionado"},{" "}
        {newLocation.longitude || "Não selecionado"}
      </p>

      <button
        type="button"
        onClick={handleGetCurrentLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
      >
        Usar minha localização
      </button>

      <div id="mapLocation" className="relative">
        <MapContainer
          center={
            newLocation.latitude && newLocation.longitude
              ? [newLocation.latitude, newLocation.longitude]
              : [-23.976769, -46.332818]
          }
          zoom={10}
          style={{
            height: "200px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {newLocation.latitude && newLocation.longitude && (
            <Marker 
              position={[newLocation.latitude, newLocation.longitude]} 
              icon={getIconByType(newLocation.tipo)} 
            />
          )}
          <MapClickHandler setNewLocation={setNewLocation} />
        </MapContainer>
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 border-2 rounded-full pointer-events-none"
          style={{ borderColor: crosshairColorMap[newLocation.tipo] || "#D1D5DB" }}
        ></div>
      </div>
    </div>
  );
};

MapSection.propTypes = {
  newLocation: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tipo: PropTypes.string,
  }).isRequired,
  setNewLocation: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default MapSection; 