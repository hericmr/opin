import React, { useEffect, useState } from 'react';
import '../PainelInformacoes.css';
import PainelHeader from '../../PainelHeader';
import EscolaHeaderImage from './EscolaHeaderImage';
import GaleriaPanel from './GaleriaPanel';
import SidebarMediaViewer from './SidebarMediaViewer';
import usePainelVisibility from '../../hooks/usePainelVisibility';
import { usePainelDimensions } from '../../hooks/usePainelDimensions';
import useImagePreloader from '../../../hooks/useImagePreloader';
import { getStorageUrl } from '../../../utils/imageUtils';
import { getEdgeColor } from '../../../utils/colorUtils';
import logger from '../../../utils/logger';

const PainelContainer = ({
  painelInfo,
  closePainel,
  children,
  isMaximized,
  onToggleMaximize,
  contentRef,
  rightNav,
  shareUrl,
  shareTitle,
  customMediaItems,
  disableSplitLayout = false
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  // A galeria aberta pertence a uma escola: trocar de escola a fecha
  const [galeriaAbertaId, setGaleriaAbertaId] = useState(null);
  const isGaleriaOpen = galeriaAbertaId !== null && galeriaAbertaId === painelInfo?.id;
  const setIsGaleriaOpen = (aberta) => setGaleriaAbertaId(aberta ? painelInfo?.id : null);
  const [dynamicBgColor, setDynamicBgColor] = useState('');
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile, isMaximized);
  const isMobileLandscape = painelDimensions.isMobileLandscape;
  const isMobilePortrait = isMobile && !isMobileLandscape;
  const shouldUseDesktopLayout = !isMobilePortrait;
  const useSplitLayout = !disableSplitLayout && shouldUseDesktopLayout && (isMaximized || isMobileLandscape);

  // Hook de preload de imagens
  const { isImagePreloaded } = useImagePreloader(painelInfo?.id, true);

  // Foto atual da coluna de mídia: vira fundo desfocado que preenche a coluna
  const [fundoUrl, setFundoUrl] = useState(null);

  const handleCurrentItemChange = (item) => {
    setFundoUrl(item?.url || null);
    if (painelInfo?.tipo === 'história_originária') {
      // Hardcode para a história dos sapos
      if (painelInfo?.subtitulo?.includes('Sapos')) {
        setDynamicBgColor('#FFFFD8');
        return;
      }
      
      if (item && item.url) {
        getEdgeColor(item.url).then(color => {
          setDynamicBgColor(color.rgb);
        }).catch((e) => { logger.warn('Erro ao extrair a cor da imagem:', e); setDynamicBgColor(''); });
      } else {
        setDynamicBgColor('');
      }
    } else {
      setDynamicBgColor('');
    }
  };

  // Calcular cor de fundo dinâmica mesmo quando o layout dividido estiver desativado
  useEffect(() => {
    if (!useSplitLayout) {
      handleCurrentItemChange(customMediaItems?.[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useSplitLayout, painelInfo?.id, painelInfo?.tipo, painelInfo?.subtitulo]);

  // Preload header image immediately when panel becomes visible
  useEffect(() => {
    if (painelInfo?.imagem_header && isVisible) {
      const resolvedUrl = getStorageUrl(painelInfo.imagem_header);
      const img = new Image();
      img.src = resolvedUrl;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resolvedUrl;
      if ('fetchPriority' in link) link.fetchPriority = 'high';
      document.head.appendChild(link);

      return () => {
        if (link.parentNode === document.head) document.head.removeChild(link);
      };
    }
  }, [painelInfo?.imagem_header, isVisible]);

  if (!painelInfo) return null;

  const resolvedImageHeader = painelInfo.imagem_header
    ? getStorageUrl(painelInfo.imagem_header)
    : null;

  const baseClasses = `
    fixed
    ${isMobilePortrait
      ? 'inset-x-0 top-0 w-full h-full'
      : 'top-0 bottom-0 right-0 w-full sm:w-3/4 lg:w-[49%] h-auto'
    }
    rounded-t-xl shadow-xl z-[9999] transform
    bg-white mj-panel
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
          backgroundColor: dynamicBgColor || '#ffffff',
          transition: 'background-color 0.5s ease',
          height: painelDimensions.height,
          maxHeight: painelDimensions.maxHeight,
          width: isMobilePortrait ? '100%' : painelDimensions.width,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          ...(!isMobilePortrait && isMaximized && {
            borderRadius: '0'
          }),
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
          subtituloPainel={painelInfo.subtitulo}
          closePainel={closePainel}
          toggleMaximize={onToggleMaximize}
          isMaximized={isMaximized}
          imagemHeader={painelInfo.imagem_header}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          escolaId={painelInfo.tipo === 'história_originária' ? undefined : painelInfo.id}
          subtituloDecorativo={painelInfo.tipo === 'história_originária' ? false : undefined}
          hideBorder={painelInfo.tipo === 'história_originária'}
          dynamicBgColor={dynamicBgColor}
          hideTitle={painelInfo.tipo === 'história_originária'}
        />

        {rightNav && (
          <div className="hidden sm:flex flex-col gap-1 absolute right-0 top-1/2 -translate-y-1/2 z-[10000]">
            {rightNav}
          </div>
        )}

        {useSplitLayout ? (
          <div className="flex-1 mj-split">
            <aside
              className="mj-split-left relative overflow-hidden"
              style={dynamicBgColor ? { backgroundColor: dynamicBgColor, transition: 'background-color 0.5s ease' } : {}}
            >
              {/* Fundo: a própria foto ampliada e desfocada ocupa a coluna inteira;
                  a foto completa (sem corte) fica por cima. Histórias usam a cor de borda. */}
              {fundoUrl && !dynamicBgColor && (
                <img
                  key={fundoUrl}
                  src={fundoUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-90 saturate-150 brightness-90 pointer-events-none select-none"
                />
              )}
              <div className="relative h-full">
                <SidebarMediaViewer
                  escolaId={painelInfo.id}
                  scrollProgress={scrollProgress}
                  headerUrl={painelInfo.imagem_header}
                  customMediaItems={customMediaItems}
                  onCurrentItemChange={handleCurrentItemChange}
                  dynamicBgColor={dynamicBgColor}
                />
              </div>
            </aside>
            <div className="mj-split-right flex flex-col h-full overflow-hidden" style={dynamicBgColor ? { backgroundColor: dynamicBgColor, transition: 'background-color 0.5s ease' } : {}}>
              {painelInfo.tipo !== 'história_originária' && (
                <div className="h-[80px] shrink-0 pointer-events-none" aria-hidden="true" />
              )}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto mj-panel-content"
                style={dynamicBgColor ? { backgroundColor: 'transparent' } : {}}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const max = el.scrollHeight - el.clientHeight;
                  const ratio = max > 0 ? el.scrollTop / max : 0;
                  setScrollProgress(Math.min(1, Math.max(0, ratio)));
                }}
              >
                <div className={`${isMobilePortrait ? 'px-4 pt-6 pb-10' : 'px-6 pt-6 pb-12'} space-y-4 sm:space-y-5`}>
                  <div className="prose prose-lg max-w-none mj-prose">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div ref={contentRef} className="flex-1 overflow-y-auto mj-panel-content" style={dynamicBgColor ? { backgroundColor: 'transparent' } : {}}>
            {/* Header image — mesma proporção de antes */}
            {resolvedImageHeader && (
              <EscolaHeaderImage
                imagemUrl={resolvedImageHeader}
                className="h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 w-full"
                isPreloaded={isImagePreloaded(resolvedImageHeader)}
              />
            )}

            <div className={`${isMobilePortrait ? 'px-4 pt-6 pb-10' : 'px-6 pt-6 pb-12'} space-y-4 sm:space-y-5`}>
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
        headerUrl={resolvedImageHeader}
        titulo={painelInfo.titulo}
        isOpen={isGaleriaOpen}
        onClose={() => setIsGaleriaOpen(false)}
        isMobilePortrait={isMobilePortrait}
      />
    </>
  );
};

export default React.memo(PainelContainer);
