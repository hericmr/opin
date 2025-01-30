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
    <div className="absolute top-20 left-3 z-10">
      {/* Botão para alternar o menu */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="p-2 bg-gray-200 text-black rounded-md shadow-md transition-all duration-300 hover:bg-gray-300"
        aria-expanded={menuAberto}
        aria-label={menuAberto ? "Minimizar menu de camadas" : "Expandir menu de camadas"}
      >
        {menuAberto ? "Minimizar Menu" : "Expandir Menu"}
      </button>

      {/* Menu suspenso com transição */}
      <div
        className={`mt-2 bg-green-900 bg-opacity-75 p-2 rounded-md shadow-lg flex flex-col space-y-2 transition-all duration-300 ${
          menuAberto ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px] pointer-events-none"
        }`}
        role="menu"
      >
        <button
          onClick={acoes.toggleBairros}
          className={`p-2 rounded-md transition-all duration-300 ${
            estados.bairros ? "bg-gray-300 text-black" : "bg-gray-200 hover:bg-gray-300"
          }`}
          role="menuitem"
          aria-pressed={estados.bairros}
        >
          {estados.bairros ? "Ocultar Bairros" : "Ver Bairros"}
        </button>

        <button
          onClick={acoes.toggleAssistencia}
          className={`p-2 rounded-md transition-all duration-300 ${
            estados.assistencia ? "bg-green-500 text-black" : "bg-gray-200 hover:bg-green-500 hover:text-black"
          }`}
          role="menuitem"
          aria-pressed={estados.assistencia}
        >
          {estados.assistencia ? "Ocultar Assistência" : "Ver Assistência"}
        </button>

        <button
          onClick={acoes.toggleHistoricos}
          className={`p-2 rounded-md transition-all duration-300 ${
            estados.historicos ? "bg-yellow-500 text-black" : "bg-gray-200 hover:bg-yellow-500 hover:text-black"
          }`}
          role="menuitem"
          aria-pressed={estados.historicos}
        >
          {estados.historicos ? "Ocultar Históricos" : "Ver Históricos"}
        </button>

        <button
          onClick={acoes.toggleCultura}
          className={`p-2 rounded-md transition-all duration-300 ${
            estados.cultura ? "bg-blue-500 text-black" : "bg-gray-200 hover:bg-blue-500 hover:text-black"
          }`}
          role="menuitem"
          aria-pressed={estados.cultura}
        >
          {estados.cultura ? "Ocultar Cultura" : "Ver Culturais"}
        </button>
      </div>
    </div>
  );
};

export default MenuCamadas;