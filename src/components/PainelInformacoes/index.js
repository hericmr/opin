import React, { useRef, useState, useEffect, useMemo } from "react";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
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
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
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

  const sections = useMemo(() => {
    const list = [];
    list.push({ key: 'dados', label: 'Dados' });
    list.push({ key: 'historia', label: 'História' });
    list.push({ key: 'depoimentos', label: 'Depoimentos' });
    if (painelInfo && painelInfo.link_para_videos) list.push({ key: 'videos', label: 'Vídeos' });
    return list;
  }, [painelInfo]);

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

  const prevSection = () => {
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : 0;
    scrollToSection(nextIdx);
  };

  const nextSection = () => {
    const last = sections.length - 1;
    const nextIdx = activeIndex < last ? activeIndex + 1 : last;
    scrollToSection(nextIdx);
  };

  const handleKeyActivate = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

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
        />
        {documentos && documentos.length > 0 && (
          <DocumentViewer 
            documentos={documentos}
            title="Produções e materiais da escola"
          />
        )}
        {painelInfo.link_para_videos && (
          <div ref={(el) => (sectionRefs.current['videos'] = el)}>
            <VideoPlayer 
              videoUrl={painelInfo.link_para_videos}
              title={<span style={{ fontSize: '0.75em' }}>{`Produções audiovisuais realizadas na ${painelInfo.titulo}`}</span>}
              escolaId={painelInfo.id}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={painelRef}>
      <PainelContainer
        painelInfo={painelInfo}
        closePainel={closePainel}
        isMaximized={isMaximized}
        onToggleMaximize={toggleMaximize}
        contentRef={contentRef}
        rightNav={sections.length > 1 ? (
          <div className="navDotsInner" role="navigation" aria-label="Story sections">
            <div className="bg-green-100 rounded-lg px-1 py-1 shadow flex flex-col items-center gap-1" style={{ WebkitTapHighlightColor: 'transparent' }}>
              <div
                className="navDotsNav navDotsUp w-5 h-5 rounded-full border border-green-300 bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
                role="button"
                tabIndex={0}
                aria-label="Previous section"
                onClick={prevSection}
                onKeyDown={(e) => handleKeyActivate(e, prevSection)}
              />
              <div className="navGroups navGroupUp disabled text-green-700" />
              <div className="dots flex flex-col items-center gap-1">
                {sections.map((s, idx) => (
                  <div
                    key={s.key}
                    role="button"
                    tabIndex={0}
                    className={`dot w-2 h-2 rounded-full border ${idx === activeIndex ? 'bg-green-600 border-green-600' : 'bg-white border-green-300 hover:border-green-400'} outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0`}
                    title={s.label}
                    data-index={idx}
                    aria-label={`Go to section ${idx + 1}: ${s.label}`}
                    onClick={() => scrollToSection(idx)}
                    onKeyDown={(e) => handleKeyActivate(e, () => scrollToSection(idx))}
                  />
                ))}
              </div>
              <div className="navGroups navGroupDown disabled text-green-700" />
              <div
                className="navDotsNav navDotsDown w-5 h-5 rounded-full border border-green-300 bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
                role="button"
                tabIndex={0}
                aria-label="Next section"
                onClick={nextSection}
                onKeyDown={(e) => handleKeyActivate(e, nextSection)}
              />
            </div>
          </div>
        ) : null}
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