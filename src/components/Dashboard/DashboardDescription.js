import React, { memo } from 'react';
import PageDescription from '../PageDescription';

/**
 * Componente de descrição do Dashboard
 * Otimizado com React.memo para evitar re-renders desnecessários
 */
const DashboardDescription = memo(() => {
  return (
    <PageDescription>
      Este espaço reúne informações sobre as escolas indígenas do estado de São Paulo, apresentando indicadores como número de estudantes e docentes, infraestrutura disponível, distribuição geográfica por Diretorias de Ensino e modalidades de ensino oferecidas. Os dados foram fornecidos pela Secretaria da Educação do Estado de São Paulo (SEDUC) e referem-se ao ano de 2025. A base completa pode ser acessada em:{' '}
      <a
        href="https://dados.educacao.sp.gov.br/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 border-b-2 border-green-100 hover:border-green-600 no-underline"
      >
        dados.educacao.sp.gov.br
      </a>
    </PageDescription>
  );
});

DashboardDescription.displayName = 'DashboardDescription';

export default DashboardDescription;

