import React, { memo } from 'react';

/**
 * Componente de descrição do Dashboard
 * Otimizado com React.memo para evitar re-renders desnecessários
 */
const DashboardDescription = memo(() => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="prose prose-lg sm:prose-xl max-w-none" style={{
        fontSize: '1.125rem',
        lineHeight: '1.75',
        color: '#374151',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <p className="mb-6" style={{
          fontSize: '1.125rem',
          lineHeight: '1.75',
          color: '#374151',
          letterSpacing: '0.01em'
        }}>
          Este espaço reúne informações sobre as escolas indígenas do estado de São Paulo, apresentando indicadores como número de estudantes e docentes, infraestrutura disponível, distribuição geográfica por Diretorias de Ensino e modalidades de ensino oferecidas. Os dados foram fornecidos pela Secretaria da Educação do Estado de São Paulo (SEDUC) e referem-se ao ano de 2025. A base completa pode ser acessada em:{' '}
          <a 
            href="https://dados.educacao.sp.gov.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-800 underline font-medium transition-colors"
            style={{
              color: '#15803d',
              textDecorationThickness: '1.5px',
              textUnderlineOffset: '2px'
            }}
          >
            dados.educacao.sp.gov.br
          </a>
        </p>
      </div>
    </div>
  );
});

DashboardDescription.displayName = 'DashboardDescription';

export default DashboardDescription;

