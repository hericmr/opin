import React from "react";

const BotaoAssistencia = ({ visivel, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-32 left-3 z-10 p-1 rounded-md shadow ${
      visivel ? "bg-green-600 text-black" : "bg-blue-100 text-black"
    }`}
  >
    {visivel ? "Ocultar Serviços de Assistência" : "Assistência"}
  </button>
);

export default BotaoAssistencia;
