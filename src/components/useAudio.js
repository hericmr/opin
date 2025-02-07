import { useState, useRef, useEffect } from "react";

const useAudio = (audioUrl) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const isSpeechSynthesisSupported = () => "speechSynthesis" in window;

  const toggleAudio = () => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }

      if (isAudioEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    } else if (isSpeechSynthesisSupported()) {
      if (isAudioEnabled) {
        synthRef.current.cancel();
      } else {
        const content = "Texto de exemplo para síntese de fala."; // Substitua pelo conteúdo real
        utteranceRef.current = new SpeechSynthesisUtterance(content);
        utteranceRef.current.lang = "pt-BR";
        synthRef.current.speak(utteranceRef.current);
      }
    } else {
      alert("Seu navegador não suporta a funcionalidade de áudio.");
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  return { isAudioEnabled, toggleAudio };
};

export default useAudio;