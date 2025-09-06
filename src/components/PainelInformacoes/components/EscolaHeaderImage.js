import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import './EscolaHeaderImage.css';

const EscolaHeaderImage = ({ imagemUrl, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
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
        <img
          src={imagemUrl}
          alt="Imagem da escola"
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Loading placeholder com animação */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <ImageIcon className="w-8 h-8 text-gray-400 loading-pulse" />
                <div className="absolute inset-0 bg-white bg-opacity-50 rounded-full animate-ping"></div>
              </div>
              <div className="text-sm text-gray-500 font-medium">Carregando imagem...</div>
            </div>
          </div>
        )}
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
