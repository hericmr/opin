import React from "react";
import { X, Maximize2, Minimize2, MapPin } from "lucide-react";
import { capitalizeWords } from "../utils/textFormatting";
import MinimalShareButtons from "./MinimalShareButtons";
import { BREAKPOINTS } from '../constants/breakpoints';

// Função para formatar o título da escola
const formatarTituloEscola = (titulo) => {
  if (!titulo) return '';
  
  // Converter para minúsculas para facilitar a busca
  const tituloLower = titulo.toLowerCase();
  
  // Verificar se contém "escola estadual" e "aldeia"
  if (tituloLower.includes('escola estadual') && tituloLower.includes('aldeia')) {
    // Extrair o nome da aldeia (parte após "aldeia")
    const partes = titulo.split(' ');
    const indiceAldeia = partes.findIndex(parte => 
      parte.toLowerCase().includes('aldeia')
    );
    
    if (indiceAldeia !== -1 && indiceAldeia < partes.length - 1) {
      // Pegar a parte da aldeia (pode ter mais de uma palavra)
      const nomeAldeia = partes.slice(indiceAldeia + 1).join(' ');
      return `E.E.I ${capitalizeWords(nomeAldeia)}`;
    }
  }
  
  // Se não conseguir formatar, retorna o título original capitalizado
  return capitalizeWords(titulo);
};

const PainelHeader = ({ titulo, closePainel, toggleMaximize, isMaximized, imagemHeader, shareUrl, shareTitle }) => {
  const isMobile = window.innerWidth <= BREAKPOINTS.mobile;
  const isMobileLandscape = isMobile && window.innerWidth > window.innerHeight;

  const shouldUseHalfHeader = isMaximized && (!isMobile || isMobileLandscape);
  const headerHalfClass = shouldUseHalfHeader ? 'mj-header-half-right' : '';
  const headerStyle = shouldUseHalfHeader ? {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    background: '#ffffff',
    borderBottom: '1px solid rgba(5, 150, 105, 0.1)',
    zIndex: 1000
  } : {};
  const containerPaddingClasses = isMobileLandscape
    ? 'px-3 py-2'
    : 'px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-3';
  const innerLayoutClasses = isMobileLandscape
    ? 'flex flex-row items-center justify-between gap-2 pr-2'
    : 'flex flex-col sm:flex-row items-start sm:items-center justify-between pr-12';
  const titleWrapperClasses = isMobileLandscape
    ? 'flex-1 min-w-0'
    : 'space-y-1';
  const titleClassName = isMobileLandscape
    ? 'font-bold text-gray-900 leading-tight tracking-tight break-words text-[clamp(1.05rem,3.4vw,1.6rem)]'
    : 'font-bold text-gray-900 leading-tight tracking-tight break-words text-2xl sm:text-3xl md:text-4xl';
  const subtitleTextClass = isMobileLandscape ? 'text-[11px] font-medium' : 'text-xs sm:text-sm font-medium';
  const subtitleIconClass = 'w-3 h-3';

  const renderActions = () => {
    if (isMobileLandscape) {
      return (
        <div className="flex items-center gap-1 ml-2" style={{ zIndex: 1005 }}>
          {shareUrl && (
            <div className="linkSocialContainer scale-90 origin-right" style={{ zIndex: 1005 }}>
              <MinimalShareButtons url={shareUrl} title={shareTitle || titulo} />
            </div>
          )}
          <button
            onClick={closePainel}
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
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-3" style={{ zIndex: 1005 }}>
        {shareUrl && (
          <div className="linkSocialContainer" style={{ zIndex: 1005 }}>
            <MinimalShareButtons url={shareUrl} title={shareTitle || titulo} />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={toggleMaximize}
            className="p-2 text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
          onClick={closePainel}
          className="p-2 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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

  // Ensure component props are valid
  if (!titulo) return null;

  return (
    <header className={`relative border-b border-green-100 ${isMobileLandscape ? 'min-h-[60px]' : ''}`} style={{ zIndex: 1000, ...headerStyle }}>
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
            
            {/* Subtítulo decorativo */}
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className={subtitleIconClass} aria-hidden="true" />
              <span className={subtitleTextClass}>
                Escola Estadual Indígena
              </span>
            </div>
          </div>

          {isMobileLandscape && renderActions()}
        </div>
      </div>

      {!isMobileLandscape && renderActions()}
    </header>
  );
};

export default PainelHeader;
