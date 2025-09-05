/**
 * Configurações de temas para o componente Avatar
 * Facilita a customização visual e mantém consistência
 */

export const avatarThemes = {
  // Tema padrão (verde)
  default: {
    borderColor: 'border-green-200',
    backgroundColor: 'bg-green-50',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-500',
    hoverBorderColor: 'hover:border-green-300'
  },

  // Tema professor (azul)
  professor: {
    borderColor: 'border-blue-200',
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-500',
    hoverBorderColor: 'hover:border-blue-300'
  },

  // Tema escola (laranja)
  escola: {
    borderColor: 'border-orange-200',
    backgroundColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    badgeColor: 'bg-orange-500',
    hoverBorderColor: 'hover:border-orange-300'
  },

  // Tema neutro (cinza)
  neutral: {
    borderColor: 'border-gray-200',
    backgroundColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    badgeColor: 'bg-gray-500',
    hoverBorderColor: 'hover:border-gray-300'
  },

  // Tema indígena (marrom/terra)
  indigena: {
    borderColor: 'border-amber-200',
    backgroundColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    badgeColor: 'bg-amber-600',
    hoverBorderColor: 'hover:border-amber-300'
  },

  // Tema sucesso (verde escuro)
  success: {
    borderColor: 'border-emerald-200',
    backgroundColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-500',
    hoverBorderColor: 'hover:border-emerald-300'
  },

  // Tema aviso (amarelo)
  warning: {
    borderColor: 'border-yellow-200',
    backgroundColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    badgeColor: 'bg-yellow-500',
    hoverBorderColor: 'hover:border-yellow-300'
  },

  // Tema erro (vermelho)
  error: {
    borderColor: 'border-red-200',
    backgroundColor: 'bg-red-50',
    textColor: 'text-red-700',
    badgeColor: 'bg-red-500',
    hoverBorderColor: 'hover:border-red-300'
  }
};

/**
 * Configurações de tamanhos predefinidos
 */
export const avatarSizes = {
  xs: 'w-6 h-6',
  small: 'w-8 h-8',
  medium: 'w-12 h-12 sm:w-16 sm:h-16',
  large: 'w-16 h-16 sm:w-20 sm:h-20',
  xlarge: 'w-20 h-20 sm:w-24 sm:h-24',
  xxlarge: 'w-24 h-24 sm:w-32 sm:h-32'
};

/**
 * Configurações de formas
 */
export const avatarShapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
  rounded: 'rounded-xl',
  none: 'rounded-none'
};

/**
 * Configurações de variantes de estilo
 */
export const avatarVariants = {
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

/**
 * Configurações de badges
 */
export const badgePositions = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
};

export const badgeSizes = {
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-5 h-5'
};

/**
 * Função helper para aplicar tema
 */
export const applyTheme = (themeName, customTheme = {}) => {
  const baseTheme = avatarThemes[themeName] || avatarThemes.default;
  return { ...baseTheme, ...customTheme };
};

/**
 * Função helper para gerar classes CSS do tema
 */
export const getThemeClasses = (theme) => {
  return {
    container: `${theme.borderColor} ${theme.backgroundColor} ${theme.hoverBorderColor}`,
    text: theme.textColor,
    badge: theme.badgeColor
  };
};

export default {
  themes: avatarThemes,
  sizes: avatarSizes,
  shapes: avatarShapes,
  variants: avatarVariants,
  badgePositions,
  badgeSizes,
  applyTheme,
  getThemeClasses
};
