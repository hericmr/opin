import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const MapaBase = ({ children }) => (
  <MapContainer
    center={[-23.97, -46.29]}
    zoom={13}
    className="h-full w-full"
  >
    <TileLayer
      url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
    />
    {children}
  </MapContainer>
);

export default MapaBase;
