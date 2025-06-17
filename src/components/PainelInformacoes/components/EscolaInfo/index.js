import React, { memo } from 'react';

// Import all section components
import BasicInfo from './BasicInfo';
import HistoriaEscola from './HistoriaEscola';
import PovosLinguas from './PovosLinguas';
import Ensino from './Ensino';
import Infraestrutura from './Infraestrutura';
import GestaoProfessores from './GestaoProfessores';
import RedesSociais from './RedesSociais';
import Localizacao from './Localizacao';
import ImagemHistoriadoProfessor from '../ImagemHistoriadoProfessor';
import HistoriadoProfessor from './HistoriadoProfessor';

// Componente wrapper para o grid
const GridLayoutWrapper = memo(({ children, shouldUseGrid }) => {
  const containerClasses = shouldUseGrid
    ? 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6'
    : 'space-y-4';

  return (
    <div className={`${containerClasses} transition-all duration-300 ease-in-out`}>
      {children}
    </div>
  );
});

const EscolaInfo = memo(({ escola, shouldUseGrid = false }) => {
  console.log("EscolaInfo recebeu:", escola);
  
  if (!escola) {
    console.log("EscolaInfo: escola é null ou undefined");
    return null;
  }

  // Componentes que serão renderizados no grid
  const gridSections = [
    { Component: BasicInfo, props: { escola } },
    { Component: PovosLinguas, props: { escola } },
    { Component: Ensino, props: { escola } },
    { Component: Infraestrutura, props: { escola } },
    { Component: GestaoProfessores, props: { escola } },
    { Component: RedesSociais, props: { escola } },
    { Component: Localizacao, props: { escola } }
  ];

  return (
    <div className="space-y-8">
      {/* Grid de cards */}
      <GridLayoutWrapper shouldUseGrid={shouldUseGrid}>
        {gridSections.map(({ Component, props }, index) => (
          <Component key={index} {...props} />
        ))}
      </GridLayoutWrapper>

      {/* História da Escola em destaque */}
      <HistoriaEscola escola={escola} />
      <HistoriadoProfessor escola={escola} />
    </div>
  );
});

export default EscolaInfo; 