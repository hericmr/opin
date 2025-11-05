import React, { useRef, useState, useEffect, useMemo } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Removido cálculo openedFromUrl não utilizado
  
  // Persistir estado de maximização entre aberturas
  const [isMaximized, setIsMaximized] = useState(() => {
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
  const [firstVideoUrl, setFirstVideoUrl] = useState("");
  
  const toggleMaximize = () => {
    setIsMaximized(prev => {
      const next = !prev;
      try { localStorage.setItem('opin:painelIsMaximized', String(next)); } catch {}
      return next;
    });
  };
  
  // Ao abrir um novo painel, respeitar o estado salvo anteriormente
  useEffect(() => {
    if (painelInfo) {
      try {
        const stored = localStorage.getItem('opin:painelIsMaximized');
        if (stored === 'true') setIsMaximized(true);
        else if (stored === 'false') setIsMaximized(false);
      } catch {}
    }
  }, [painelInfo]);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  // Forçar re-renderização quando refreshKey mudar
  useEffect(() => {
    console.log('PainelInformacoes: refreshKey mudou para', refreshKey);
  }, [refreshKey]);

  const sections = useMemo(() => {
    const list = [];
    list.push({ key: 'dados', label: 'Dados' });
    list.push({ key: 'historia', label: 'História' });
    list.push({ key: 'depoimentos', label: 'Depoimentos' });
    if ((painelInfo && painelInfo.link_para_videos) || hasVideos) list.push({ key: 'videos', label: 'Vídeos' });
    return list;
  }, [painelInfo, hasVideos]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      const containerRect = el.getBoundingClientRect();
      let bestIndex = 0;
      let bestDelta = Infinity;
      sections.forEach((s, idx) => {
        const sec = sectionRefs.current[s.key];
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const delta = Math.abs(r.top - containerRect.top - 80);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestIndex = idx;
        }
      });
      setActiveIndex(bestIndex);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (idx) => {
    const el = contentRef.current;
    if (!el) return;
    const key = sections[idx]?.key;
    const target = key ? sectionRefs.current[key] : null;
    if (!target) return;
    const containerTop = el.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const scrollBy = targetTop - containerTop + el.scrollTop - 72; // pequeno offset sob header
    el.scrollTo({ top: scrollBy, behavior: 'smooth' });
  };

  // Removidas funções não utilizadas: prevSection, nextSection, handleKeyActivate

  // Load videos presence independently of other sections
  useEffect(() => {
    let mounted = true;
    async function loadVideos() {
      try {
        setHasVideos(false);
        setFirstVideoUrl("");
        const escolaId = painelInfo?.id;
        if (!escolaId) return;
        const data = await getVideosEscola(escolaId);
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setHasVideos(true);
          // prefer first active video url
          setFirstVideoUrl(data[0]?.video_url || "");
        }
      } catch (_) {
        if (!mounted) return;
        setHasVideos(false);
        setFirstVideoUrl("");
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

  const renderContent = () => {
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
        />
        {documentos && documentos.length > 0 && (
          <DocumentViewer 
            documentos={documentos}
            title="Produções e materiais da escola"
          />
        )}
        {((painelInfo.link_para_videos) || hasVideos) && (
          <div ref={(el) => (sectionRefs.current['videos'] = el)}>
            <VideoPlayer 
              videoUrl={painelInfo.link_para_videos || firstVideoUrl}
              title={<span style={{ fontSize: '0.75em' }}>{`Produções audiovisuais realizadas na ${painelInfo.titulo}`}</span>}
              escolaId={painelInfo.id}
            />
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
        {renderContent()}
      </PainelContainer>
    </div>
  );
};

export default React.memo(PainelInformacoes); 