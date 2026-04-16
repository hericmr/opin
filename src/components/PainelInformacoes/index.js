import React, { useRef, useState, useEffect } from "react";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
import useDocumentosEscola from "../hooks/useDocumentosEscola";
import { isCardVisible } from "../../components/AdminPanel/constants/cardVisibilityConfig";
import { useGlobalCardVisibility } from "../../hooks/useGlobalCardVisibility";
import { useEscolaDetalhes } from "../../hooks/useEscolaDetalhes";
import { useRefresh } from "../../contexts/RefreshContext";

// Import modular components
import EscolaInfo from "./components/EscolaInfo";
import TerraIndigenaInfo from "./TerraIndigenaInfo";
import IntroPanel from "./IntroPanel";
import PainelContainer from "./components/PainelContainer";
import DocumentViewer from "./components/DocumentViewer";
import VideoPlayer from "./components/VideoPlayer";
import { getVideosEscola } from "../../services/videoService";

const PainelInformacoes = ({ painelInfo, closePainel, escola_id }) => {
  const { refreshKey } = useRefresh();
  const painelRef = useRef(null);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  
  // Removido cálculo openedFromUrl não utilizado
  
  // Verificar se o painel foi aberto via URL
  const openedFromUrl = useRef(false);
  // Carregar detalhes on-demand
  const { data: detalhes, loading: detalhesLoading } = useEscolaDetalhes(painelInfo?.id);
  
  // Estado local para a escola (merge de dados básicos + detalhes)
  const [escolaData, setEscolaData] = useState(painelInfo);

  // Atualizar dados básicos quando painelInfo mudar
  useEffect(() => {
    if (painelInfo) {
      setEscolaData(painelInfo);
    }
  }, [painelInfo]);

  // Merge de detalhes quando chegarem
  useEffect(() => {
    if (detalhes && escolaData && detalhes.id === escolaData.id) {
      setEscolaData(prev => ({ ...prev, ...detalhes }));
    }
  }, [detalhes]);

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


  // Load videos presence independently of other sections
  useEffect(() => {
    let mounted = true;
    async function loadVideos() {
      try {
        setHasVideos(false);
        setVideos([]);
        const id = painelInfo?.id;
        if (!id) return;
        const escolaIdNum = Number(id);
        const data = await getVideosEscola(escolaIdNum);
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

  // Buscar configuração global de visibilidade (deve estar antes de qualquer return)
  const { globalVisibility } = useGlobalCardVisibility();

  if (!painelInfo) {
    return null;
  }

  // Determine panel type
  const isTerraIndigena = escolaData?.tipo === 'terra_indigena';
  const isIntro = escolaData?.titulo === 'Sobre o site';

  const renderContent = (layoutInfo = {}) => {
    const { useSplitLayout = false, onOpenGaleria } = layoutInfo;
    const cardsVisibilidade = escolaData?.cards_visibilidade;

    if (isIntro) {
      return <IntroPanel painelInfo={escolaData} />;
    }
    
    if (isTerraIndigena) {
      return <TerraIndigenaInfo terraIndigena={escolaData} />;
    }

    return (
      <div className="relative">
        <EscolaInfo
          escola={escolaData}
          shouldUseGrid={true}
          sectionRefs={sectionRefs.current}
          isMaximized={isMaximized}
          shouldHideInlineMedia={useSplitLayout}
          isLoadingDetails={detalhesLoading}
          onOpenGaleria={onOpenGaleria}
        />
        {/* Vídeos */}
        {isCardVisible(cardsVisibilidade, 'videos', globalVisibility) && 
         (hasVideos || escolaData?.link_para_videos) && (
          <div ref={(el) => (sectionRefs.current['videos'] = el)}>
            {hasVideos ? (
              // New: multiple videos from database
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4" style={{ fontSize: '0.75em' }}>
                  {`Produções audiovisuais realizadas na ${escolaData?.titulo}`}
                </h3>
                {videos.map((video, index) => (
                  <div key={video.id || index} className={index > 0 ? "mt-8" : ""}>
                    <VideoPlayer 
                      videoUrl={video.video_url}
                      title={video.titulo || <span style={{ fontSize: '0.75em' }}>{`Produções audiovisuais realizadas na ${escolaData?.titulo}`}</span>}
                      escolaId={escolaData?.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Legacy: single video from link_para_videos (fallback)
              escolaData?.link_para_videos && (
                <VideoPlayer 
                  videoUrl={escolaData.link_para_videos}
                  title={<span style={{ fontSize: '0.75em' }}>{`Produções audiovisuais realizadas na ${escolaData.titulo}`}</span>}
                  escolaId={escolaData.id}
                />
              )
            )}
          </div>
        )}
        
        {/* Documentos */}
        {isCardVisible(cardsVisibilidade, 'documentos', globalVisibility) && 
         documentos && documentos.length > 0 && (
          <DocumentViewer 
            documentos={documentos}
            title=""
          />
        )}
      </div>
    );
  };

  // Generate share URL
  const shareUrl = escolaData ? gerarLinkCustomizado() : '';

  return (
    <div ref={painelRef}>
      <PainelContainer
        painelInfo={escolaData}
        closePainel={closePainel}
        isMaximized={isMaximized}
        onToggleMaximize={toggleMaximize}
        contentRef={contentRef}
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