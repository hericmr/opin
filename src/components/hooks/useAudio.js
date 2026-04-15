import logger from "../../utils/logger";
import { useState, useRef, useEffect } from "react";

const useAudio = (audioUrl) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const isSpeechSynthesisSupported = () => "speechSynthesis" in window;

  const toggleAudio = () => {
    logger.debug("Toggle audio called. Audio URL:", audioUrl); // Log para verificar o URL do áudio
    logger.debug("Current audio state:", isAudioEnabled); // Log para verificar o estado atual do áudio

    if (audioUrl) {
      if (!audioRef.current) {
        logger.debug("Creating new Audio instance with URL:", audioUrl); // Log para verificar a criação do áudio
        audioRef.current = new Audio(audioUrl);

        // Adiciona listeners para depuração
        audioRef.current.addEventListener("play", () => {
          logger.debug("Áudio começou a tocar.");
        });
        audioRef.current.addEventListener("pause", () => {
          logger.debug("Áudio pausado.");
        });
        audioRef.current.addEventListener("ended", () => {
          logger.debug("Áudio terminou.");
        });
        audioRef.current.addEventListener("error", (e) => {
          logger.error("Erro ao reproduzir áudio:", e);
        });
      }

      if (isAudioEnabled) {
        logger.debug("Pausing audio..."); // Log para verificar a pausa do áudio
        audioRef.current.pause();
      } else {
        logger.debug("Playing audio..."); // Log para verificar a reprodução do áudio
        audioRef.current.play().catch((error) => {
          logger.error("Erro ao reproduzir áudio:", error); // Log de erro caso a reprodução falhe
          alert("Erro ao reproduzir áudio. Clique novamente para tentar.");
        });
      }
    } else if (isSpeechSynthesisSupported()) {
      if (isAudioEnabled) {
        logger.debug("Canceling speech synthesis..."); // Log para verificar o cancelamento da síntese de fala
        synthRef.current.cancel();
      } else {
        const content = "Texto de exemplo para síntese de fala."; // Substitua pelo conteúdo real
        logger.debug("Starting speech synthesis with content:", content); // Log para verificar o conteúdo da síntese de fala
        utteranceRef.current = new SpeechSynthesisUtterance(content);
        utteranceRef.current.lang = "pt-BR";
        synthRef.current.speak(utteranceRef.current);
      }
    } else {
      logger.warn("Navegador não suporta funcionalidade de áudio."); // Log para navegadores sem suporte
      alert("Seu navegador não suporta a funcionalidade de áudio.");
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  useEffect(() => {
    // Solução para o warning do ESLint
    const synth = synthRef.current;

    return () => {
      logger.debug("Cleaning up audio and speech synthesis..."); // Log para verificar a limpeza
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synth) {
        synth.cancel();
      }
    };
  }, []);

  return { isAudioEnabled, toggleAudio };
};

export default useAudio;
