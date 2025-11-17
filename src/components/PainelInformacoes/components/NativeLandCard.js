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
              className="text-3xl font-semibold text-gray-900 truncate" 
              style={{fontSize: '1.875rem', fontWeight: '600', color: '#111827', lineHeight: '1.2'}}
              title={String(numberValue)}
            >
              {numberValue.toLocaleString('pt-BR')}
            </div>
          </div>
        );
      case 'boolean':
        return value ? (
          <span className="flex items-center gap-1.5 text-gray-900 text-sm font-semibold">
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
        // Textos completos com quebra de linha - permite expansão e preserva quebras de linha
        // Trim trailing whitespace/newlines to avoid excessive spacing
        // Remove trailing newlines and whitespace from each line, then trim the whole string
        let textValue = String(value || '').trim();
        // Remove trailing newlines and spaces from the end
        textValue = textValue.replace(/\n\s*$/, '').replace(/\s+$/, '').trim();
        const isLongText = textValue.length > 30;
        const isShortText = textValue.length <= 30; // Consider text up to 30 chars as short for spacing purposes
        return (
          <div className={`text-sm text-gray-800 ${isLongText ? 'text-left' : 'text-center'} w-full font-medium leading-relaxed whitespace-pre-line break-words ${isShortText ? 'px-1 py-0' : 'px-2'}`} style={{ lineHeight: '1.6' }}>
            {textValue}
          </div>
        );
    }
  };

  // Cores para o círculo do ícone - usando cores neutras
  const iconCircleColors = {
    green: { bg: '#F3F4F6', icon: '#111827' }, // Cinza claro com ícone preto
    teal: { bg: '#F3F4F6', icon: '#111827' }, // Cinza claro com ícone preto
    blue: { bg: '#F3F4F6', icon: '#111827' }, // Cinza claro com ícone preto
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
          <div className="text-sm text-gray-700 leading-relaxed mt-2 pt-2 border-t border-gray-200 whitespace-pre-line break-words relative z-20" style={{ lineHeight: '1.6' }}>
            {description}
          </div>
        )}
      </div>
    );
  }

  // Layout vertical (padrão)
  // Cards são flexíveis por padrão - altura mínima reduzida para evitar espaçamento excessivo
  // Determina se precisa de layout flexível para textos longos
  const isTextType = type === 'text' || (!type || type === 'default');
  const isStringValue = value && typeof value === 'string';
  // Trim value consistently - remove trailing newlines and whitespace like in renderValue
  let trimmedValue = '';
  if (isStringValue) {
    trimmedValue = String(value).trim();
    // Remove trailing newlines and spaces from the end (same logic as renderValue)
    trimmedValue = trimmedValue.replace(/\n\s*$/, '').replace(/\s+$/, '').trim();
  }
  
  // Check if value is short - either short string or React element (like boolean status)
  // Text up to 30 characters is considered "short" for spacing purposes (single line or short multi-line)
  const isReactElement = React.isValidElement(value);
  const isShortValue = isTextType && isStringValue && trimmedValue.length <= 30;
  const isShortContent = isShortValue || (isReactElement && type !== 'number'); // React elements like boolean status are short
  
  // Only text longer than 30 characters needs flexible layout
  const isLongText = isTextType && isStringValue && trimmedValue.length > 30;
  const needsFlexibleLayout = isLongText;
  
  // Altura mínima reduzida para cards simples (sem descrição e sem texto longo)
  // Cards com descrição ou texto longo mantêm altura maior
  // Cards com texto curto (até 30 caracteres) não precisam de altura mínima - deixar crescer naturalmente
  const hasDescription = description && description.trim();
  const isShortText = isTextType && isStringValue && trimmedValue.length <= 30;
  
  // Remove min-h from className if content is short - override forced heights
  let cleanedClassName = className;
  if (isShortContent) {
    // Remove min-h-[XXX] patterns from className when content is short
    cleanedClassName = cleanedClassName.replace(/\bmin-h-\[[^\]]+\]/g, '').replace(/\bh-\[[^\]]+\]/g, '').trim();
  }
  
  const hasCustomHeight = cleanedClassName.includes('h-[') || cleanedClassName.includes('h-auto') || cleanedClassName.includes('min-h-[');
  const cardHeightClass = hasCustomHeight 
    ? '' 
    : (hasDescription && !isShortContent || needsFlexibleLayout) 
      ? 'min-h-[120px]' 
      : isShortText || isShortContent
        ? '' // Sem altura mínima para texto curto - deixa crescer naturalmente
        : 'min-h-[90px]';

  return (
    <div 
      className={`
        rounded-xl ${isShortContent ? 'p-2' : 'p-3'}
        ${cardHeightClass} flex flex-col
        overflow-visible
        card-container
        relative
        h-full
        ${cleanedClassName}
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
      {/* Quando conteúdo é curto, manter conteúdo no topo mas permitir que o card estique */}
      <div className={`flex flex-col relative z-20 ${isShortContent ? 'justify-start' : ''} h-full`}>
        {/* Título centralizado - aproveitando melhor o espaço */}
        <div className={`flex items-center justify-center flex-shrink-0 relative z-20 ${hasDescription && !isShortContent || needsFlexibleLayout ? 'mb-1' : isShortContent ? 'mb-0' : 'mb-0.5'}`}>
          <div className="text-xs text-gray-700 font-semibold leading-tight text-center uppercase tracking-wide break-words relative z-20" style={{ lineHeight: '1.3' }}>
            {label}
          </div>
        </div>
        
        {/* Conteúdo do valor - flexível para textos longos */}
        {/* Quando conteúdo é curto, manter centralizado verticalmente */}
        <div className={`${needsFlexibleLayout ? 'flex-grow flex items-start justify-center' : isShortContent ? 'flex items-center justify-center flex-shrink-0 w-full' : (hasDescription ? 'flex-1 flex items-center justify-center' : 'flex items-center justify-center')} relative z-20`}>
          {renderValue()}
        </div>
        
        {/* Descrição opcional */}
        {description && (
          <div className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words relative z-20 flex-shrink-0 ${isShortContent ? 'mt-0.5 pt-0.5' : 'mt-1 pt-1'}`} style={{ lineHeight: '1.5' }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
});

NativeLandCard.displayName = 'NativeLandCard';

export default NativeLandCard;

