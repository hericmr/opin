import React from 'react';

/**
 * Componente de descrição padronizado para páginas estáticas.
 * Aplica a mesma tipografia usada em "Alguns dados" (DashboardDescription).
 * Use-o logo abaixo do PageHeader em cada página estática.
 */
const PageDescription = ({ children, className = '', centered = false }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-b border-gray-100 mb-4 ${className}`}>
    <div className={`text-lg leading-relaxed text-neutral-800 ${centered ? 'text-center' : 'text-justify'}`}>
      {children}
    </div>
  </div>
);

export default PageDescription;
