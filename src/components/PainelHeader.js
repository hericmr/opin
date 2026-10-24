import React from "react";
import { X, Maximize2, Minimize2, MapPin } from "lucide-react";
import { formatarTituloEscola } from "../utils/textFormatting";
import ShareMenu from "./ShareMenu";
import { BREAKPOINTS } from '../constants/breakpoints';

// Função para obter o subtítulo dinamicamente baseado no título original/formatado
const getSubtituloDinâmico = (titulo, defaultSubtitulo) => {
  if (defaultSubtitulo !== "Escola Estadual Indígena") return defaultSubtitulo;
  const matchCeci = /^([Cc]\.?[Ee]\.?[Cc]\.?[Ii]\.?)\s*/i.test(titulo);
  if (matchCeci) return "Centro Estadual Cultural Indígena";
  return defaultSubtitulo;
};

const PainelHeader = ({ titulo, subtituloPainel, closePainel, toggleMaximize, isMaximized, imagemHeader, shareUrl, shareTitle, subtituloDecorativo = "Escola Estadual Indígena", hideBorder = false, dynamicBgColor, hideTitle = false }) => {
  const isMobile = window.innerWidth <= BREAKPOINTS.mobile;
  const isMobileLandscape = isMobile && window.innerWidth > window.innerHeight;

  const shouldUseHalfHeader = isMaximized && (!isMobile || isMobileLandscape);
  const headerHalfClass = shouldUseHalfHeader ? 'mj-header-half-right' : '';
  const headerStyle = shouldUseHalfHeader ? {
    position: 'absolute',
    top: 0,
    right: 0,
    width: hideTitle ? 'auto' : '50%',
    background: hideTitle ? 'transparent' : (dynamicBgColor || '#ffffff'),
    transition: 'background-color 0.5s ease',
    borderBottom: (hideBorder || hideTitle) ? 'none' : '1px solid rgba(5, 150, 105, 0.1)',
    zIndex: 1000,
    pointerEvents: hideTitle ? 'none' : 'auto'
  } : {
    background: hideTitle ? 'transparent' : (dynamicBgColor || 'transparent'),
    transition: 'background-color 0.5s ease',
    ...(hideTitle && {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 'auto',
      borderBottom: 'none',
      zIndex: 1000,
      pointerEvents: 'none'
    })
  };
  const containerPaddingClasses = isMobileLandscape
    ? 'px-3 py-2'
    : 'px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-3';
  const innerLayoutClasses = isMobileLandscape
    ? 'flex flex-row items-center justify-between gap-2 pr-2'
    : 'flex flex-col sm:flex-row items-start sm:items-center justify-between pr-24 sm:pr-60';
  const titleWrapperClasses = isMobileLandscape
    ? 'flex-1 min-w-0'
    : 'space-y-1';
  const titleClassName = isMobileLandscape
    ? 'font-bold text-gray-900 leading-tight tracking-tight break-words text-[clamp(1.05rem,3.4vw,1.6rem)]'
    : 'font-bold text-gray-900 leading-tight tracking-tight break-words text-2xl sm:text-3xl md:text-4xl';
  const subtitlePainelClassName = isMobileLandscape
    ? 'text-sm font-medium text-green-800'
    : 'text-base sm:text-lg md:text-xl font-medium text-green-800 mt-1';
  const subtitleTextClass = isMobileLandscape ? 'text-[11px] font-medium' : 'text-xs sm:text-sm font-medium';
  const subtitleIconClass = 'w-3 h-3';

  const renderActions = () => {
    if (isMobileLandscape && !hideTitle) {
      return (
        <div className="flex items-center gap-1 ml-2 pointer-events-auto" style={{ zIndex: 1005 }}>
          {shareUrl && <ShareMenu url={shareUrl} title={shareTitle || titulo} />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closePainel();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Fechar painel"
            style={{ zIndex: 1005 }}
          >
            <X size={18} aria-hidden="true" className="stroke-2" />
          </button>
        </div>
      );
    }

    return (
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 pointer-events-auto" style={{ zIndex: 1005 }}>
        {shareUrl && <ShareMenu url={shareUrl} title={shareTitle || titulo} />}
        {!isMobile && (
          <button
            onClick={toggleMaximize}
            className="p-2.5 text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={isMaximized ? "Restaurar painel" : "Maximizar painel"}
            title={isMaximized ? "Restaurar" : "Maximizar"}
            style={{ zIndex: 1005 }}
          >
            {isMaximized ? (
              <Minimize2 size={18} className="stroke-2" aria-hidden="true" />
            ) : (
              <Maximize2 size={18} className="stroke-2" aria-hidden="true" />
            )}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            closePainel();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="p-2.5 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Fechar painel"
          style={{ zIndex: 1005 }}
        >
          <X 
            size={20} 
            aria-hidden="true"
            className="stroke-2"
          />
        </button>
      </div>
    );
  };

  // Se o título estiver oculto (ex: história onde o título rola com o texto), renderizar apenas os botões flutuantes
  if (hideTitle) {
    return renderActions();
  }

  // Ensure component props are valid
  if (!titulo) return null;

  return (
    <header className={`relative ${hideBorder ? '' : 'border-b border-green-100'} ${isMobileLandscape ? 'min-h-[60px]' : ''}`} style={{ zIndex: 1000, ...headerStyle }}>
      <div className={`${containerPaddingClasses} ${headerHalfClass}`} style={{ position: 'relative', zIndex: 1000 }}>
        <div className={innerLayoutClasses}>
          {/* School title - occupies only right half when maximized */}
          <div className={titleWrapperClasses} style={{ position: 'relative', zIndex: 1015 }}>
            <h2 
              id="painel-titulo"
              className={titleClassName}
            >
              {formatarTituloEscola(titulo)}
            </h2>
            
            {/* Subtítulo dinâmico do painel */}
            {subtituloPainel && (
              <h3 className={subtitlePainelClassName}>
                {subtituloPainel}
              </h3>
            )}
            
            {/* Subtítulo decorativo */}
            {subtituloDecorativo && (
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <MapPin className={subtitleIconClass} aria-hidden="true" />
                <span className={subtitleTextClass}>
                  {getSubtituloDinâmico(titulo, subtituloDecorativo)}
                </span>
              </div>
            )}
          </div>

          {isMobileLandscape && renderActions()}
        </div>
      </div>

      {!isMobileLandscape && renderActions()}
    </header>
  );
};

export default PainelHeader;
