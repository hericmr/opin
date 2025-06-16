import React, { useRef, useState } from "react";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
import useAudio from "../hooks/useAudio";

// Import modular components
import EscolaInfo from "./components/EscolaInfo";
import TerraIndigenaInfo from "./TerraIndigenaInfo";
import ShareSection from "./ShareSection";
import IntroPanel from "./IntroPanel";
import PainelContainer from "./components/PainelContainer";
import DocumentViewer from "./components/DocumentViewer";
import VideoPlayer from "./components/VideoPlayer";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const painelRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  
  const toggleMaximize = () => setIsMaximized(prev => !prev);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  if (!painelInfo) {
    return null;
  }

  // Determine panel type
  const isTerraIndigena = painelInfo.tipo === 'terra_indigena';
  const isIntro = painelInfo.titulo === 'Sobre o site';

  const renderContent = () => {
    if (isIntro) {
      return <IntroPanel painelInfo={painelInfo} />;
    }
    
    if (isTerraIndigena) {
      return <TerraIndigenaInfo terraIndigena={painelInfo} />;
    }

    return (
      <>
        <EscolaInfo 
          escola={painelInfo} 
          shouldUseGrid={true}
        />
        {painelInfo.link_para_documentos && (
          <DocumentViewer 
            documentUrl={painelInfo.link_para_documentos}
            title="Documento PDF da escola"
          />
        )}
        {painelInfo.link_para_videos && (
          <VideoPlayer 
            videoUrl={painelInfo.link_para_videos}
            title="Vídeo da escola"
          />
        )}
      </>
    );
  };

  return (
    <div ref={painelRef}>
      <PainelContainer
        painelInfo={painelInfo}
        closePainel={closePainel}
        isMaximized={isMaximized}
        onToggleMaximize={toggleMaximize}
      >
        {renderContent()}
        <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
      </PainelContainer>
    </div>
  );
};

export default React.memo(PainelInformacoes); 