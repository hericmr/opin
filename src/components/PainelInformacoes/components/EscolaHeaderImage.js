import React, { useState } from 'react';
import OptimizedImage from '../../shared/OptimizedImage';
import './EscolaHeaderImage.css';

const EscolaHeaderImage = ({ imagemUrl, className = '', isPreloaded = false }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Se não há URL ou houve erro, não renderiza nada
  if (!imagemUrl || imageError) {
    return null;
  }

  return (
    <div className={`escola-header-image escola-header-shimmer relative overflow-hidden ${className}`}>
      {/* Imagem de fundo que rola com a página */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={imagemUrl}
          alt="Imagem da escola"
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{ filter: 'saturate(1.3)' }}
          isPreloaded={isPreloaded}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      {/* Gradiente overlay mais sutil para preservar as cores */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Padrão decorativo muito sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
      </div>
      
      {/* Efeito de brilho muito sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent rounded-full blur-xl"></div>
    </div>
  );
};

export default EscolaHeaderImage;
