import React from 'react';
import Avatar from '../../shared/Avatar';
import { avatarThemes } from '../../shared/AvatarThemes';
import useImagePreloader from '../../../hooks/useImagePreloader';
import { getLocalImageUrl } from '../../../utils/imageUtils';

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

  // Check for local image URL
  const localFotoUrl = getLocalImageUrl(fotoUrl, 'avatar');

  return (
    <Avatar
      src={localFotoUrl}
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
      lazy={!isImagePreloaded(localFotoUrl)}
      // Aplicar tema customizado
      borderColor={themeConfig.borderColor}
      backgroundColor={themeConfig.backgroundColor}
      textColor={themeConfig.textColor}
      badgeColor={themeConfig.badgeColor}
    />
  );
};

export default FotoProfessor;
