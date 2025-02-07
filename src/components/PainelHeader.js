import React from "react";
import { Volume2, VolumeX, X } from "lucide-react"; // Ícones para melhor UX

const PainelHeader = ({ titulo, closePainel, toggleAudio, isAudioEnabled, audioUrl }) => {
  return (
    <header className="relative p-4 border-b border-gray-100">
      {/* Container para o título e o botão de áudio */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <h2 className="text-3xl font-bold text-black">
          {titulo}
        </h2>

        {/* Botão de áudio: fica abaixo do título em mobile e à direita em telas maiores */}
        {audioUrl && (
          <button
            onClick={toggleAudio}
            className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isAudioEnabled ? "Parar áudio" : "Ouvir áudio"}
            aria-live="polite"
          >
            {isAudioEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isAudioEnabled ? "Parar Áudio" : "Ouvir"}
          </button>
        )}
      </div>

      {/* Botão fechar sempre posicionado no canto superior direito */}
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
