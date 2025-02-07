import React, { useEffect, useRef, useState } from "react";
import PainelHeader from "./PainelHeader";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import usePainelVisibility from "./usePainelVisibility";

const PainelInformacoes = ({ painelInfo, closePainel, audioUrl }) => {
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null); // Referência para o elemento de áudio customizado

  // Verifica se a API SpeechSynthesis é suportada
  const isSpeechSynthesisSupported = () => {
    return "speechSynthesis" in window;
  };

  // Função para copiar o link
  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado!");
  };

  const toggleAudio = () => {
    const url = painelInfo.audioUrl; // Pega a URL correta do painelInfo
  
    if (url) {
      // Se o áudio ainda não foi carregado, cria um novo elemento de áudio
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      }
  
      if (isAudioEnabled) {
        audioRef.current.pause(); // Pausa o áudio
      } else {
        audioRef.current.play(); // Reproduz o áudio
      }
    } else {
      // Caso não tenha áudio, usa síntese de fala como fallback
      if (!isSpeechSynthesisSupported()) {
        alert("Seu navegador não suporta a funcionalidade de áudio.");
        console.log("Painel Info:", painelInfo);
        console.log("Audio URL recebido no PainelInformacoes:", painelInfo?.audioUrl);
        return;
      }
  
      if (isAudioEnabled) {
        synthRef.current.cancel();
      } else {
        const content = [
          painelInfo.titulo,
          painelInfo.descricao,
          ...(painelInfo.links?.map((link) => link.texto) || []),
        ].join(". ");
  
        utteranceRef.current = new SpeechSynthesisUtterance(content);
        utteranceRef.current.lang = "pt-BR";
        synthRef.current.speak(utteranceRef.current);
      }
    }
    setIsAudioEnabled(!isAudioEnabled);
  };
  
  // Função para detectar clique fora do painel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (painelRef.current && !painelRef.current.contains(event.target)) {
        closePainel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePainel]);

  if (!painelInfo) return null;

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      className={`fixed top-20 right-2 left-2 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-30 transform transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        maxHeight: isMobile ? "89vh" : "90vh",
        height: "auto",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Passando toggleAudio, isAudioEnabled e audioUrl para o PainelHeader */}
      <PainelHeader
        titulo={painelInfo.titulo}
        closePainel={closePainel}
        toggleAudio={toggleAudio}
        isAudioEnabled={isAudioEnabled}
        audioUrl={painelInfo.audioUrl} // CORRETO

      />
      <div className="p-6 overflow-y-auto flex-1">
        <PainelMedia
          imagens={painelInfo.imagens}
          video={painelInfo.video}
          titulo={painelInfo.titulo}
        />
        <PainelDescricao descricao={painelInfo.descricao} />
        <PainelLinks links={painelInfo.links || []} />

        {/* Botão de compartilhar */}
        <div className="mt-4 text-center">
          <button
            onClick={copiarLink}
            className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-500"
            aria-label="Compartilhar link"
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PainelInformacoes;