import React, { memo } from 'react';

/**
 * Componente de card inspirado no design do native-land.ca
 * Mantém a identidade visual do projeto (verde) mas com estilo mais refinado
 * 
 * @param {string} layout - 'vertical' (padrão) ou 'horizontal' (formato nativo do native-land.ca)
 * @param {string} category - Categoria em uppercase (ex: "territories", "languages") - usado apenas no layout horizontal
 */
const NativeLandCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  type = 'text',
  className = '',
  iconColor = 'green', // 'green', 'teal', 'blue'
  showIconCircle = true, // Ícone em círculo colorido como no native-land.ca
  description = null, // Descrição adicional opcional abaixo do valor
  layout = 'vertical', // 'vertical' ou 'horizontal'
  category = null // Categoria para layout horizontal (ex: "territories")
}) => {
  // Se o valor for null, undefined ou string vazia, não renderizar o card
  // Exceções: números (incluindo 0), booleanos (false é válido), e elementos React
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  // Números, booleanos e elementos React são sempre válidos - continuar renderização

  const renderValue = () => {
    switch (type) {
      case 'number':
        // Números sempre completos, sem truncamento
        const numberValue = value || 0;
        return (
          <div className="text-center w-full flex items-center justify-center h-full min-w-0">
            <div 
              className="text-3xl font-semibold text-green-800 truncate" 
              style={{fontSize: '1.875rem', fontWeight: '600', color: '#166534', lineHeight: '1.2'}}
              title={String(numberValue)}
            >
              {numberValue.toLocaleString('pt-BR')}
            </div>
          </div>
        );
      case 'boolean':
        return value ? (
          <span className="flex items-center gap-1.5 text-green-700 text-sm font-semibold">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sim
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-gray-600 text-sm font-semibold">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Não
          </span>
        );
      default:
        // Se value é um elemento React (JSX), renderizar diretamente
        if (React.isValidElement(value)) {
          return value;
        }
        // Textos completos com quebra de linha - permite expansão
        const textValue = String(value || '');
        const isLongText = textValue.length > 30;
        return (
          <div className={`text-sm text-gray-800 ${isLongText ? 'text-left' : 'text-center'} w-full font-medium leading-relaxed break-words px-2`} style={{ lineHeight: '1.6' }}>
            {textValue}
          </div>
        );
    }
  };

  // Cores para o círculo do ícone - usando cores verdes harmoniosas do site
  const iconCircleColors = {
    green: { bg: '#D1FAE5', icon: '#166534' }, // Verde claro suave (green-100) com ícone verde escuro (green-800)
    teal: { bg: '#14B8A6', icon: '#FFFFFF' }, // Teal claro com ícone branco
    blue: { bg: '#3B82F6', icon: '#FFFFFF' }, // Azul com ícone branco
  };

  const colors = iconCircleColors[iconColor] || iconCircleColors.green;

  // Layout horizontal (formato nativo do native-land.ca)
  if (layout === 'horizontal') {
    return (
      <div 
        className={`
          rounded-xl p-4 
          overflow-visible
          card-container
          relative
          ${className}
        `}
        style={{ border: 'none', outline: 'none', backgroundColor: '#D1FAE5' }}
      >
        {/* Ícone FORA do card, no canto superior esquerdo */}
        {Icon && (
          <div 
            className="absolute -top-3 -left-3 z-10"
            style={{ 
              transform: 'translate(0, 0)'
            }}
          >
            {showIconCircle ? (
              <div 
                className="rounded-full p-2 flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.bg,
                  width: '40px',
                  height: '40px'
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: colors.icon }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-full p-2 border-2 border-gray-200">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center relative z-20">
          {/* Textos empilhados - agora com mais espaço já que o ícone está fora */}
          <div className="flex-1 min-w-0 relative z-20">
            {/* Categoria em uppercase e teal (se fornecido) */}
            {category && (
              <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1.5 break-words relative z-20" style={{ lineHeight: '1.5' }}>
                {category}
              </div>
            )}
            {/* Valor principal em cinza */}
            <h5 className={`font-medium leading-relaxed break-words relative z-20 ${category ? 'text-base text-gray-700' : 'text-sm text-gray-700'}`} style={{ lineHeight: '1.6' }}>
              {category ? (
                // Se tem category, mostra o value como valor principal (ex: "Panará")
                type === 'number' ? (
                  <span className="text-lg font-semibold text-gray-700">{value || '0'}</span>
                ) : type === 'boolean' ? (
                  renderValue()
                ) : React.isValidElement(value) ? value : (
                  <span className="break-words">{String(value || label)}</span>
                )
              ) : type === 'number' ? (
                <span className="text-lg font-semibold text-gray-700">{value || '0'}</span>
              ) : type === 'boolean' ? (
                renderValue()
              ) : React.isValidElement(value) ? value : (
                <span className="break-words">{String(value || label)}</span>
              )}
            </h5>
          </div>
        </div>
        
        {/* Descrição opcional */}
        {description && (
          <div className="text-xs text-gray-700 leading-relaxed mt-2 pt-2 border-t border-gray-200 whitespace-pre-line break-words relative z-20" style={{ lineHeight: '1.6' }}>
            {description}
          </div>
        )}
      </div>
    );
  }

  // Layout vertical (padrão)
  // Cards são flexíveis por padrão - altura mínima de 140px, mas podem expandir
  // Se className já especifica altura, usa ela; caso contrário, usa min-h para permitir expansão
  const hasCustomHeight = className.includes('h-[') || className.includes('h-auto') || className.includes('min-h-[');
  const cardHeightClass = hasCustomHeight 
    ? '' 
    : 'min-h-[140px]';
  
  // Determina se precisa de layout flexível para textos longos
  const isTextType = type === 'text' || (!type || type === 'default');
  const isStringValue = value && typeof value === 'string';
  const isLongText = isTextType && isStringValue && String(value).trim().length > 20;
  const needsFlexibleLayout = isLongText;

  return (
    <div 
      className={`
        rounded-xl p-4 
        ${cardHeightClass} flex flex-col
        overflow-visible
        card-container
        relative
        ${className}
      `}
      style={{ border: 'none', outline: 'none', backgroundColor: '#D1FAE5' }}
    >
      {/* Ícone FORA do card, no canto superior esquerdo */}
      {Icon && (
        <div 
          className="absolute -top-3 -left-3 z-10"
          style={{ 
            transform: 'translate(0, 0)'
          }}
        >
          {showIconCircle ? (
            <div 
              className="rounded-full p-2 flex items-center justify-center"
              style={{ 
                backgroundColor: colors.bg,
                width: '40px',
                height: '40px'
              }}
            >
              <Icon 
                className="w-5 h-5" 
                style={{ color: colors.icon }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-full p-2 border-2 border-gray-200">
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
          )}
        </div>
      )}

      {/* Conteúdo interno do card - flexível para permitir expansão */}
      <div className="flex flex-col relative z-20">
        {/* Título centralizado - aproveitando melhor o espaço */}
        <div className="flex items-center justify-center mb-2 flex-shrink-0 min-h-[32px] pt-1 relative z-20">
          <div className="text-xs text-gray-700 font-semibold leading-tight text-center uppercase tracking-wide break-words px-2 relative z-20" style={{ lineHeight: '1.5' }}>
            {label}
          </div>
        </div>
        
        {/* Conteúdo do valor - flexível para textos longos */}
        <div className={`${needsFlexibleLayout ? 'flex-grow flex items-start justify-center py-2' : 'flex-1 flex items-center justify-center'} relative z-20`}>
          {renderValue()}
        </div>
        
        {/* Descrição opcional */}
        {description && (
          <div className="text-xs text-gray-700 leading-relaxed mt-2 pt-2 border-t border-gray-200 break-words relative z-20" style={{ lineHeight: '1.6' }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
});

NativeLandCard.displayName = 'NativeLandCard';

export default NativeLandCard;

