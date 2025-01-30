import React, { useState, useEffect } from "react";

const MenuCamadas = ({ estados, acoes }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`absolute ${isMobile ? 'bottom-4 left-4' : 'top-20 left-3'} z-10`}>

      {/* Botão para abrir/fechar o menu */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="p-2 bg-white text-black rounded shadow-lg hover:bg-gray-100 transition-all w-8 h-8 flex items-center justify-center"
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        {menuAberto ? "◀" : "▶"}
      </button>

      {/* Menu de camadas */}
      <div
        className={`bg-green-900 bg-opacity-30 p-2 rounded-lg shadow-md space-y-2 transition-all duration-200 ${
          menuAberto 
            ? 'ml-2 opacity-100 visible translate-x-0' 
            : 'opacity-0 invisible -translate-x-4'
        } ${isMobile ? 'absolute bottom-full left-0 mb-2' : 'mt-1'} w-fit min-w-0`}
      >

        {/* Botão Bairros */}
        <button
          onClick={acoes.toggleBairros}
          className={`w-full p-2 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.bairros ? 'bg-gray-200' : 'bg-green-100 hover:bg-gray-100'
          }`}
        >
          🏘 <span className="ml-2">Bairros</span>
        </button>

        {/* Botão Assistência */}
        <button
          onClick={acoes.toggleAssistencia}
          className={`w-full p-2 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.assistencia ? 'bg-green-600 text-white' : 'bg-green-100 hover:bg-gray-100'
          }`}
        >
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" 
            alt="Marcador Verde" 
            className="w-3 h-5 mr-2"
          />
          <span className={`${estados.assistencia ? "text-white" : "text-black"}`}>
            Assistência
          </span>
        </button>

        {/* Botão Históricos */}
        <button
          onClick={acoes.toggleHistoricos}
          className={`w-full p-2 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.historicos ? 'bg-yellow-400' : 'bg-green-100 hover:bg-gray-100'
          }`}
        >
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png" 
            alt="Marcador Amarelo" 
            className="w-3 h-5 mr-2"
          />
          <span className="text-black">Históricos</span>
        </button>

        {/* Botão Cultura 
        <button
          onClick={acoes.toggleCultura}
          className={`w-full p-2 text-left flex items-center rounded-md transition-colors whitespace-nowrap ${
            estados.cultura ? 'bg-blue-500 text-white' : 'bg-green-100 hover:bg-gray-100'
          }`}
        >
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" 
            alt="Marcador Azul" 
            className="w-3 h-5 mr-2"
          />
          <span className={`${estados.cultura ? "text-white" : "text-black"}`}>
            Cultura
          </span>
        </button>*/}

      </div>
    </div>
  );
};

export default MenuCamadas;
