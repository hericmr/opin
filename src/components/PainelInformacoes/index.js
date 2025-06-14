import React, { useRef, memo, useState } from "react";
import PainelHeader from "../PainelHeader";
import usePainelVisibility from "../hooks/usePainelVisibility";
import useAudio from "../hooks/useAudio";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
import { usePainelDimensions } from "../hooks/usePainelDimensions";

// Import modular components
import EscolaInfo from "./components/EscolaInfo";
import TerraIndigenaInfo from "./TerraIndigenaInfo";
import ShareSection from "./ShareSection";
import IntroPanel from "./IntroPanel";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  console.log("PainelInformacoes component - received props:", { painelInfo, closePainel });
  
  const painelRef = useRef(null);
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const [isMaximized, setIsMaximized] = useState(false);
  
  console.log("PainelInformacoes - visibility state:", { isVisible, isMobile, isMaximized });
  
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile);
  
  const toggleMaximize = () => setIsMaximized(prev => !prev);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  if (!painelInfo) {
    console.log("PainelInformacoes: painelInfo é null ou undefined");
    return null;
  }

  const baseClasses = `
    fixed top-16 right-0 sm:left-auto
    ${isMaximized ? 'sm:w-full lg:w-full px-4' : 'sm:w-3/4 lg:w-[49%]'}
    rounded-xl shadow-xl z-40 transform transition-all duration-500 ease-in-out
    bg-gradient-to-b from-green-50/95 to-green-50/90 backdrop-blur-sm
  `;
  
  const visibilityClasses = isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0";
  console.log("PainelInformacoes - computed classes:", { baseClasses, visibilityClasses });

  // Determina se é uma terra indígena, escola ou painel introdutório
  const isTerraIndigena = painelInfo.tipo === 'terra_indigena';
  const isIntro = painelInfo.titulo === 'Sobre o site';
  console.log("PainelInformacoes - tipo:", { isTerraIndigena, isIntro });

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
      <PainelHeader 
        titulo={painelInfo.titulo} 
        closePainel={closePainel}
        toggleMaximize={toggleMaximize}
        isMaximized={isMaximized}
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/40 scrollbar-track-green-50/20">
        <div className="p-6 space-y-6">
          <div className="prose prose-lg lg:prose-xl max-w-none">
            {isIntro ? (
              <IntroPanel painelInfo={painelInfo} />
            ) : isTerraIndigena ? (
              <TerraIndigenaInfo terraIndigena={painelInfo} />
            ) : (
              <EscolaInfo escola={painelInfo} />
            )}
          </div>
          
          <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
        </div>
      </div>
    </div>
  );
};

export default memo(PainelInformacoes); 