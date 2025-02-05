import React from "react";

//  esse componente é responsavel pelo cabeçalho do painel, onde é exibido o titulo e o botão de fechar o painel. falta ajustes nele

const PainelHeader = ({ titulo, closePainel }) => (
  <div className="relative p-6 border-b border-gray-100">
    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-green-800 text-center">
      {titulo}
    </h2>
    <button
      onClick={closePainel}
      className="absolute top-4 right-4 text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl"
      aria-label="Fechar painel"
    >
      ✖
    </button>
  </div>
);

export default PainelHeader;