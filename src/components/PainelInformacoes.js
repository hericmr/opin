import React, { useRef, useEffect } from "react";
import slugify from "slugify";
import PainelHeader from "./PainelHeader";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import usePainelVisibility from "./usePainelVisibility";
import useAudio from "./useAudio";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelRef = useRef(null);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);

  const copiarLink = () => {
    const url = window.location.origin + window.location.pathname + "?panel=" + slugify(painelInfo.titulo).toLowerCase();
    navigator.clipboard.writeText(url);
    alert("Link copiado!");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (painelRef.current && !painelRef.current.contains(event.target)) {
        closePainel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePainel]);

  if (!painelInfo) return null;

  // Defina a altura do painel dinamicamente no celular, levando em consideração a altura da navbar
  const navbarHeight = isMobile ? 56 : 0; // Exemplo de altura da navbar (ajuste conforme necessário)
  
  // Para dispositivos móveis, a altura é 100vh, já para desktop, ajustamos para 80vh ou outro valor
  const painelHeight = `calc(${isMobile ? "100vh" : "100vh"} - ${navbarHeight}px)`; // Ajuste conforme necessário

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      className={`fixed bottom-0 left-0 right-0 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-30 transform transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        height: isMobile ? painelHeight : "auto", // Define altura no celular
        maxHeight: isMobile ? "100vh" : "92vh", // Limita a altura no desktop
        transition: "opacity 0.7s ease, transform 0.7s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PainelHeader titulo={painelInfo.titulo} closePainel={closePainel} />
      <div className="p-6 overflow-y-auto flex-1">
        {painelInfo.audioUrl && (
          <AudioButton isAudioEnabled={isAudioEnabled} toggleAudio={toggleAudio} />
        )}

        <PainelMedia
          imagens={painelInfo.imagens}
          video={painelInfo.video}
          titulo={painelInfo.titulo}
        />
        <PainelDescricao descricao={painelInfo.descricao} />
        <PainelLinks links={painelInfo.links || []} />

        <div className="mt-4 text-center">
          <ShareButton onClick={copiarLink} />
        </div>
      </div>
    </div>
  );
};

export default PainelInformacoes;
