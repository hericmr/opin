import logger from "../../utils/logger";
import React, { useState } from 'react';
import { getLocalImageUrl } from '../../utils/imageUtils';

/**
 * Componente de imagem otimizada - Versão simplificada
 * Funciona exatamente como no painel de informações
 * Sem lógica complexa de estado - apenas renderiza a imagem
 */
const OptimizedImageContent = ({
  src,
  alt,
  className = '',
  isPreloaded = false,
  placeholder = null,
  onLoad,
  onError,
  ...props
}) => {
  
  const initialLocalSrc = getLocalImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState(initialLocalSrc);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const getFallbacks = () => {
    const fallbacks = [];
    if (src && src !== initialLocalSrc) fallbacks.push(src);
    
    // Try cross-bucket fallbacks for misplaced local files
    if (initialLocalSrc && initialLocalSrc.includes('/imagens-professores/')) {
      fallbacks.push(initialLocalSrc.replace('/imagens-professores/', '/imagens-das-escolas/'));
    } else if (initialLocalSrc && initialLocalSrc.includes('/imagens-das-escolas/')) {
      fallbacks.push(initialLocalSrc.replace('/imagens-das-escolas/', '/imagens-professores/'));
    }
    
    // Construct cloud Supabase URL if it's a local path
    if (initialLocalSrc && initialLocalSrc.includes('/data/storage/opin/')) {
      const cloudPath = initialLocalSrc.split('/data/storage/opin/')[1];
      fallbacks.push(`https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/${cloudPath}`);
    }

    return fallbacks;
  };

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

  // Renderizar imagem diretamente - respeitando classe de ajuste (object-contain/object-cover)
  const fitClass = className.includes('object-') ? '' : 'object-cover';

  return (
    <img
      src={currentSrc}
      alt={alt || ''}
      className={`w-full h-full ${fitClass} ${className}`}
      onLoad={(e) => {
        // Ensure image is visible when loaded
        e.target.style.opacity = '1';
        e.target.style.display = 'block';
        if (onLoad) onLoad(e);
      }}
      onError={(e) => {
        // Hide broken image and show error
        e.target.style.display = 'none';
        
        const fallbacks = getFallbacks();
        if (fallbackIndex < fallbacks.length) {
          logger.warn('[OptimizedImage] Failed to load image, trying fallback:', fallbacks[fallbackIndex]);
          setCurrentSrc(fallbacks[fallbackIndex]);
          setFallbackIndex(prev => prev + 1);
          e.target.style.display = 'block'; // ensure visible for retry
          return;
        }
        logger.error('[OptimizedImage] Failed to load image after fallbacks:', src);

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

// key={src}: trocar a imagem remonta o componente e reinicia src atual e fallbacks
const OptimizedImage = (props) => <OptimizedImageContent key={props.src} {...props} />;

export default OptimizedImage;
