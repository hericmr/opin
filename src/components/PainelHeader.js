import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { capitalizeWords } from "../utils/textFormatting";

const PainelHeader = ({ titulo, closePainel, toggleMaximize, isMaximized }) => {
  const isMobile = window.innerWidth <= 768;
  const isMobileLandscape = isMobile && window.innerWidth > window.innerHeight;
  const isVerySmallLandscape = isMobileLandscape && window.innerWidth <= 850;

  return (
    <header className={`relative px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 border-b border-green-100 ${isMobileLandscape ? 'min-h-[60px]' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-12">
        <h2 
          id="painel-titulo"
          className={`font-semibold text-gray-900 leading-tight tracking-normal break-words ${
            isVerySmallLandscape
              ? 'text-base' // Força fonte menor em paisagem muito estreita
              : isMobileLandscape 
                ? 'text-lg sm:text-xl' 
                : 'text-xl sm:text-2xl md:text-3xl'
          }`}
          style={isVerySmallLandscape ? { fontSize: 'clamp(1rem, 4vw, 1.25rem)' } : {}}
        >
          {capitalizeWords(titulo)}
        </h2>
      </div>

      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2">
        {!isMobile && (
          <button
            onClick={toggleMaximize}
            className="p-2 text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={isMaximized ? "Restaurar painel" : "Maximizar painel"}
            title={isMaximized ? "Restaurar" : "Maximizar"}
          >
            {isMaximized ? (
              <Minimize2 size={18} className="stroke-2" aria-hidden="true" />
            ) : (
              <Maximize2 size={18} className="stroke-2" aria-hidden="true" />
            )}
          </button>
        )}

        <button
          onClick={closePainel}
          className={`text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isMobileLandscape ? 'p-1.5' : 'p-2'
          }`}
          aria-label="Fechar painel"
        >
          <X 
            size={isMobileLandscape ? 18 : 20} 
            aria-hidden="true"
            className="stroke-2"
          />
        </button>
      </div>
    </header>
  );
};

export default PainelHeader;
