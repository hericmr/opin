import React from 'react';
import PainelHeader from '../../PainelHeader';
import usePainelVisibility from '../../hooks/usePainelVisibility';
import { usePainelDimensions } from '../../hooks/usePainelDimensions';

const PainelContainer = ({ 
  painelInfo, 
  closePainel, 
  children,
  isMaximized,
  onToggleMaximize
}) => {
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile, isMaximized);

  if (!painelInfo) return null;

  const baseClasses = `
    fixed
    ${isMobile 
      ? 'inset-0 top-16 w-full h-[calc(100vh-4rem)]' 
      : 'top-16 bottom-0 right-0 w-full sm:w-3/4 lg:w-[49%] h-auto'
    }
    rounded-t-xl shadow-xl z-[9999] transform transition-all duration-500 ease-in-out
    bg-white border-t-4 border-white
  `;
  
  const visibilityClasses = isVisible 
    ? isMobile 
      ? "translate-y-0 opacity-100" 
      : "translate-y-0 opacity-100"
    : isMobile 
      ? "translate-y-full opacity-0" 
      : "translate-y-full opacity-0";

  return (
    <div
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      aria-modal="true"
      className={`${baseClasses} ${visibilityClasses}${isMobile ? ' painel-informacoes-mobile' : ''}`}
      style={{
        height: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.height,
        maxHeight: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.maxHeight,
        width: isMobile ? '100%' : painelDimensions.width,
        display: "flex",
        flexDirection: "column",
        ...(isMobile && {
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
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/40 scrollbar-track-green-50/20">
        <div className={`${isMobile ? 'p-3 sm:p-4' : 'p-6'} space-y-6 sm:space-y-8`}>
          <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PainelContainer); 