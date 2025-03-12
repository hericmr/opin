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
    bg-green-900/80 backdrop-blur-md p-2.5 rounded-lg shadow-lg transition-all duration-300 text-white
    ${isMobile
      ? `fixed bottom-0 left-0 right-0 mx-2 mb-6 grid grid-cols-2 gap-2 transition-transform duration-300 ${
          menuAberto ? 'translate-y-0' : 'translate-y-full'
        }`
      : "mt-2 w-44"
    }
  `;

  const botaoClasses = (ativo, cor) => `
    w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200
    ${ativo 
      ? `${cor} shadow-sm transform scale-[1.01] text-gray-800` 
      : "bg-green-800/50 hover:bg-green-800/70"}
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mb-1
  `;

  const MarkerIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill={color}
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      />
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  );

  const opcoes = [
    { acao: acoes.toggleBairros, estado: estados.bairros, color: "#9CA3AF", label: "Bairros", cor: "bg-gray-100 hover:bg-gray-200" },
    { acao: acoes.toggleAssistencia, estado: estados.assistencia, color: "#10B981", label: "Assistência", cor: "bg-green-100 hover:bg-green-200" },
    { acao: acoes.toggleHistoricos, estado: estados.historicos, color: "#FBBF24", label: "Históricos", cor: "bg-yellow-100 hover:bg-yellow-200" },
    { acao: acoes.toggleCulturais, estado: estados.culturais, color: "#3B82F6", label: "Lazer", cor: "bg-blue-100 hover:bg-blue-200" },
    { acao: acoes.toggleComunidades, estado: estados.comunidades, color: "#EF4444", label: "Comunidades", cor: "bg-red-100 hover:bg-red-200" },
    { acao: acoes.toggleEducação, estado: estados.educação, color: "#8B5CF6", label: "Educação", cor: "bg-purple-100 hover:bg-purple-200" },
    { acao: acoes.toggleReligiao, estado: estados.religiao, color: "#4B5563", label: "Religião", cor: "bg-gray-100 hover:bg-gray-200" },
  ];

  return (
    <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "top-40 left-3"} z-10`}>
      {/* Botão de Toggle (visível apenas no PC) */}
      {!isMobile && (
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 w-10 h-10 bg-green-900/80 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-green-800/80 transition-all flex items-center justify-center text-sm"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? "✖" : "☰"}
        </button>
      )}

      {/* Menu de camadas */}
      <div className={menuClasses}>
        {/* Seção de Camadas */}
        <div className="col-span-2">
          {opcoes.map(({ acao, estado, color, label, cor }, index) => (
            <button
              key={index}
              onClick={acao}
              className={botaoClasses(estado, cor)}
            >
              <MarkerIcon color={color} />
              <span className="flex-1 text-left text-sm font-medium">{label}</span>
              <span className={`w-2 h-2 rounded-full ${estado ? 'bg-green-300' : 'bg-green-900/50'}`}></span>
            </button>
          ))}
        </div>

        {/* Botão de Minimizar (Mobile) */}
        {isMobile && menuAberto && (
          <button
            onClick={() => setMenuAberto(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 bg-green-800/50 hover:bg-green-800/70 col-span-2 mt-2 text-sm"
            aria-label="Minimizar menu"
          >
            <span>➖</span>
            <span className="font-medium">Minimizar</span>
          </button>
        )}
      </div>

      {/* Botão flutuante para reabrir o menu no mobile */}
      {isMobile && !menuAberto && (
        <button
          onClick={() => setMenuAberto(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-900/80 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-green-800/80 hover:shadow-xl transition-all duration-200 z-20 text-sm"
          aria-label="Abrir menu"
        >
          ☰
        </button>
      )}
    </div>
  );
};

export default MenuCamadas;