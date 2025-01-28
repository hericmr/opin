import L from "leaflet";

// Ícone padrão (vermelho)
export const customIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png", // Ícone de um github para Leaflet
  iconSize: [25, 41], // Tamanho do ícone
  iconAnchor: [0, 98], // Ponto de ancoragem do ícone
  popupAnchor: [1, -34], // Posição do popup em relação ao ícone
});

// Ícone verde
export const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", 
  iconSize: [25, 41], 
  iconAnchor: [0, 98], 
  popupAnchor: [1, -34], 
});
// Ícone amarelo
export const yellowIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png", 
  iconSize: [25, 41], 
  iconAnchor: [0, 98], 
  popupAnchor: [1, -34], 
});
