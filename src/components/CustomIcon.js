import L from "leaflet";

const createIcon = (color) =>
  new L.DivIcon({
    className: `custom-marker-${color}`,
    html: `
      <div class="relative">
        <div class="marker-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
            <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            <circle cx="12" cy="9" r="3" fill="white" class="marker-pulse"/>
          </svg>
        </div>
      </div>
      <style>
        .custom-marker-${color} {
          filter: drop-shadow(0 1px 3px rgb(0 0 0 / 0.2));
        }
        .marker-container {
          transform-origin: bottom center;
          animation: bounce 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .marker-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.7; }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

// Criando ícones com cores personalizadas
export const blueIcon = createIcon("#2196F3");
export const greenIcon = createIcon("#4CAF50");
export const yellowIcon = createIcon("#FFC107");
export const redIcon = createIcon("#F44336");
export const violetIcon = createIcon("#9C27B0");
export const blackIcon = createIcon("#212121");
export const orangeIcon = createIcon("#FF9800");
