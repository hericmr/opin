import React from "react";

const BotaoCultura = ({ visivel, onClick }) => (
    <button
        onClick={onClick}
        className={`absolute top-60 left-3 z-10 p-1 rounded-md shadow ${
        visivel ? "bg-blue-500 text-black" : "bg-blue-100 text-black"
        }`}
    >
        {visivel ? "Ocultar Locais Culturais" : "Culturais"}
    </button>
    );

export default BotaoCultura;