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
        {/* Botão visível apenas em telas menores */}
        {isMobile && (
            <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="p-2 bg-green-900 text-white rounded-md shadow-md"
            >
                {menuAberto ? "Fechar Menu" : "Abrir Menu"}
            </button>
        )}

        {/* Menu suspenso */}
        {menuAberto && (
            <div className="mt-2 bg-green-900 bg-opacity-75 p-2 rounded-md shadow-lg flex flex-col space-y-2">
                <button
                    onClick={acoes.toggleBairros}
                    className={`p-2 rounded-md ${
                        estados.bairros ? "bg-gray-300 text-white" : "bg-gray-200"
                    }`}
                >
                    {estados.bairros ? "Ocultar Bairros" : "Ver Bairros"}
                </button>

                <button
                    onClick={acoes.toggleAssistencia}
                    className={`p-2 rounded-md ${
                        estados.assistencia ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                >
                    {estados.assistencia ? "Ocultar Assistência" : "Ver Assistência"}
                </button>

                <button
                    onClick={acoes.toggleHistoricos}
                    className={`p-2 rounded-md ${
                        estados.historicos ? "bg-yellow-500 text-white" : "bg-gray-200"
                    }`}
                >
                    {estados.historicos ? "Ocultar Históricos" : "Ver Históricos"}
                </button>

                <button
                    onClick={acoes.toggleCultura}
                    className={`p-2 rounded-md ${
                        estados.cultura ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    {estados.cultura ? "Ocultar Cultura" : "Ver Cultura"}
                </button>
            </div>
        )}
    </div>
);
};

export default MenuCamadas;
