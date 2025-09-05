import React, { memo } from 'react';
import ImagensdasEscolas from '../ImagensdasEscolas';
import './HistoriaEscola.css';

const HistoriaEscola = memo(({ escola, refreshKey = 0 }) => {
  if (!escola?.historia_da_escola) return null;

  // Usar o HTML diretamente, igual à história dos professores
  const htmlContent = escola.historia_da_escola;

  return (
    <div className="mt-8 mb-12 flex flex-col items-center">
      {/* Header externo ao card */}
      <header className="mb-6 sm:mb-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="bg-green-300 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
            <img 
              src={`${process.env.PUBLIC_URL}/onca.svg`} 
              alt="Ícone de onça" 
              className="w-18 h-18 sm:w-36 sm:h-36" 
              style={{ 
                filter: 'none', 
                borderRadius: '0', 
                boxShadow: 'none', 
                margin: '0',
                padding: '0',
                border: 'none',
                outline: 'none',
                transform: 'translateY(17px)'
              }}
              aria-hidden="true"
            />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-black m-0">
            História da Escola
          </h2>
        </div>
        <div className="h-1 w-20 sm:w-24 bg-green-300 rounded-full" />
      </header>

      {/* Card com conteúdo centralizado */}
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
        <div 
          className="historia-escola-content prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none
            prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
            prose-img:rounded-xl prose-img:shadow-lg
            prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
            prose-strong:text-green-800 prose-em:text-green-700
            prose-blockquote:border-l-green-300 prose-blockquote:bg-green-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
            prose-ul:text-black prose-ol:text-black prose-li:text-black
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Imagens da escola, responsivas e modulares */}
        <ImagensdasEscolas escola_id={escola.id} refreshKey={refreshKey} />
      </article>
    </div>
  );
});

export default HistoriaEscola; 