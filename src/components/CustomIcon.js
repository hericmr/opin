import L from "leaflet";

// Ícone padrão (vermelho)
export const customIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png", // Ícone padrão do Leaflet
  iconSize: [25, 41], // Tamanho do ícone
  iconAnchor: [12, 41], // Ponto de ancoragem do ícone
  popupAnchor: [1, -34], // Posição do popup em relação ao ícone
});

// Ícone verde
export const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", // Ícone verde do repositório leaflet-color-markers
  iconSize: [25, 41], // Tamanho do ícone
  iconAnchor: [12, 41], // Ponto de ancoragem do ícone
  popupAnchor: [1, -34], // Posição do popup em relação ao ícone
});
// Ícone amarelo
export const yellowIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png", // Ícone amarelo do repositório leaflet-color-markers
  iconSize: [25, 41], // Tamanho do ícone
  iconAnchor: [12, 41], // Ponto de ancoragem do ícone
  popupAnchor: [1, -34], // Posição do popup em relação ao ícone
});
