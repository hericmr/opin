import React, { useRef } from "react";
import PainelHeader from "./PainelHeader";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import usePainelVisibility from "./hooks/usePainelVisibility";
import useAudio from "./hooks/useAudio";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";
import { useShare } from "./hooks/useShare";
import { useDynamicURL } from "./hooks/useDynamicURL";
import { useClickOutside } from "./hooks/useClickOutside";
import { usePainelDimensions } from "./hooks/usePainelDimensions";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelRef = useRef(null);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);

  // Hooks customizados
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile);
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  if (!painelInfo) return null;

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      className={`fixed top-16 left-0 right-0 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-40 transform transition-transform duration-900 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        height: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.height,
        maxHeight: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.maxHeight,
        transition: "opacity 0.7s ease, transform 0.7s ease",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <PainelHeader titulo={painelInfo.titulo} closePainel={closePainel} />

      <div className="p-6 overflow-y-auto flex-1">
        {painelInfo.audioUrl && (
          <AudioButton isAudioEnabled={isAudioEnabled} toggleAudio={toggleAudio} />
        )}

        <PainelMediaContent
          imagens={painelInfo.imagens}
          video={painelInfo.video}
          titulo={painelInfo.titulo}
          audioUrl={painelInfo.audioUrl}
          descricao_detalhada={painelInfo.descricao_detalhada}
          links={painelInfo.links}
        />

        <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
      </div>
    </div>
  );
};

// Componentes internos modularizados
const PainelMediaContent = ({ imagens, video, titulo, audioUrl, descricao_detalhada, links }) => (
  <>
    <PainelMedia
      imagens={imagens}
      video={video}
      titulo={titulo}
      audioUrl={audioUrl}
    />
    <PainelDescricao descricao={descricao_detalhada} />
    <PainelLinks links={links} />
  </>
);

const ShareSection = ({ copiarLink, compartilhar }) => (
  <div className="mt-4 text-center">
    <ShareButton onClick={copiarLink} onShare={compartilhar} />
  </div>
);

export default PainelInformacoes;