import { useState, useRef, useEffect } from "react";

const useAudio = (audioUrl) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const isSpeechSynthesisSupported = () => "speechSynthesis" in window;

  const toggleAudio = () => {
    console.log("Toggle audio called. Audio URL:", audioUrl); // Log para verificar o URL do áudio
    console.log("Current audio state:", isAudioEnabled); // Log para verificar o estado atual do áudio

    if (audioUrl) {
      if (!audioRef.current) {
        console.log("Creating new Audio instance with URL:", audioUrl); // Log para verificar a criação do áudio
        audioRef.current = new Audio(audioUrl);

        // Adiciona listeners para depuração
        audioRef.current.addEventListener("play", () => {
          console.log("Áudio começou a tocar.");
        });
        audioRef.current.addEventListener("pause", () => {
          console.log("Áudio pausado.");
        });
        audioRef.current.addEventListener("ended", () => {
          console.log("Áudio terminou.");
        });
        audioRef.current.addEventListener("error", (e) => {
          console.error("Erro ao reproduzir áudio:", e);
        });
      }

      if (isAudioEnabled) {
        console.log("Pausing audio..."); // Log para verificar a pausa do áudio
        audioRef.current.pause();
      } else {
        console.log("Playing audio..."); // Log para verificar a reprodução do áudio
        audioRef.current.play().catch((error) => {
          console.error("Erro ao reproduzir áudio:", error); // Log de erro caso a reprodução falhe
          alert("Erro ao reproduzir áudio. Clique novamente para tentar.");
        });
      }
    } else if (isSpeechSynthesisSupported()) {
      if (isAudioEnabled) {
        console.log("Canceling speech synthesis..."); // Log para verificar o cancelamento da síntese de fala
        synthRef.current.cancel();
      } else {
        const content = "Texto de exemplo para síntese de fala."; // Substitua pelo conteúdo real
        console.log("Starting speech synthesis with content:", content); // Log para verificar o conteúdo da síntese de fala
        utteranceRef.current = new SpeechSynthesisUtterance(content);
        utteranceRef.current.lang = "pt-BR";
        synthRef.current.speak(utteranceRef.current);
      }
    } else {
      console.warn("Navegador não suporta funcionalidade de áudio."); // Log para navegadores sem suporte
      alert("Seu navegador não suporta a funcionalidade de áudio.");
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  useEffect(() => {
    return () => {
      console.log("Cleaning up audio and speech synthesis..."); // Log para verificar a limpeza
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