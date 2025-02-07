import React from "react";
import { Volume2, VolumeX, X } from "lucide-react"; // Ícones para melhor UX

const PainelHeader = ({ titulo, closePainel, toggleAudio, isAudioEnabled, audioUrl }) => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-100">
      <h2 className="text-3xl font-bold text-black text-center flex-1">{titulo}</h2>

      {/* Botão "Ouvir" (Aparece apenas se houver um áudio disponível) */}
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

      {/* Botão Fechar */}
      <button
        onClick={closePainel}
        className="text-gray-900 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-full text-xl ml-4 p-2"
        aria-label="Fechar painel"
      >
        <X size={24} />
      </button>
    </header>
  );
};

export default PainelHeader;
