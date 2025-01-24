import React from "react";

const BotaoAssistencia = ({ visivel, onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-32 left-3 z-10 p-2 bg-blue-100 text-black rounded-md shadow"
  >
    {visivel ? "Ocultar Serviços de Assistência" : "Assistência"}
  </button>
);

export default BotaoAssistencia;
