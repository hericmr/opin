import React, { memo } from 'react';
import ImagensdasEscolas from '../ImagensdasEscolas';

const HistoriaEscola = memo(({ escola, refreshKey = 0 }) => {
  if (!escola?.historia_da_escola) return null;

  return (
    <article
      className={`
        mt-8 mb-12
        max-w-4xl mx-auto
        prose
        prose-sm sm:prose-base md:prose-lg lg:prose-xl
        prose-headings:text-green-900
        prose-p:text-green-800
        prose-p:leading-relaxed
        prose-p:text-justify
        prose-img:rounded-xl
        prose-img:shadow-lg
        prose-a:text-green-700
        prose-a:no-underline
        prose-a:border-b-2
        prose-a:border-green-100
        prose-a:transition-colors
        hover:prose-a:border-green-600
        bg-white
        rounded-2xl
        px-4 sm:px-6 md:px-8 py-6
        shadow-lg
      `}
    >
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="bg-green-300 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
            <img 
              src={`${process.env.PUBLIC_URL}/onca.svg`} 
              alt="Ícone de onça" 
              className="w-32 h-32 sm:w-36 sm:h-36" 
              style={{ filter: 'none', borderRadius: '0', boxShadow: 'none', marginTop: '80px' }}
              aria-hidden="true"
            />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-green-900 m-0">
            História da Escola
          </h2>
        </div>
        <div className="h-1 w-20 sm:w-24 bg-green-300 rounded-full" />
      </header>

      <div className="text-base sm:text-lg leading-relaxed text-neutral-800">
        {escola.historia_da_escola}
      </div>

      {/* Imagens da escola, responsivas e modulares */}
      <ImagensdasEscolas escola_id={escola.id} refreshKey={refreshKey} />
    </article>
  );
});

export default HistoriaEscola; 