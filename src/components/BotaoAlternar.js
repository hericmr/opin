import React from "react";

const BotaoAlternar = ({ visivel, onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-20 left-3 z-10 p-2 bg-gray-100 text-black rounded-md shadow"
  >
    {visivel ? "Ocultar Bairros" : "Ver Bairros"}
  </button>
);

export default BotaoAlternar;
