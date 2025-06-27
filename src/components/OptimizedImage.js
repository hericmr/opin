import React, { useState, useEffect } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+',
  priority = 'normal', // 'high', 'normal', 'low'
  onLoad,
  onError,
  ...props 
}) => {
  const {
    isLoaded,
    hasError,
    isInView,
    imgRef,
    handleLoad,
    handleError,
    loading
  } = useImageLoader(src, priority);

  // Mostrar loading apenas se demorar muito (mais de 300ms)
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const timer = setTimeout(() => setShowLoading(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isInView, isLoaded, hasError]);

  const handleImageLoad = () => {
    handleLoad();
    onLoad?.();
  };

  const handleImageError = () => {
    handleError();
    onError?.();
  };

  // Determinar a melhor fonte de imagem baseada no suporte do navegador
  const getImageSrc = () => {
    if (!isInView) return placeholder;
    
    // Se temos erro, usar placeholder
    if (hasError) return placeholder;
    
    // Tentar WebP primeiro se suportado
    if (src && typeof window !== 'undefined' && window.WebP) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }
    
    return src || placeholder;
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: '#f3f4f6',
        minHeight: '200px'
      }}
    >
      {/* Placeholder/Blur - muito sutil e rápido */}
      <img
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(2px)' }} // Blur mínimo
        aria-hidden="true"
      />
      
      {/* Imagem Principal */}
      {isInView && (
        <img
          src={getImageSrc()}
          alt={alt}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-150 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
      
      {/* Loading Spinner - apenas se demorar muito */}
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-20">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg className="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Erro ao carregar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedImage); 