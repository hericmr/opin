import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/fonts/fonts.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

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
    const basePath = process.env.PUBLIC_URL || '/opin';
    const swPath = `${basePath}/sw.js`;
    
    navigator.serviceWorker.register(swPath, { scope: `${basePath}/` })
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar Service Worker:', error);
      });
  });
}
