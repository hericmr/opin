import React, { useState, useEffect } from "react";

const MenuCamadas = ({ estados, acoes }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`fixed ${isMobile ? "bottom-4 left-4" : "top-40 left-3"} z-10`}>
      {/* Botão de menu */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-all w-12 h-12 flex items-center justify-center"
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        {menuAberto ? "✖" : "☰"}
      </button>

      {/* Menu de camadas */}
      <div
        className={`bg-green-900 bg-opacity-30 p-3 rounded-lg shadow-md space-y-2 transition-all duration-200 ${
          menuAberto ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
        } ${isMobile ? "absolute bottom-full left-0 mb-3" : "mt-2"} w-40`}
      >
        <button
          onClick={acoes.toggleBairros}
          className={`w-full p-3 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.bairros ? "bg-gray-200" : "bg-green-100 hover:bg-gray-100"
          }`}
        >
          🏘 <span className="ml-3">Bairros</span>
        </button>
        <button
          onClick={acoes.toggleAssistencia}
          className={`w-full p-3 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.assistencia ? "bg-green-500 text-black" : "bg-green-100 hover:bg-gray-100"
          }`}
        >
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" 
            alt="Marcador Verde" 
            className="w-4 h-6 mr-2"
          />
          Assistência
        </button>
        <button
          onClick={acoes.toggleHistoricos}
          className={`w-full p-3 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.historicos ? "bg-yellow-300" : "bg-green-100 hover:bg-gray-100"
          }`}
        >
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png" 
            alt="Marcador Amarelo" 
            className="w-4 h-6 mr-2"
          />
          Históricos
        </button>
        <button
          onClick={acoes.toggleCulturais}
          className={`w-full p-3 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.culturais ? "bg-blue-400" : "bg-green-100 hover:bg-gray-100"
          }`}
        >
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" 
            alt="Marcador Azul" 
            className="w-4 h-6 mr-2"
          />
          Lazer
        </button>
      </div>
    </div>
  );
};

export default MenuCamadas;
