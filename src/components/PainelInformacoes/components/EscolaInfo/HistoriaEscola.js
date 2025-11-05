import React, { memo } from 'react';
import HistoriaEscolaContent from './HistoriaEscolaContent';
import HistoriaEscolaHeader from './HistoriaEscolaHeader';
import './HistoriaEscola.css';

const HistoriaEscola = memo(({ escola, refreshKey = 0, isMaximized = false }) => {
  if (!escola?.historia_da_escola) return null;

  // Usar o HTML diretamente, igual à história dos professores
  const htmlContent = escola.historia_da_escola;

  return (
    <div className="mt-8 mb-12 flex flex-col items-center w-full">
      {/* Header externo ao card - mantém largura máxima sempre */}
      <header className="historia-escola-header mb-6 sm:mb-8 w-full max-w-4xl mx-auto">
        <HistoriaEscolaHeader />
        <div className="h-1 w-20 sm:w-24 bg-green-300 rounded-full" />
      </header>

      {/* Card com conteúdo - mantém largura máxima sempre */}
      <article
        className="
          px-4 sm:px-6 md:px-8 py-6
          bg-white rounded-2xl shadow-lg
          prose prose-sm sm:prose-base md:prose-lg lg:prose-xl
          prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
          prose-img:rounded-xl prose-img:shadow-lg
          prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
          max-w-4xl mx-auto w-full
        "
      >
        <HistoriaEscolaContent htmlContent={htmlContent} />
      </article>
    </div>
  );
});

export default HistoriaEscola; 