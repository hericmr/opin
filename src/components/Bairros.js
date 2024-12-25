import React from "react";
import { GeoJSON } from "react-leaflet";

const Bairros = ({ data, style }) => (
  <GeoJSON
    data={data}
    style={style}
    onEachFeature={(feature, layer) => {
      layer.bindPopup(`Bairro: ${feature.properties.NOME}`);
      layer.on("click", () => {
        console.log(`Clicked on: ${feature.properties.NOME}`);
      });
    }}
  />
);

export default Bairros;
