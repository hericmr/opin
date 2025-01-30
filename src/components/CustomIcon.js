import L from "leaflet";

// Cria uma animação de brilho e pulsação customizada
const createIcon = (url, color) =>
  new L.DivIcon({
    className: `group transition-all duration-1000 ease-in-out`, // Suaviza a animação
    html: `
      <div class="relative">
        <img src="${url}" class="w-[25px] h-[41px] drop-shadow-md transition-transform group-hover:scale-110">
        <span class="absolute inset-0 w-full h-full animate-[pulse_1.5s_infinite] bg-${color}-400 opacity-20 rounded-full blur-lg"></span>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

// Criando ícones com cores personalizadas
export const blueIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png", "blue");
export const greenIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", "green");
export const yellowIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png", "yellow");
export const redIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png", "red");
export const violetIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png", "violet");