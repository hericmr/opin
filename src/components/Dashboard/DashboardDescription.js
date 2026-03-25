import React, { memo } from 'react';

/**
 * Componente de descrição do Dashboard
 * Otimizado com React.memo para evitar re-renders desnecessários
 */
const DashboardDescription = memo(() => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-b border-gray-100 mb-4">
      <article
        className="
          prose prose-lg max-w-none
          prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
          prose-img:rounded-xl prose-img:shadow-lg
          prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
          w-full
        "
      >
        <section className="text-lg leading-relaxed text-neutral-800">
          <p className="mb-2">
            Este espaço reúne informações sobre as escolas indígenas do estado de São Paulo, apresentando indicadores como número de estudantes e docentes, infraestrutura disponível, distribuição geográfica por Diretorias de Ensino e modalidades de ensino oferecidas. Os dados foram fornecidos pela Secretaria da Educação do Estado de São Paulo (SEDUC) e referem-se ao ano de 2025. A base completa pode ser acessada em:{' '}
            <a 
              href="https://dados.educacao.sp.gov.br/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              dados.educacao.sp.gov.br
            </a>
          </p>
        </section>
      </article>
    </div>
  );
});

DashboardDescription.displayName = 'DashboardDescription';

export default DashboardDescription;

