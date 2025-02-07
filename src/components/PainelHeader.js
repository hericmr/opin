import React from "react";

// Componente responsável pelo cabeçalho do painel, exibindo o título e o botão de fechar.
const PainelHeader = ({ titulo, closePainel }) => (
  <header className="flex justify-between items-center p-4 border-b border-gray-100">
    <h2 className="text-3xl font-bold text-green-800 text-center flex-1">
      {titulo}
    </h2>
    <button
      onClick={closePainel}
      className="text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl"
      aria-label="Fechar painel"
    >
      ✖
    </button>
  </header>
);

export default PainelHeader;