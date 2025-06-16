import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';

const HistoriaEscola = memo(({ escola }) => {
  if (!escola?.historia_aldeia) return null;

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
        prose-a:border-green-300
        prose-a:transition-colors
        hover:prose-a:border-green-600
        bg-gradient-to-b from-green-50/50 to-amber-50/30
        rounded-2xl
        px-4 sm:px-6 md:px-8 py-6
        shadow-lg
        border border-green-200/50
      `}
    >
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-green-900 m-0">
            História da Escola
          </h2>
        </div>
        <div className="h-1 w-20 sm:w-24 bg-green-300 rounded-full" />
      </header>

      <div className="text-base sm:text-lg leading-relaxed text-neutral-800">
        {escola.historia_aldeia}
      </div>
    </article>
  );
});

export default HistoriaEscola; 