import React, { useRef, useState } from "react";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
import useAudio from "../hooks/useAudio";
import useDocumentosEscola from "../hooks/useDocumentosEscola";

// Import modular components
import EscolaInfo from "./components/EscolaInfo";
import TerraIndigenaInfo from "./TerraIndigenaInfo";
import ShareSection from "./ShareSection";
import IntroPanel from "./IntroPanel";
import PainelContainer from "./components/PainelContainer";
import DocumentViewer from "./components/DocumentViewer";
import VideoPlayer from "./components/VideoPlayer";
import ImagensdasEscolas from './components/ImagensdasEscolas';

const PainelInformacoes = ({ painelInfo, closePainel, escola_id }) => {
  const painelRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const { documentos, isLoading: isLoadingDocs, error: docsError } = useDocumentosEscola(painelInfo?.id);
  
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
        {documentos && documentos.length > 0 && (
          <DocumentViewer 
            documentos={documentos}
            title="Produções e materiais da escola"
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