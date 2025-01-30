import React from 'react';
import { GeoJSON, useMap } from "react-leaflet";

const Bairros = ({ data }) => {
  const map = useMap(); // Obtenha a instância do mapa do Leaflet
  
  // Define a paleta de cores
  const getColor = (density) => {
    return density > 1000
      ? "#00441b"
      : density > 500
      ? "#006d2c"
      : density > 200
      ? "#238b45"
      : density > 100
      ? "#41ab5d"
      : "#74c476";
  };

  // Estilo padrão dos bairros
  const defaultStyle = {
    color: "#ffffff",
    weight: 1,
    fillOpacity: 0.2,
  };

  // Função de estilo
  const style = (feature) => ({
    ...defaultStyle,
    fillColor: getColor(feature.properties.DENSITY || 0), // Use a densidade ou outro critério
  });

  return (
    <GeoJSON
      data={data}
      style={style}
      onEachFeature={(feature, layer) => {
        // Adiciona eventos ao layer
        layer.bindPopup(`
          <strong>Bairro:</strong> ${feature.properties.NOME}<br/>
        `);

        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 3,
              color: "#00441b",
              fillOpacity: 0.9,
            });
            layer.bringToFront();
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle(defaultStyle);
          },
          click: (e) => {
            const layer = e.target;
            const bounds = layer.getBounds(); // Obtém os limites do bairro
            map.fitBounds(bounds, { padding: [50, 50] }); // Ajusta o zoom para o bairro com margem

            // Destaque apenas o bairro clicado
            layer.setStyle({
              weight: 4,
              color: "#000000",
              fillOpacity: 0.8,
            });

            // Restaura o estilo dos outros bairros
            layer.on("remove", () => {
              map.setView(bounds.getCenter()); // Centraliza no bairro selecionado
            });
          },
        });
      }}
    />
  );
};

export default Bairros;
