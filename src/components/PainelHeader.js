import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { capitalizeWords } from "../utils/textFormatting";

const PainelHeader = ({ titulo, closePainel, toggleMaximize, isMaximized }) => {
  const isMobile = window.innerWidth <= 640;

  return (
    <header className="relative px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-green-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-12">
        <h2 
          id="painel-titulo"
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 leading-tight tracking-normal break-words"
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
          className="p-2 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Fechar painel"
        >
          <X 
            size={20} 
            aria-hidden="true"
            className="stroke-2"
          />
        </button>
      </div>
    </header>
  );
};

export default PainelHeader;
