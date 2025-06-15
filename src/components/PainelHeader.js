import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

const PainelHeader = ({ titulo, closePainel, toggleMaximize, isMaximized }) => {
  const isMobile = window.innerWidth <= 640;

  return (
    <header className="relative px-8 py-6 border-b border-green-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-12">
        <h2 
          id="painel-titulo"
          className="text-3xl font-semibold text-gray-900 leading-tight tracking-normal"
        >
          {titulo}
        </h2>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {!isMobile && (
          <button
            onClick={toggleMaximize}
            className="p-2.5 text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={isMaximized ? "Restaurar painel" : "Maximizar painel"}
            title={isMaximized ? "Restaurar" : "Maximizar"}
          >
            {isMaximized ? (
              <Minimize2 size={20} className="stroke-2" aria-hidden="true" />
            ) : (
              <Maximize2 size={20} className="stroke-2" aria-hidden="true" />
            )}
          </button>
        )}

        <button
          onClick={closePainel}
          className="p-2.5 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Fechar painel"
        >
          <X 
            size={24} 
            aria-hidden="true"
            className="stroke-2"
          />
        </button>
      </div>
    </header>
  );
};

export default PainelHeader;
