import React from "react";
import { Volume2, VolumeX, X } from "lucide-react"; // Ícones para melhor UX

const PainelHeader = ({ titulo, closePainel, toggleAudio, isAudioEnabled, audioUrl }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-start items-center p-4 border-b border-gray-100">
      <h2 className="text-3xl font-bold text-black sm:flex-1">
        {titulo}
      </h2>
      
      {/* Container dos botões */}
      <div className="flex gap-2 mt-4 sm:mt-0">
        {audioUrl && (
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isAudioEnabled ? "Parar áudio" : "Ouvir áudio"}
            aria-live="polite"
          >
            {isAudioEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {isAudioEnabled ? "Parar Áudio" : "Ouvir"}
          </button>
        )}

        <button
          onClick={closePainel}
          className="text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl p-2"
          aria-label="Fechar painel"
        >
          <X size={24} />
        </button>
      </div>
    </header>
  );
};

export default PainelHeader;
