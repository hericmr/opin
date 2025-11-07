import React, { memo } from 'react';

// Import all section components
import BasicInfo from './BasicInfo';
import HistoriaEscola from './HistoriaEscola';
// import PovosLinguas from './PovosLinguas';
import Modalidades from './Modalidades';
import Infraestrutura from './Infraestrutura';
import GestaoProfessores from './GestaoProfessores';
import ProjetosParcerias from './ProjetosParcerias';
// import ImagemHistoriadoProfessor from '../ImagemHistoriadoProfessor';
import HistoriadoProfessor from './HistoriadoProfessor';
import ImagensdasEscolas from '../ImagensdasEscolas';

// CSS para layout Masonry real usando CSS columns
const masonryStyles = `
  .masonry-grid {
    column-count: 1;
    column-gap: 1.5rem;
    column-fill: balance;
  }
  
  .masonry-grid > * {
    display: block;
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 1.5rem;
  }
  
  /* Mobile: 1 coluna */
  @media (max-width: 767px) {
    .masonry-grid {
      column-count: 1;
    }
  }
  
  /* Tablet e Desktop: 2 colunas */
  @media (min-width: 768px) {
    .masonry-grid {
      column-count: 2;
    }
  }
`;

// Componente wrapper para o grid
const GridLayoutWrapper = memo(({ children, shouldUseGrid }) => {
  const containerClasses = shouldUseGrid
    ? 'masonry-grid'
    : 'space-y-4';

  return (
    <>
      <style>{masonryStyles}</style>
      <div className={`${containerClasses} transition-all duration-300 ease-in-out`}>
        {children}
      </div>
    </>
  );
});

const EscolaInfo = memo(({ escola, shouldUseGrid = false, refreshKey = 0, sectionRefs, isMaximized = false, shouldHideInlineMedia = false }) => {
  console.log("EscolaInfo recebeu:", escola);
  
  if (!escola) {
    console.log("EscolaInfo: escola é null ou undefined");
    return null;
  }

  // Componentes que serão renderizados no grid
  const gridSections = [
    { Component: BasicInfo, props: { escola } },
    // { Component: PovosLinguas, props: { escola } },
    { Component: Modalidades, props: { escola } },
    { Component: Infraestrutura, props: { escola } },
    { Component: GestaoProfessores, props: { escola } },
    { Component: ProjetosParcerias, props: { escola } }
  ];

  return (
    <div className="space-y-8">
      {/* Grid de cards */}
      <div ref={(el) => sectionRefs && (sectionRefs.dados = el)}>
        <GridLayoutWrapper shouldUseGrid={shouldUseGrid}>
          {gridSections.map(({ Component, props }, index) => (
            <Component key={index} {...props} />
          ))}
        </GridLayoutWrapper>
      </div>

      {/* História da Escola em destaque */}
      <div ref={(el) => sectionRefs && (sectionRefs.historia = el)}>
        <HistoriaEscola escola={escola} refreshKey={refreshKey} isMaximized={isMaximized} />
      </div>
      
      {/* Imagens da escola, agora renderizadas independentemente da história */}
      <ImagensdasEscolas 
        escola_id={escola.id} 
        refreshKey={refreshKey} 
        isMaximized={isMaximized}
        hideInlineMedia={shouldHideInlineMedia}
      />

      <div ref={(el) => sectionRefs && (sectionRefs.depoimentos = el)}>
        <HistoriadoProfessor 
          escola={escola} 
          refreshKey={refreshKey} 
          isMaximized={isMaximized}
          shouldHideInlineMedia={shouldHideInlineMedia}
        />
      </div>
    </div>
  );
});

export default EscolaInfo; 