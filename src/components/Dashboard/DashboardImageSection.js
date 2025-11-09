import React, { memo } from 'react';
import OptimizedImage from '../OptimizedImage';

/**
 * Componente de seção de imagem do Dashboard
 * Otimizado com React.memo para evitar re-renders desnecessários
 * 
 * @param {Object} image - Objeto com imagem_header e Escola
 * @param {string} priority - Prioridade de carregamento ('high' ou 'normal')
 */
const DashboardImageSection = memo(({ image, priority = 'normal' }) => {
  if (!image || !image.imagem_header) return null;

  // Estilo padronizado para imagens - melhores práticas de contraste e saturação
  const imageStyle = {
    filter: 'saturate(1.25) contrast(1.1) brightness(1.05)',
    transition: 'filter 0.3s ease-in-out'
  };

  return (
    <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
      <OptimizedImage
        src={image.imagem_header}
        alt={image.Escola || 'Imagem da escola'}
        className="w-full h-full object-cover"
        style={imageStyle}
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      {/* Legenda no canto inferior */}
      {image.Escola && (
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-md text-base font-medium shadow-lg" style={{
          fontSize: '0.9375rem',
          lineHeight: '1.5',
          letterSpacing: '0.01em'
        }}>
          {image.Escola}
        </div>
      )}
    </section>
  );
});

DashboardImageSection.displayName = 'DashboardImageSection';

export default DashboardImageSection;

