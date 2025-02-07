import React from "react";
import { X } from "lucide-react"; // Apenas o ícone de fechar

const PainelHeader = ({ titulo, closePainel }) => {
  return (
    <header className="relative p-4 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <h2 className="text-3xl font-bold text-black">
          {titulo}
        </h2>
      </div>

      {/* Botão fechar, sempre posicionado no canto superior direito */}
      <button
        onClick={closePainel}
        className="absolute top-0 right-0 text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl p-2"
        aria-label="Fechar painel"
      >
        <X size={24} />
      </button>
    </header>
  );
};

export default PainelHeader;
