import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { User, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Componente Avatar modular e expansível
 * Suporta diferentes tamanhos, formas, temas e funcionalidades avançadas
 */
const Avatar = ({
  // Props básicas
  src,
  alt,
  name,
  
  // Tamanhos
  size = 'medium',
  customSize,
  
  // Forma e estilo
  shape = 'circle',
  variant = 'default',
  
  // Estados e interações
  loading = false,
  error = false,
  clickable = false,
  
  // Customização visual
  className = '',
  borderColor = 'border-green-200',
  backgroundColor = 'bg-gray-100',
  textColor = 'text-gray-600',
  
  // Funcionalidades avançadas
  badge,
  badgePosition = 'bottom-right',
  badgeColor = 'bg-green-500',
  badgeSize = 'small',
  
  // Callbacks
  onClick,
  onError,
  onLoad,
  
  // Configurações de fallback
  fallbackIcon = 'user',
  showInitials = true,
  maxInitials = 2,
  
  // Configurações de imagem
  lazy = true,
  priority = false,
  
  // Props adicionais
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  // Configurações de tamanho
  const sizeConfig = useMemo(() => {
    if (customSize) {
      return {
        container: `w-[${customSize}] h-[${customSize}]`,
        text: 'text-sm',
        icon: 'w-6 h-6',
        badge: 'w-3 h-3'
      };
    }

    const sizes = {
      xs: {
        container: 'w-6 h-6',
        text: 'text-xs',
        icon: 'w-3 h-3',
        badge: 'w-2 h-2'
      },
      small: {
        container: 'w-8 h-8',
        text: 'text-xs',
        icon: 'w-4 h-4',
        badge: 'w-2 h-2'
      },
      medium: {
        container: 'w-12 h-12 sm:w-16 sm:h-16',
        text: 'text-sm sm:text-base',
        icon: 'w-6 h-6 sm:w-8 sm:h-8',
        badge: 'w-3 h-3'
      },
      large: {
        container: 'w-16 h-16 sm:w-20 sm:h-20',
        text: 'text-base sm:text-lg',
        icon: 'w-8 h-8 sm:w-10 sm:h-10',
        badge: 'w-4 h-4'
      },
      xlarge: {
        container: 'w-20 h-20 sm:w-24 sm:h-24',
        text: 'text-lg sm:text-xl',
        icon: 'w-10 h-10 sm:w-12 sm:h-12',
        badge: 'w-5 h-5'
      },
      xxlarge: {
        container: 'w-24 h-24 sm:w-32 sm:h-32',
        text: 'text-xl sm:text-2xl',
        icon: 'w-12 h-12 sm:w-16 sm:h-16',
        badge: 'w-6 h-6'
      }
    };

    return sizes[size] || sizes.medium;
  }, [size, customSize]);

  // Configurações de forma
  const shapeConfig = useMemo(() => {
    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-lg',
      rounded: 'rounded-xl',
      none: 'rounded-none'
    };
    return shapes[shape] || shapes.circle;
  }, [shape]);

  // Configurações de variante
  const variantConfig = useMemo(() => {
    const variants = {
      default: {
        border: 'border-2',
        shadow: 'shadow-md',
        hover: 'hover:shadow-lg'
      },
      minimal: {
        border: 'border',
        shadow: 'shadow-sm',
        hover: 'hover:shadow-md'
      },
      flat: {
        border: 'border-2',
        shadow: 'shadow-none',
        hover: 'hover:shadow-sm'
      },
      elevated: {
        border: 'border-2',
        shadow: 'shadow-lg',
        hover: 'hover:shadow-xl'
      }
    };
    return variants[variant] || variants.default;
  }, [variant]);

  // Configurações de badge
  const badgeConfig = useMemo(() => {
    const positions = {
      'top-left': 'top-0 left-0',
      'top-right': 'top-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };

    const badgeSizes = {
      small: 'w-3 h-3',
      medium: 'w-4 h-4',
      large: 'w-5 h-5'
    };

    return {
      position: positions[badgePosition] || positions['bottom-right'],
      size: badgeSizes[badgeSize] || badgeSizes.small
    };
  }, [badgePosition, badgeSize]);

  // Gerar iniciais do nome
  const initials = useMemo(() => {
    if (!name || !showInitials) return '';
    
    const words = name.trim().split(' ');
    const initialsArray = words
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase())
      .filter(char => char.match(/[A-Z]/));
    
    return initialsArray.join('');
  }, [name, showInitials, maxInitials]);

  // Determinar ícone de fallback
  const FallbackIcon = useMemo(() => {
    const icons = {
      user: User,
      alert: AlertCircle,
      loading: Loader2
    };
    return icons[fallbackIcon] || icons.user;
  }, [fallbackIcon]);

  // Handlers
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    onError?.();
  };

  const handleClick = (e) => {
    if (clickable || onClick) {
      onClick?.(e);
    }
  };

  // Determinar conteúdo a ser exibido
  const shouldShowImage = src && !imageError && !loading;
  const shouldShowInitials = !shouldShowImage && initials && !error;
  const shouldShowIcon = !shouldShowImage && !shouldShowInitials && !error;

  // Classes base
  const baseClasses = `
    ${sizeConfig.container}
    ${shapeConfig}
    ${variantConfig.border}
    ${borderColor}
    ${variantConfig.shadow}
    ${clickable || onClick ? 'cursor-pointer' : ''}
    ${variantConfig.hover}
    transition-all duration-200
    relative overflow-hidden
    flex items-center justify-center
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div 
      className={baseClasses}
      onClick={handleClick}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      {...props}
    >
      {/* Estado de loading */}
      {loading && (
        <div className={`absolute inset-0 ${backgroundColor} flex items-center justify-center`}>
          <Loader2 className={`${sizeConfig.icon} animate-spin text-green-600`} />
        </div>
      )}

      {/* Imagem */}
      {shouldShowImage && (
        <img
          src={src}
          alt={alt || `Avatar de ${name}` || 'Avatar'}
          className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
          {...(priority && { fetchPriority: 'high' })}
        />
      )}

      {/* Estado de loading da imagem */}
      {imageLoading && shouldShowImage && (
        <div className={`absolute inset-0 ${backgroundColor} flex items-center justify-center`}>
          <Loader2 className={`${sizeConfig.icon} animate-spin text-green-600`} />
        </div>
      )}

      {/* Iniciais */}
      {shouldShowInitials && (
        <span className={`${sizeConfig.text} font-semibold ${textColor}`}>
          {initials}
        </span>
      )}

      {/* Ícone de fallback */}
      {shouldShowIcon && (
        <FallbackIcon className={`${sizeConfig.icon} ${textColor}`} />
      )}

      {/* Estado de erro */}
      {error && (
        <div className={`absolute inset-0 ${backgroundColor} flex items-center justify-center`}>
          <AlertCircle className={`${sizeConfig.icon} text-red-500`} />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className={`absolute ${badgeConfig.position} ${badgeConfig.size} ${badgeColor} rounded-full border-2 border-white`}>
          {typeof badge === 'string' ? (
            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
              {badge}
            </span>
          ) : (
            badge
          )}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  // Props básicas
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  
  // Tamanhos
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xlarge', 'xxlarge']),
  customSize: PropTypes.string,
  
  // Forma e estilo
  shape: PropTypes.oneOf(['circle', 'square', 'rounded', 'none']),
  variant: PropTypes.oneOf(['default', 'minimal', 'flat', 'elevated']),
  
  // Estados e interações
  loading: PropTypes.bool,
  error: PropTypes.bool,
  clickable: PropTypes.bool,
  
  // Customização visual
  className: PropTypes.string,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  
  // Funcionalidades avançadas
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  badgePosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  badgeColor: PropTypes.string,
  badgeSize: PropTypes.oneOf(['small', 'medium', 'large']),
  
  // Callbacks
  onClick: PropTypes.func,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  
  // Configurações de fallback
  fallbackIcon: PropTypes.oneOf(['user', 'alert', 'loading']),
  showInitials: PropTypes.bool,
  maxInitials: PropTypes.number,
  
  // Configurações de imagem
  lazy: PropTypes.bool,
  priority: PropTypes.bool
};

export default Avatar;
