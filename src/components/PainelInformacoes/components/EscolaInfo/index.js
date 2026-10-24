import React, { memo } from 'react';
import { isCardVisible } from '../../../../components/AdminPanel/constants/cardVisibilityConfig';
import { useGlobalCardVisibility } from '../../../../hooks/useGlobalCardVisibility';

// Import all section components
import BasicInfo from './BasicInfo';
import HistoriaEscola from './HistoriaEscola';
import HistoriaTerraIndigena from './HistoriaTerraIndigena';
import Modalidades from './Modalidades';
import Infraestrutura from './Infraestrutura';
import GestaoProfessores from './GestaoProfessores';
import ProjetosParcerias from './ProjetosParcerias';
import HistoriadoProfessor from './HistoriadoProfessor';
import GaleriaHorizontal from '../GaleriaHorizontal';

const EscolaInfo = memo(({
  escola,
  sectionRefs,
  isMaximized = false,
  shouldHideInlineMedia = false,
  isLoadingDetails = false,
  onOpenGaleria,
}) => {
  // Buscar configuração global
  const { globalVisibility } = useGlobalCardVisibility();

  if (!escola) {
    return null;
  }

  // Obter configuração de visibilidade
  const cardsVisibilidade = escola.cards_visibilidade;

  // Componentes que serão renderizados no grid (com filtro de visibilidade)
  const gridSections = [
    { Component: BasicInfo, props: { escola }, id: 'basicInfo' },
    // { Component: PovosLinguas, props: { escola }, id: 'povosLinguas' },
    { Component: Modalidades, props: { escola }, id: 'modalidades' },
    { Component: Infraestrutura, props: { escola }, id: 'infraestrutura' },
    { Component: GestaoProfessores, props: { escola }, id: 'gestaoProfessores' },
    { Component: ProjetosParcerias, props: { escola }, id: 'projetosParcerias' }
  ].filter(({ id }) => isCardVisible(cardsVisibilidade, id, globalVisibility));

  return (
    <div className="space-y-10">
      {/* Ficha da escola: uma seção por assunto */}
      {gridSections.length > 0 && (
        <div ref={(el) => sectionRefs && (sectionRefs.dados = el)}>
          <div className="space-y-8">
            {gridSections.map(({ Component, props, id }) => (
              <Component key={id} {...props} />
            ))}
          </div>
        </div>
      )}

      {/* História da Terra Indígena em destaque */}
      {isCardVisible(cardsVisibilidade, 'historiaEscola', globalVisibility) && (
        <>
          <HistoriaTerraIndigena escola={escola} />
        </>
      )}

      {/* História da Escola em destaque */}
      {isCardVisible(cardsVisibilidade, 'historiaEscola', globalVisibility) && (
        <div ref={(el) => sectionRefs && (sectionRefs.historia = el)}>
          <HistoriaEscola escola={escola} isMaximized={isMaximized} />
        </div>
      )}

      {/* Galeria filmstrip entre a história da escola e a do professor */}
      {isCardVisible(cardsVisibilidade, 'imagensEscola', globalVisibility) && (
        <GaleriaHorizontal
          escola_id={escola.id}
          hideInlineMedia={shouldHideInlineMedia}
          onOpenGaleria={onOpenGaleria}
        />
      )}

      {/* História dos Professores */}
      {isCardVisible(cardsVisibilidade, 'historiaProfessor', globalVisibility) && (
        <div ref={(el) => sectionRefs && (sectionRefs.depoimentos = el)}>
          <HistoriadoProfessor
            escola={escola}
          />
        </div>
      )}
    </div>
  );
});

export default EscolaInfo; 