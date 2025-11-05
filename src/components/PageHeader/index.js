import React from 'react';
import MinimalShareButtons from '../MinimalShareButtons';

const PageHeader = ({ 
  title, 
  description, 
  titleFontFamily = 'PapakiloLight, sans-serif',
  titleSize = 'text-4xl md:text-5xl lg:text-6xl',
  descriptionSize = 'text-sm md:text-base',
  className = '',
  children,
  showShareButtons = true
}) => {
  return (
    <div className={`bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-3">
          {/* Link Social Container - Similar to ArcGIS */}
          <div className="flex-1"></div>
          {showShareButtons && (
            <div className="linkSocialContainer">
              <MinimalShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={title} description={description} />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Título da Página - Lado esquerdo */}
          <div className="flex-shrink-0">
            <h1 
              className={`text-white ${titleSize} uppercase leading-none`} 
              style={{ fontFamily: titleFontFamily }}
            >
              {title}
            </h1>
          </div>
          
          {/* Barra verde separadora */}
          <div className="w-px h-12 md:h-16 bg-white/30 flex-shrink-0"></div>
          
          {/* Descrição - Lado direito */}
          <div className="flex-1 min-w-0">
            <p className={`${descriptionSize} text-green-100 leading-relaxed`}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Conteúdo adicional opcional */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;