import React, { useRef, useState, useEffect } from "react";
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

const PainelInformacoes = ({ painelInfo, closePainel, escola_id, refreshKey = 0 }) => {
  const painelRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const { documentos } = useDocumentosEscola(painelInfo?.id);
  
  const toggleMaximize = () => setIsMaximized(prev => !prev);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  // Forçar re-renderização quando refreshKey mudar
  useEffect(() => {
    console.log('PainelInformacoes: refreshKey mudou para', refreshKey);
  }, [refreshKey]);

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
          refreshKey={refreshKey}
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
            escolaId={painelInfo.id}
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
        <ShareSection 
          copiarLink={copiarLink} 
          compartilhar={compartilhar} 
          painelInfo={painelInfo}
        />
      </PainelContainer>
    </div>
  );
};

export default React.memo(PainelInformacoes); 