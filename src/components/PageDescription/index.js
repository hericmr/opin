import React from 'react';

/**
 * Componente de descrição padronizado para páginas estáticas.
 * Aplica a mesma tipografia usada em "Alguns dados" (DashboardDescription).
 * Use-o logo abaixo do PageHeader em cada página estática.
 */
const PageDescription = ({ children, className = '', centered = false }) => (
  <div className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-10 sm:py-14 border-b border-gray-100 mb-4 ${className}`}>
    <div className={`text-xl leading-loose text-neutral-700 ${centered ? 'text-center' : 'text-left'}`}>
      {children}
    </div>
  </div>
);

export default PageDescription;
