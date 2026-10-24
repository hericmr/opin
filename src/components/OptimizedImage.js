import React, { useState, useEffect } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { getLocalImageUrl } from '../utils/imageUtils';

const OptimizedImageContent = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+',
  priority = 'normal', // 'high', 'normal', 'low'
  onLoad,
  onError,
  ...props 
}) => {
  // Resolve source URL using local mapping if available
  const resolvedSrc = getLocalImageUrl(src);

  const {
    isLoaded,
    hasError,
    isInView,
    imgRef,
    handleLoad,
    handleError,
    loading
  } = useImageLoader(resolvedSrc, priority);

  // Mostrar loading apenas se demorar muito (mais de 300ms)
  const carregando = isInView && !isLoaded && !hasError;
  const [demorou, setDemorou] = useState(false);
  useEffect(() => {
    if (!carregando) return;
    const timer = setTimeout(() => setDemorou(true), 300);
    return () => clearTimeout(timer);
  }, [carregando]);
  const showLoading = carregando && demorou;

  const handleImageLoad = () => {
    handleLoad();
    onLoad?.();
  };

  const [fallbackStage, setFallbackStage] = useState(0);

  // Determinar a melhor fonte de imagem baseada no estado de erro
  const getImageSrc = () => {
    if (!isInView) return placeholder;
    if (hasError) return placeholder;
    
    // Stage 0: Tentar WebP local se aplicável
    if (fallbackStage === 0 && resolvedSrc && typeof window !== 'undefined') {
      return resolvedSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    // Stage 1: Tentar a extensão original local
    if (fallbackStage === 1 && resolvedSrc) {
      return resolvedSrc;
    }

    // Stage 2: Tentar a URL original bruta ou endpoint do Storage API diretamente
    if (fallbackStage === 2) {
      if (src && src !== resolvedSrc) return src;
      // Se a URL local for a static do Nginx, tenta bater no endpoint do supabase storage
      if (resolvedSrc && resolvedSrc.includes('/data/storage/opin/')) {
        return resolvedSrc.replace('/data/storage/opin/', '/storage/v1/object/public/');
      }
    }
    
    return placeholder;
  };

  const handleImageError = () => {
    const currentSrc = getImageSrc();
    
    if (fallbackStage === 0) {
      // Se WebP local falhou, vai para Stage 1 (original local)
      if (currentSrc !== resolvedSrc) {
        setFallbackStage(1);
        return;
      }
      setFallbackStage(2);
      return;
    }
    
    if (fallbackStage === 1) {
      // Se local original falhou, tenta Stage 2
      setFallbackStage(2);
      return;
    }

    // Se todos falharam, marcamos como erro
    handleError();
    onError?.();
  };

  const actualImgRef = React.useRef(null);

  useEffect(() => {
    if (isInView && !isLoaded && actualImgRef.current && actualImgRef.current.complete) {
      handleLoad();
      onLoad?.();
    }
  }, [isInView, resolvedSrc, isLoaded, handleLoad, onLoad]);

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
          ref={actualImgRef}
          src={getImageSrc()}
          alt={alt}
          loading={loading}
          fetchPriority={priority === 'high' ? 'high' : 'auto'}
          className={`w-full h-full object-cover transition-opacity duration-150 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
      
      {/* Loading State - apenas se demorar muito */}
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-20">
          <span className="text-xs text-gray-600">Carregando...</span>
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

// key={src}: trocar a imagem remonta o componente, reiniciando carregamento,
// erro e estágio de fallback (antes a nova imagem herdava o estado da anterior)
const OptimizedImage = (props) => <OptimizedImageContent key={props.src} {...props} />;

export default React.memo(OptimizedImage);
