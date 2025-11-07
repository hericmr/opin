import React, { useRef, useState, useEffect } from "react";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
import useDocumentosEscola from "../hooks/useDocumentosEscola";

// Import modular components
import EscolaInfo from "./components/EscolaInfo";
import TerraIndigenaInfo from "./TerraIndigenaInfo";
import IntroPanel from "./IntroPanel";
import PainelContainer from "./components/PainelContainer";
import DocumentViewer from "./components/DocumentViewer";
import VideoPlayer from "./components/VideoPlayer";
import { getVideosEscola } from "../../services/videoService";

const PainelInformacoes = ({ painelInfo, closePainel, escola_id, refreshKey = 0 }) => {
  const painelRef = useRef(null);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  
  // Removido cálculo openedFromUrl não utilizado
  
  // Verificar se o painel foi aberto via URL
  const openedFromUrl = useRef(false);
  useEffect(() => {
    if (painelInfo) {
      const urlParams = new URLSearchParams(window.location.search);
      const panelParam = urlParams.get('panel');
      if (panelParam) {
        openedFromUrl.current = true;
      }
    }
  }, [painelInfo]);
  
  // Persistir estado de maximização entre aberturas
  const [isMaximized, setIsMaximized] = useState(() => {
    // Se foi aberto da URL, sempre maximizar
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('panel')) {
      return true;
    }
    try {
      const stored = localStorage.getItem('opin:painelIsMaximized');
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    } catch {}
    return true; // padrão: maximizado
  });
  
  const { gerarLinkCustomizado } = useShare(painelInfo);
  const { documentos } = useDocumentosEscola(painelInfo?.id);
  const [hasVideos, setHasVideos] = useState(false);
  const [videos, setVideos] = useState([]);
  
  const toggleMaximize = () => {
    setIsMaximized(prev => {
      const next = !prev;
      try { localStorage.setItem('opin:painelIsMaximized', String(next)); } catch {}
      return next;
    });
  };
  
  // Ao abrir um novo painel, verificar se veio da URL
  useEffect(() => {
    if (painelInfo) {
      const urlParams = new URLSearchParams(window.location.search);
      const panelParam = urlParams.get('panel');
      
      // Se veio da URL, sempre maximizar
      if (panelParam) {
        setIsMaximized(true);
        try {
          localStorage.setItem('opin:painelIsMaximized', 'true');
        } catch {}
      } else {
        // Caso contrário, respeitar o estado salvo
        try {
          const stored = localStorage.getItem('opin:painelIsMaximized');
          if (stored === 'true') setIsMaximized(true);
          else if (stored === 'false') setIsMaximized(false);
        } catch {}
      }
    }
  }, [painelInfo]);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    closePainel();
  });

  // Forçar re-renderização quando refreshKey mudar
  useEffect(() => {
    console.log('PainelInformacoes: refreshKey mudou para', refreshKey);
  }, [refreshKey]);

  // Load videos presence independently of other sections
  useEffect(() => {
    let mounted = true;
    async function loadVideos() {
      try {
        setHasVideos(false);
        setVideos([]);
        const escolaId = painelInfo?.id;
        if (!escolaId) return;
        const data = await getVideosEscola(escolaId);
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setHasVideos(true);
          setVideos(data);
        }
      } catch (_) {
        if (!mounted) return;
        setHasVideos(false);
        setVideos([]);
      }
    }
    loadVideos();
    return () => { mounted = false; };
  }, [painelInfo?.id, refreshKey]);

  if (!painelInfo) {
    return null;
  }

  // Determine panel type
  const isTerraIndigena = painelInfo.tipo === 'terra_indigena';
  const isIntro = painelInfo.titulo === 'Sobre o site';

  const renderContent = (layoutInfo = {}) => {
    const { useSplitLayout = false } = layoutInfo;

    if (isIntro) {
      return <IntroPanel painelInfo={painelInfo} />;
    }
    
    if (isTerraIndigena) {
      return <TerraIndigenaInfo terraIndigena={painelInfo} />;
    }

    return (
      <div className="relative">
        <EscolaInfo 
          escola={painelInfo} 
          shouldUseGrid={true}
          refreshKey={refreshKey}
          sectionRefs={sectionRefs.current}
          isMaximized={isMaximized}
          shouldHideInlineMedia={useSplitLayout}
        />
        {documentos && documentos.length > 0 && (
          <DocumentViewer 
            documentos={documentos}
            title="Produções e materiais da escola"
          />
        )}
        {((painelInfo.link_para_videos) || hasVideos) && (
          <div ref={(el) => (sectionRefs.current['videos'] = el)}>
            {painelInfo.link_para_videos ? (
              // Legacy: single video from link_para_videos
              <VideoPlayer 
                videoUrl={painelInfo.link_para_videos}
                title={<span style={{ fontSize: '0.75em' }}>{`Produções audiovisuais realizadas na ${painelInfo.titulo}`}</span>}
                escolaId={painelInfo.id}
              />
            ) : (
              // New: multiple videos from database
              videos.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-green-800 mb-4" style={{ fontSize: '0.75em' }}>
                    {`Produções audiovisuais realizadas na ${painelInfo.titulo}`}
                  </h3>
                  {videos.map((video, index) => (
                    <div key={video.id || index} className={index > 0 ? "mt-8" : ""}>
                      <VideoPlayer 
                        videoUrl={video.video_url}
                        title={video.titulo || <span style={{ fontSize: '0.75em' }}>{`Produções audiovisuais realizadas na ${painelInfo.titulo}`}</span>}
                        escolaId={painelInfo.id}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  // Generate share URL
  const shareUrl = painelInfo ? gerarLinkCustomizado() : '';

  return (
    <div ref={painelRef}>
      <PainelContainer
        painelInfo={painelInfo}
        closePainel={closePainel}
        isMaximized={isMaximized}
        onToggleMaximize={toggleMaximize}
        contentRef={contentRef}
        refreshKey={refreshKey}
        rightNav={null}
        shareUrl={shareUrl}
        shareTitle={painelInfo?.titulo}
      >
        {(layoutInfo) => renderContent(layoutInfo)}
      </PainelContainer>
    </div>
  );
};

export default React.memo(PainelInformacoes); 