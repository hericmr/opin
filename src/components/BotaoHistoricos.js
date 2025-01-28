import React from "react";

const BotaoHistoricos = ({ visivel, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-44 left-3 z-10 p-2 rounded-md shadow ${
      visivel ? "bg-yellow-300 text-black" : "bg-blue-100 text-black"
    }`}
  >
    {visivel ? "Ocultar Locais Históricos" : "Históricos"}
  </button>
);

export default BotaoHistoricos;
