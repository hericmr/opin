import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';

const HistoriaAldeia = memo(({ escola }) => {
  if (!escola?.historia_aldeia) return null;

  return (
    <article 
      className={`
        mt-8 mb-12
        max-w-4xl mx-auto
        prose prose-lg lg:prose-xl
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
        bg-gradient-to-b from-amber-50/50 to-amber-50/30
        rounded-2xl
        p-8
        shadow-lg
        border border-amber-200/50
      `}
    >
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-amber-700" />
          <h2 className="text-2xl font-bold text-amber-900 m-0">
            História da Aldeia
          </h2>
        </div>
        <div className="h-1 w-24 bg-amber-300 rounded-full" />
      </header>

      <div className="text-lg leading-relaxed text-neutral-800">
        {escola.historia_aldeia}
      </div>
    </article>
  );
});

export default HistoriaAldeia; 