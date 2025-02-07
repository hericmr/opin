import React from "react";
import { Volume2, VolumeX } from "lucide-react";

const AudioButton = ({ isAudioEnabled, toggleAudio }) => {
  return (
    <button
      onClick={toggleAudio}
      className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={isAudioEnabled ? "Parar áudio" : "Ouvir áudio"}
      aria-live="polite"
    >
      {isAudioEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
      {isAudioEnabled ? "Parar Áudio" : "Ouvir"}
    </button>
  );
};

export default AudioButton;