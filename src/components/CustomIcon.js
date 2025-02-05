import L from "leaflet";

// Cria uma animação de brilho e pulsação customizada
const createIcon = (url, color) =>
  new L.DivIcon({
    className: `group`, // Remove a classe de animação
    html: `
      <div class="relative">
        <img src="${url}" class="w-[25px] h-[41px] drop-shadow-md">
        <span class="absolute inset-0 w-full h-full bg-${color}-400 opacity-20 rounded-full blur-lg"></span>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

// Criando ícones com cores personalizadas
export const blueIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png", "blue");
export const greenIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png", "green");
export const yellowIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png", "yellow");
export const redIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png", "red");
export const violetIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png", "violet");