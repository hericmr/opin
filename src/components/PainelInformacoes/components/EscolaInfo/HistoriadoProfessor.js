import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';
import ImagemHistoriadoProfessor from '../ImagemHistoriadoProfessor';

const HistoriadoProfessor = memo(({ escola }) => {
  const historia = escola?.historia_do_prof;
  if (!historia) return null;

  return (
    <article
      className="
        mt-8 mb-12 max-w-4xl mx-auto
        px-4 sm:px-6 md:px-8 py-6
        bg-white rounded-2xl shadow-lg border border-green-100/50
        prose prose-sm sm:prose-base md:prose-lg lg:prose-xl
        prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
        prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
      "
    >
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="bg-green-300 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
            <img 
              src={process.env.PUBLIC_URL + '/passaro.svg'} 
              alt="Ícone de pássaro" 
              className="w-16 h-16 sm:w-24 sm:h-24" 
              style={{ filter: 'none', borderRadius: '0', boxShadow: 'none' }}
              aria-hidden="true"
            />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-black m-0">
            História do Professor
          </h2>
        </div>
        <div className="h-1 w-20 sm:w-24 bg-green-300 rounded-full" />
      </header>

      <section className="text-base sm:text-lg leading-relaxed text-neutral-800">
        <p>{historia}</p>
      </section>

      <ImagemHistoriadoProfessor escola_id={escola.id} />
    </article>
  );
});

export default HistoriadoProfessor;
