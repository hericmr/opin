import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagem otimizada com preload
 * Mostra placeholder enquanto carrega e transição suave quando pronta
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // Se a imagem foi preloadada, mostrar imediatamente
    if (isPreloaded) {
      setImageLoaded(true);
      setShowImage(true);
    }
  }, [isPreloaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    setShowImage(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    if (onError) onError();
  };

  // Se houve erro, mostrar placeholder ou nada
  if (imageError) {
    return placeholder || null;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-xs text-gray-500">Carregando...</div>
          </div>
        </div>
      )}

      {/* Imagem */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          showImage 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-105'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  isPreloaded: PropTypes.bool,
  placeholder: PropTypes.node,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;