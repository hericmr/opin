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
  const renderValue = () => {
    switch (type) {
      case 'number':
        // Números sempre completos, sem truncamento
        const numberValue = value || 0;
        return (
          <div className="text-center w-full flex items-center justify-center h-full min-w-0">
            <div 
              className="text-3xl font-medium text-green-800 truncate" 
              style={{fontSize: '1.875rem', fontWeight: '500', color: '#166534'}}
              title={String(numberValue)}
            >
              {numberValue.toLocaleString('pt-BR')}
            </div>
          </div>
        );
      case 'boolean':
        return value ? (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sim
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
        // Textos completos com quebra de linha
        const textValue = String(value || '');
        return (
          <div className="text-sm text-gray-800 text-center w-full font-medium leading-relaxed break-words px-2">
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
          relative isolate
          ${className}
        `}
        style={{ border: 'none', outline: 'none', backgroundColor: colors.bg }}
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
          <div className="flex-1 min-w-0">
            {/* Categoria em uppercase e teal (se fornecido) */}
            {category && (
              <div className="text-xs font-semibold text-teal-500 uppercase tracking-wide mb-1 break-words">
                {category}
              </div>
            )}
            {/* Valor principal em cinza */}
            <h5 className={`font-medium leading-tight break-words ${category ? 'text-base text-gray-500' : 'text-sm text-gray-600'}`}>
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
          <div className="text-xs text-gray-600 leading-relaxed mt-2 pt-2 border-t border-gray-200 whitespace-pre-line break-words">
            {description}
          </div>
        )}
      </div>
    );
  }

  // Layout vertical (padrão)
  return (
    <div 
      className={`
        rounded-xl p-4 
        h-[140px] flex flex-col
        overflow-visible
        card-container
        relative isolate
        ${className}
      `}
      style={{ border: 'none', outline: 'none', backgroundColor: colors.bg }}
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

      {/* Conteúdo interno do card - com overflow hidden para não vazar */}
      <div className="flex flex-col h-full overflow-hidden relative z-20">
        {/* Título centralizado - aproveitando melhor o espaço */}
        <div className="flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0 min-h-[32px] pt-1">
          <div 
            className="text-xs text-gray-600 font-semibold leading-tight text-center uppercase tracking-wide break-words px-2"
          >
            {label}
          </div>
        </div>
        
        {/* Conteúdo do valor */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {renderValue()}
        </div>
        
        {/* Descrição opcional */}
        {description && (
          <div className="text-xs text-gray-600 leading-relaxed mt-2 pt-2 border-t border-gray-200 break-words overflow-hidden">
            {description}
          </div>
        )}
      </div>
    </div>
  );
});

NativeLandCard.displayName = 'NativeLandCard';

export default NativeLandCard;

