import React, { useRef, memo } from "react";
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

// Componentes internos modularizados
const PainelMediaContent = memo(({ imagens, video, titulo, audioUrl, descricao_detalhada, links }) => (
  <div className="space-y-6">
    <PainelMedia
      imagens={imagens}
      video={video}
      titulo={titulo}
      audioUrl={audioUrl}
    />
    <PainelDescricao descricao={descricao_detalhada} />
    {links?.length > 0 && <PainelLinks links={links} />}
  </div>
));

const ShareSection = memo(({ copiarLink, compartilhar }) => (
  <div className="mt-8 flex justify-center space-x-4">
    <ShareButton onClick={copiarLink} onShare={compartilhar} />
  </div>
));

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const painelRef = useRef(null);
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile);
  
  // Hooks customizados
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  if (!painelInfo) return null;

  const baseClasses = `
    fixed top-16 right-0 sm:left-auto sm:w-3/4 lg:w-[49%] 
    rounded-xl shadow-xl z-40 transform transition-all duration-500 ease-in-out
    bg-gradient-to-b from-green-50/95 to-green-50/90 backdrop-blur-sm
  `;
  
  const visibilityClasses = isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0";

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      aria-modal="true"
      className={`${baseClasses} ${visibilityClasses}`}
      style={{
        height: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.height,
        maxHeight: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.maxHeight,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PainelHeader titulo={painelInfo.titulo} closePainel={closePainel} />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/40 scrollbar-track-green-50/20">
        <div className="p-6 space-y-6">
          {painelInfo.audioUrl && typeof painelInfo.audioUrl === 'string' && painelInfo.audioUrl.trim() !== "" && (
            <div className="flex justify-end -mt-2 mb-4">
              <AudioButton 
                isAudioEnabled={isAudioEnabled} 
                toggleAudio={toggleAudio} 
                aria-label={isAudioEnabled ? "Desativar áudio" : "Ativar áudio"}
                className="hover:bg-green-100/50 transition-colors duration-200"
              />
            </div>
          )}
          
          <div className="prose prose-lg lg:prose-xl max-w-none">
            <PainelMediaContent
              imagens={painelInfo.imagens}
              video={painelInfo.video}
              titulo={painelInfo.titulo}
              audioUrl={painelInfo.audioUrl}
              descricao_detalhada={painelInfo.descricao_detalhada}
              links={painelInfo.links}
            />
          </div>
          
          <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
        </div>
      </div>
    </div>
  );
};

export default memo(PainelInformacoes);