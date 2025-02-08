import React, { useState, useEffect } from "react";

const MenuCamadas = ({ estados, acoes }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuClasses = `bg-green-900 bg-opacity-30 p-2 rounded-lg shadow-md space-y-1 transition-all duration-200 ${
    menuAberto ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
  } ${isMobile ? "absolute bottom-full left-0 mb-2 w-48" : "mt-2 w-40"}`; // Aumentei a largura do menu

  const botaoClasses = (ativo, cor) =>
    `w-full p-2 text-left flex items-center rounded-md transition-colors whitespace-nowrap overflow-hidden ${
      ativo ? cor : "bg-green-100 hover:bg-gray-100"
    }`;

  const opcoes = [
    { acao: acoes.toggleBairros, estado: estados.bairros, icone: "🏘", label: "Bairros", cor: "bg-gray-200" },
    { acao: acoes.toggleAssistencia, estado: estados.assistencia, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", label: "Assistência", cor: "bg-green-500 text-black" },
    { acao: acoes.toggleHistoricos, estado: estados.historicos, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png", label: "Históricos", cor: "bg-yellow-300" },
    { acao: acoes.toggleCulturais, estado: estados.culturais, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png", label: "Lazer", cor: "bg-blue-400" },
    { acao: acoes.toggleComunidades, estado: estados.comunidades, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png", label: "Comunidades", cor: "bg-red-500" },
    { acao: acoes.toggleEducação, estado: estados.educação, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png", label: "Educação", cor: "bg-purple-400" },
    { acao: acoes.toggleReligiao, estado: estados.religiao, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png", label: "Religião", cor: "bg-gray-400" },
  ];

  return (
    <div className={`fixed ${isMobile ? "bottom-3 left-3" : "top-40 left-3"} z-10`}>
      {/* Botão de menu */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className={`p-2 ${isMobile ? "w-10 h-10 text-sm" : "w-12 h-12"} bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center`}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
      >
        {menuAberto ? "✖" : "☰"}
      </button>

      {/* Menu de camadas */}
      <div className={menuClasses}>
        {opcoes.map(({ acao, estado, icone, label, cor }, index) => (
          <button key={index} onClick={acao} className={botaoClasses(estado, cor)}>
            {typeof icone === "string" && icone.startsWith("http") ? (
              <img src={icone} alt={label} className="w-4 h-6 mr-3" />
            ) : (
              <span className="mr-4">{icone}</span>
            )}
            <span className="truncate">{label}</span> 
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCamadas;