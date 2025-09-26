import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../shared/Avatar';
import { avatarThemes } from '../../shared/AvatarThemes';
import useImagePreloader from '../../../hooks/useImagePreloader';

const FotoProfessor = ({ 
  fotoUrl, 
  nomeProfessor, 
  tamanho = 'medium',
  className = '',
  showFallback = true,
  // Novas props para customização avançada
  theme = 'professor',
  variant = 'default',
  shape = 'circle',
  clickable = false,
  badge,
  badgePosition = 'bottom-right',
  onClick,
  onError,
  onLoad,
  // Props para compatibilidade com tamanhos antigos
  size,
  customSize,
  // Props para preload
  escolaId
}) => {
  // Mapear tamanhos antigos para novos
  const sizeMapping = {
    small: 'medium',
    medium: 'large', 
    large: 'xlarge',
    xlarge: 'xxlarge'
  };

  const mappedSize = size || sizeMapping[tamanho] || 'large';
  
  // Hook de preload de imagens
  const { isImagePreloaded } = useImagePreloader(escolaId, !!escolaId);
  
  // Aplicar tema
  const themeConfig = avatarThemes[theme] || avatarThemes.professor;
  
  // Se não há URL da foto e não deve mostrar fallback, não renderiza nada
  if (!fotoUrl && !showFallback) {
    return null;
  }

  return (
    <Avatar
      src={fotoUrl}
      name={nomeProfessor}
      alt={nomeProfessor ? `Foto de ${nomeProfessor}` : 'Foto do professor'}
      size={customSize ? undefined : mappedSize}
      customSize={customSize}
      shape={shape}
      variant={variant}
      theme={theme}
      clickable={clickable}
      badge={badge}
      badgePosition={badgePosition}
      className={className}
      onClick={onClick}
      onError={onError}
      onLoad={onLoad}
      showInitials={true}
      maxInitials={2}
      fallbackIcon="user"
      lazy={!isImagePreloaded(fotoUrl)}
      // Aplicar tema customizado
      borderColor={themeConfig.borderColor}
      backgroundColor={themeConfig.backgroundColor}
      textColor={themeConfig.textColor}
      badgeColor={themeConfig.badgeColor}
    />
  );
};

FotoProfessor.propTypes = {
  // Props básicas (compatibilidade)
  fotoUrl: PropTypes.string,
  nomeProfessor: PropTypes.string,
  tamanho: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  className: PropTypes.string,
  showFallback: PropTypes.bool,
  
  // Novas props para customização avançada
  theme: PropTypes.oneOf(['default', 'professor', 'escola', 'neutral', 'indigena', 'success', 'warning', 'error']),
  variant: PropTypes.oneOf(['default', 'minimal', 'flat', 'elevated']),
  shape: PropTypes.oneOf(['circle', 'square', 'rounded', 'none']),
  clickable: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  badgePosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  onClick: PropTypes.func,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xlarge', 'xxlarge']),
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default FotoProfessor;
