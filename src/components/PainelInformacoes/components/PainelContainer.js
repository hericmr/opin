import React, { useEffect, useState } from 'react';
import '../PainelInformacoes.css';
import PainelHeader from '../../PainelHeader';
import EscolaHeaderImage from './EscolaHeaderImage';
import GaleriaPanel from './GaleriaPanel';
import SidebarMediaViewer from './SidebarMediaViewer';
import usePainelVisibility from '../../hooks/usePainelVisibility';
import { usePainelDimensions } from '../../hooks/usePainelDimensions';
import useImagePreloader from '../../../hooks/useImagePreloader';

const PainelContainer = ({
  painelInfo,
  closePainel,
  children,
  isMaximized,
  onToggleMaximize,
  contentRef,
  rightNav,
  shareUrl,
  shareTitle
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isGaleriaOpen, setIsGaleriaOpen] = useState(false);
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile, isMaximized);
  const isMobileLandscape = painelDimensions.isMobileLandscape;
  const isMobilePortrait = isMobile && !isMobileLandscape;
  const shouldUseDesktopLayout = !isMobilePortrait;
  const useSplitLayout = shouldUseDesktopLayout && (isMaximized || isMobileLandscape);

  // Hook de preload de imagens
  const { isImagePreloaded } = useImagePreloader(painelInfo?.id, true);

  // Fechar galeria quando trocar de escola
  useEffect(() => {
    setIsGaleriaOpen(false);
  }, [painelInfo?.id]);

  // Preload header image immediately when panel becomes visible
  useEffect(() => {
    if (painelInfo?.imagem_header && isVisible) {
      const img = new Image();
      img.src = painelInfo.imagem_header;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = painelInfo.imagem_header;
      if ('fetchPriority' in link) link.fetchPriority = 'high';
      document.head.appendChild(link);

      return () => {
        if (link.parentNode === document.head) document.head.removeChild(link);
      };
    }
  }, [painelInfo?.imagem_header, isVisible]);

  if (!painelInfo) return null;

  const baseClasses = `
    fixed
    ${isMobilePortrait
      ? 'inset-x-0 top-0 w-full h-full'
      : 'top-0 bottom-0 right-0 w-full sm:w-3/4 lg:w-[49%] h-auto'
    }
    rounded-t-xl shadow-xl z-[9999] transform
    bg-white border-t-4 border-white mj-panel
  `;

  const visibilityClasses = isVisible
    ? 'translate-y-0 opacity-100'
    : 'translate-y-full opacity-0';

  const layoutInfo = {
    isMobile,
    isMobilePortrait,
    isMobileLandscape,
    shouldUseDesktopLayout,
    useSplitLayout,
    onOpenGaleria: () => setIsGaleriaOpen(true),
  };

  const content = typeof children === 'function' ? children(layoutInfo) : children;

  return (
    <>
      <div
        role="dialog"
        aria-labelledby="painel-titulo"
        aria-describedby="painel-descricao"
        aria-modal="true"
        className={`${baseClasses} ${visibilityClasses}${isMobilePortrait ? ' painel-informacoes-mobile' : ''}${useSplitLayout ? ' mj-maximized' : ''}${useSplitLayout && isMobileLandscape ? ' mj-mobile-landscape' : ''}`}
        style={{
          height: painelDimensions.height,
          maxHeight: painelDimensions.maxHeight,
          width: isMobilePortrait ? '100%' : painelDimensions.width,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          ...(isMobilePortrait && {
            borderRadius: painelDimensions.isMobileLandscape ? '0' : '1rem 1rem 0 0',
            boxShadow: painelDimensions.isMobileLandscape
              ? '0 0 0 0'
              : '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
          })
        }}
      >
        <PainelHeader
          titulo={painelInfo.titulo}
          closePainel={closePainel}
          toggleMaximize={onToggleMaximize}
          isMaximized={isMaximized}
          imagemHeader={painelInfo.imagem_header}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          escolaId={painelInfo.id}
        />

        {rightNav && (
          <div className="hidden sm:flex flex-col gap-1 absolute right-0 top-1/2 -translate-y-1/2 z-[10000]">
            {rightNav}
          </div>
        )}

        {useSplitLayout ? (
          <div className="flex-1 mj-split">
            <aside className="mj-split-left">
              <SidebarMediaViewer
                escolaId={painelInfo.id}
                scrollProgress={scrollProgress}
                headerUrl={painelInfo.imagem_header}
              />
            </aside>
            <div className="mj-split-right flex flex-col h-full overflow-hidden">
              <div className="h-[80px] shrink-0 pointer-events-none" aria-hidden="true" />
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto mj-panel-content"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const max = el.scrollHeight - el.clientHeight;
                  const ratio = max > 0 ? el.scrollTop / max : 0;
                  setScrollProgress(Math.min(1, Math.max(0, ratio)));
                }}
              >
                <div className={`${isMobilePortrait ? 'p-3 sm:p-4' : 'p-6'} space-y-4 sm:space-y-5`}>
                  <div className="prose prose-lg max-w-none mj-prose">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div ref={contentRef} className="flex-1 overflow-y-auto mj-panel-content">
            {/* Header image — mesma proporção de antes */}
            {painelInfo.imagem_header && (
              <EscolaHeaderImage
                imagemUrl={painelInfo.imagem_header}
                className="h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 w-full"
                isPreloaded={isImagePreloaded(painelInfo.imagem_header)}
              />
            )}

            <div className={`${isMobilePortrait ? 'p-3 sm:p-4' : 'p-6'} space-y-4 sm:space-y-5 -mt-2`}>
              <div className="prose prose-lg max-w-none mj-prose">
                {content}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Galeria — janela com mesma estrutura do painel, z-index acima */}
      <GaleriaPanel
        escolaId={painelInfo.id}
        headerUrl={painelInfo.imagem_header}
        titulo={painelInfo.titulo}
        isOpen={isGaleriaOpen}
        onClose={() => setIsGaleriaOpen(false)}
        isMobilePortrait={isMobilePortrait}
      />
    </>
  );
};

export default React.memo(PainelContainer);
