import React, { useState, useEffect } from "react";

const MenuCamadas = ({ estados, acoes }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuClasses = `
    bg-green-900/30 backdrop-blur-md p-3 rounded-lg shadow-lg transition-all duration-300 text-white
    ${isMobile
      ? `fixed bottom-0 left-0 right-0 mx-2 mb-6 transition-transform duration-300 ${
          menuAberto ? 'translate-y-0' : 'translate-y-full'
        }`
      : "mt-2 w-52"
    }
  `;

  const botaoClasses = (ativo) => `
    w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
    ${ativo 
      ? "bg-purple-600 shadow-sm transform scale-[1.01]" 
      : "bg-green-800/90 hover:bg-green-700/90 border border-green-700"}
    focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
  `;

  const MarkerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#8B5CF6"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      />
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  );

  return (
    <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "top-40 left-3"} z-10`}>
      {/* Botão de Toggle (visível apenas no PC) */}
      {!isMobile && (
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 w-10 h-10 bg-green-900/90 text-white rounded-full shadow-lg hover:bg-green-800 transition-all flex items-center justify-center text-sm"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? "✖" : "☰"}
        </button>
      )}

      {/* Menu de camadas */}
      {menuAberto && (
        <div className={menuClasses}>
          <button
            onClick={acoes.toggleEstadoSP}
            className={botaoClasses(estados.estadoSP)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#2E7D32"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              />
            </svg>
            <span className="flex-1 text-left text-sm font-medium text-white">Estado SP</span>
            <span className={`w-2 h-2 rounded-full ${estados.estadoSP ? 'bg-green-300' : 'bg-gray-500'}`}></span>
          </button>

          <button
            onClick={acoes.toggleEducação}
            className={botaoClasses(estados.educação)}
          >
            <MarkerIcon />
            <span className="flex-1 text-left text-sm font-medium text-white">Escolas</span>
            <span className={`w-2 h-2 rounded-full ${estados.educação ? 'bg-green-300' : 'bg-gray-500'}`}></span>
          </button>

              <button
            onClick={acoes.toggleTerrasIndigenas}
            className={botaoClasses(estados.terrasIndigenas)}
              >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#FF4500"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              />
              <circle cx="12" cy="9" r="3" fill="white"/>
            </svg>
            <span className="flex-1 text-left text-sm font-medium text-white">Terras Indígenas</span>
            <span className={`w-2 h-2 rounded-full ${estados.terrasIndigenas ? 'bg-orange-300' : 'bg-gray-500'}`}></span>
              </button>

          {/* Botão de Minimizar (Mobile) */}
          {isMobile && menuAberto && (
            <button
              onClick={() => setMenuAberto(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 bg-green-700/90 hover:bg-green-600/90 mt-2 text-sm text-white"
              aria-label="Minimizar menu"
            >
              <span>➖</span>
              <span className="font-medium">Minimizar</span>
            </button>
          )}
        </div>
      )}

      {/* Botão flutuante para reabrir o menu no mobile */}
      {isMobile && !menuAberto && (
        <button
          onClick={() => setMenuAberto(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800 text-white p-3 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-200 z-20 text-sm"
          aria-label="Abrir menu"
        >
          ☰
        </button>
      )}
    </div>
  );
};

export default MenuCamadas;