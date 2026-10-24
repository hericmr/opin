import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/fonts/fonts.css";
import "./styles/map-controls.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import logger from "./utils/logger";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App /> {/* App agora não está mais dentro de BrowserRouter */}
  </React.StrictMode>
);

reportWebVitals();

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Usa o caminho base do projeto (/opin) se estiver configurado
    const basePath = import.meta.env.BASE_URL || '/opin';
    // Remove barras extras para não gerar URLs relativas ao protocolo (ex: //sw.js)
    const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    const swPath = `${normalizedBasePath}/sw.js`;
    
    navigator.serviceWorker.register(swPath, { scope: `${normalizedBasePath}/` })
      .then((registration) => {
        logger.info('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        logger.warn('Falha ao registrar Service Worker:', error);
      });
  });
}
