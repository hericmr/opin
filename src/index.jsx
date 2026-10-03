// IMPORTANTE: Importar o polyfill ANTES de qualquer outra coisa
// Isso garante que react-dom seja patcheado antes de react-quill ser carregado
import "./utils/findDOMNodePolyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/fonts/fonts.css";
import "./styles/map-controls.css";
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
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
        console.log('Service Worker removido com sucesso para evitar problemas de cache.');
      }
    });
  });
}
