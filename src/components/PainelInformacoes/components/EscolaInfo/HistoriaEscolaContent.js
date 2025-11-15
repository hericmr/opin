import React from 'react';

const HistoriaEscolaContent = ({ htmlContent }) => {
  // Remover "Aborda." do conteúdo se estiver presente
  const cleanContent = htmlContent ? htmlContent.replace(/Aborda\./g, '').trim() : '';
  
  return (
    <div
      className="historia-escola-content prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none
        prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
        prose-img:rounded-xl prose-img:shadow-lg
        prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
        prose-strong:text-green-800 prose-em:text-green-700
        prose-blockquote:border-l-green-300 prose-blockquote:bg-green-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
        prose-ul:text-black prose-ol:text-black prose-li:text-black
        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
};

export default HistoriaEscolaContent;
