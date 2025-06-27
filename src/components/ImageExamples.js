import React from 'react';
import OptimizedImage from './OptimizedImage';

// Exemplo de uso para imagens de alta prioridade (hero, banner principal)
export const HeroImage = ({ src, alt }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority="high"
    className="w-full h-64 md:h-96 object-cover"
  />
);

// Exemplo para imagens de prioridade normal (conteúdo principal)
export const ContentImage = ({ src, alt }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority="normal"
    className="w-full h-48 object-cover rounded-lg"
  />
);

// Exemplo para imagens de baixa prioridade (galeria, thumbnails)
export const ThumbnailImage = ({ src, alt }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority="low"
    className="w-24 h-24 object-cover rounded"
  />
);

// Exemplo para imagens de escola no painel de informações
export const EscolaImage = ({ src, alt, isMain = false }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority={isMain ? "high" : "normal"}
    className="w-full h-48 md:h-64 object-cover rounded-lg shadow-md"
  />
);

// Exemplo para galeria de fotos
export const GalleryImage = ({ src, alt, index }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority={index < 3 ? "normal" : "low"} // Primeiras 3 imagens carregam mais rápido
    className="w-full h-32 md:h-40 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
  />
);

// Exemplo para avatar/perfil
export const AvatarImage = ({ src, alt, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority="high" // Avatars são pequenos e importantes
      className={`${sizeClasses[size]} object-cover rounded-full`}
    />
  );
};

// Exemplo para imagens de fundo
export const BackgroundImage = ({ src, alt, children }) => (
  <div className="relative">
    <OptimizedImage
      src={src}
      alt={alt}
      priority="normal"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Exemplo para carrossel de imagens
export const CarouselImage = ({ src, alt, isActive }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority={isActive ? "high" : "normal"}
    className={`w-full h-64 md:h-96 object-cover transition-opacity duration-300 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}
  />
);

// Exemplo para grid de imagens responsivo
export const ImageGrid = ({ images }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {images.map((image, index) => (
      <OptimizedImage
        key={image.id || index}
        src={image.src}
        alt={image.alt}
        priority={index < 6 ? "normal" : "low"} // Primeiras 6 imagens carregam mais rápido
        className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      />
    ))}
  </div>
);

// Exemplo para imagem com fallback
export const ImageWithFallback = ({ src, alt, fallbackSrc }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    priority="normal"
    className="w-full h-48 object-cover rounded-lg"
    onError={(e) => {
      if (fallbackSrc && e.target.src !== fallbackSrc) {
        e.target.src = fallbackSrc;
      }
    }}
  />
);

export default {
  HeroImage,
  ContentImage,
  ThumbnailImage,
  EscolaImage,
  GalleryImage,
  AvatarImage,
  BackgroundImage,
  CarouselImage,
  ImageGrid,
  ImageWithFallback
}; 