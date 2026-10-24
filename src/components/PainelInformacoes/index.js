import React, { useRef, useState, useEffect, useMemo } from "react";
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
import JogosSection from "./components/JogosSection";
import VideoPlayer from "./components/VideoPlayer";
import { FichaSecao } from "./components/Ficha";
import { getVideosEscola, agruparVideos } from "../../services/videoService";

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
  
  // Dados da escola: básicos + detalhes, quando os detalhes são da mesma escola
  const escolaData = useMemo(
    () => (painelInfo && detalhes && detalhes.id === painelInfo.id ? { ...painelInfo, ...detalhes } : painelInfo),
    [painelInfo, detalhes]
  );

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
    return false; // padrão: não maximizado
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
        // Caso contrário, respeitar o estado salvo ou usar o padrão (não maximizado)
        try {
          const stored = localStorage.getItem('opin:painelIsMaximized');
          if (stored === 'true') setIsMaximized(true);
          else setIsMaximized(false);
        } catch {
          setIsMaximized(false);
        }
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
          setVideos(agruparVideos(data));
        }
      } catch {
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
      <div className="relative space-y-10">
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
            <FichaSecao titulo="Produções audiovisuais">
              <div className="space-y-8">
                {hasVideos ? (
                  videos.map((video, index) => (
                    <VideoPlayer
                      key={video.id || index}
                      videoUrl={video.video_url}
                      title={video.titulo}
                      participantes={video.participantes}
                      escolaId={escolaData?.id}
                    />
                  ))
                ) : (
                  // Legado: um único vídeo em link_para_videos
                  <VideoPlayer videoUrl={escolaData.link_para_videos} escolaId={escolaData.id} />
                )}
              </div>
            </FichaSecao>
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

        {/* Jogos */}
        {isCardVisible(cardsVisibilidade, 'jogos', globalVisibility) && (
          <div ref={(el) => (sectionRefs.current['jogos'] = el)}>
            <JogosSection 
              escolaId={escolaData?.id} 
              title={`Jogos desenvolvidos por professores da ${escolaData?.titulo}`}
            />
          </div>
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