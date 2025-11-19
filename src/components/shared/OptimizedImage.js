import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagem otimizada - Versão simplificada
 * Funciona exatamente como no painel de informações
 * Sem lógica complexa de estado - apenas renderiza a imagem
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  isPreloaded = false,
  placeholder = null,
  onLoad,
  onError,
  ...props 
}) => {
  // Se não há src válido, mostrar placeholder
  if (!src || typeof src !== 'string' || src.trim() === '') {
    if (placeholder) return placeholder;
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-xs text-gray-500">Sem imagem</div>
        </div>
      </div>
    );
  }

  // Renderizar imagem diretamente - EXATAMENTE como painel de informações
  // Sem wrapper div extra, sem condições, apenas a imagem
  return (
    <img
      src={src}
      alt={alt || ''}
      className={`w-full h-full object-cover ${className}`}
      onLoad={(e) => {
        // Ensure image is visible when loaded
        e.target.style.opacity = '1';
        e.target.style.display = 'block';
        if (onLoad) onLoad(e);
      }}
      onError={(e) => {
        // Hide broken image and show error
        e.target.style.display = 'none';
        console.error('[OptimizedImage] Failed to load image:', src);
        if (onError) onError(e);
      }}
      loading={isPreloaded ? "eager" : "lazy"}
      style={{
        opacity: 1,
        display: 'block',
        ...props.style
      }}
      {...props}
    />
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  isPreloaded: PropTypes.bool,
  placeholder: PropTypes.node,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;
