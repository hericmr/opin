import L from "leaflet";

// Cria uma animação de brilho e pulsação customizada
const createIcon = (url, color) =>
  new L.DivIcon({
    className: `group`, // Remove a classe de animação
    html: `
      <div class="relative">
        <img src="${url}" class="w-[20px] h-[33px] drop-shadow-md">

      </div>
    `,
    iconSize: [10, 17],
    iconAnchor: [9, 30],
    popupAnchor: [1, -14],
  });

// Criando ícones com cores personalizadas
export const blueIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png", "blue");
export const greenIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png", "green");
export const yellowIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png", "yellow");
export const redIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png", "red");
export const violetIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png", "violet");
export const blackIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png", "black");
export const orangeIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png", "orange");
