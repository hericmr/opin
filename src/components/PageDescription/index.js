import React from 'react';

/**
 * Componente de descrição padronizado para páginas estáticas.
 * Aplica a mesma tipografia usada em "Alguns dados" (DashboardDescription).
 * Use-o logo abaixo do PageHeader em cada página estática.
 */
const PageDescription = ({ children, className = '', centered = false }) => (
  <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 mb-4 ${className}`}>
    <div className={`text-base sm:text-lg leading-relaxed text-gray-800 ${centered ? 'text-center' : 'text-left'}`}>
      {children}
    </div>
  </div>
);

export default PageDescription;
