import L from "leaflet";

// Tamanho mínimo para área de toque em dispositivos móveis (44x44px)
const TOUCH_TARGET_SIZE = 44;

const createIcon = (color) =>
  new L.DivIcon({
    className: `custom-marker-${color}`,
    html: `
      <div class="relative" role="button" tabindex="0" aria-label="Marcador de localização">
        <div class="marker-container" style="min-width: ${TOUCH_TARGET_SIZE}px; min-height: ${TOUCH_TARGET_SIZE}px; display: flex; align-items: center; justify-content: center;">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            class="w-8 h-8"
            aria-hidden="true"
            focusable="false"
          >
            <path 
              fill="${color}" 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            />
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
          cursor: pointer;
          border-radius: 50%;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .marker-container:hover, .marker-container:focus {
          transform: scale(1.1);
          filter: brightness(1.1);
          outline: 2px solid ${color};
          outline-offset: 2px;
        }
        .marker-container:focus {
          outline: 2px solid ${color};
          outline-offset: 2px;
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
        @media (hover: none) {
          .marker-container:hover {
            transform: none;
            filter: none;
          }
        }
      </style>
    `,
    iconSize: [TOUCH_TARGET_SIZE, TOUCH_TARGET_SIZE],
    iconAnchor: [TOUCH_TARGET_SIZE/2, TOUCH_TARGET_SIZE],
    popupAnchor: [0, -TOUCH_TARGET_SIZE],
  });

// Criando ícones com cores personalizadas
export const blueIcon = createIcon("#2196F3");
export const greenIcon = createIcon("#4CAF50");
export const yellowIcon = createIcon("#FFC107");
export const redIcon = createIcon("#F44336");
export const violetIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="#3B82F6" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});
export const blackIcon = createIcon("#212121");
export const orangeIcon = createIcon("#FF5722");
export const orangeBairroIcon = createIcon("#FF9800");