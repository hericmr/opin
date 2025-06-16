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

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  console.log('🎯 PainelInformacoes recebeu painelInfo:', painelInfo);
  
  const painelRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const { documentos, isLoading: isLoadingDocs, error: docsError } = useDocumentosEscola(painelInfo?.id);
  
  console.log('📚 Estado dos documentos:', { 
    documentos, 
    isLoadingDocs, 
    error: docsError,
    escolaId: painelInfo?.id 
  });
  
  const toggleMaximize = () => setIsMaximized(prev => !prev);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  if (!painelInfo) {
    console.log('⚠️ PainelInformacoes: painelInfo é null');
    return null;
  }

  // Determine panel type
  const isTerraIndigena = painelInfo.tipo === 'terra_indigena';
  const isIntro = painelInfo.titulo === 'Sobre o site';

  const renderContent = () => {
    console.log('🎨 Renderizando conteúdo do painel:', {
      isTerraIndigena,
      isIntro,
      hasDocumentos: documentos?.length > 0,
      hasVideos: !!painelInfo.link_para_videos
    });

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