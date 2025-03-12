import React from "react";
import { X } from "lucide-react";

const PainelHeader = ({ titulo, closePainel }) => {
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

      <button
        onClick={closePainel}
        className="absolute top-4 right-4 p-2.5 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Fechar painel"
      >
        <X 
          size={24} 
          aria-hidden="true"
          className="stroke-2"
        />
      </button>
    </header>
  );
};

export default PainelHeader;
