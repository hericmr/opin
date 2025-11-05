import React, { useState, useRef, useEffect } from 'react';

/**
 * Componente para texto truncado com tooltip
 * 
 * @param {string} text - Texto a ser exibido
 * @param {number} maxLines - Número máximo de linhas (padrão: 1)
 * @param {string} className - Classes CSS adicionais
 * @param {boolean} showTooltip - Se deve mostrar tooltip quando truncado (padrão: true)
 * @param {string} truncateMode - 'ellipsis' (1 linha) ou 'multiline' (múltiplas linhas)
 */
const TruncatedText = ({ 
  text, 
  maxLines = 1, 
  className = '', 
  showTooltip = true,
  truncateMode = 'ellipsis',
  children 
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const textRef = useRef(null);

  // Verificar se o texto está truncado
  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      // Usar requestAnimationFrame para garantir que o layout foi calculado
      requestAnimationFrame(() => {
        const isOverflowing = truncateMode === 'ellipsis' 
          ? element.scrollWidth > element.clientWidth + 1 // +1 para tolerância
          : element.scrollHeight > element.clientHeight + 1;
        setIsTruncated(isOverflowing);
      });
    }
  }, [text, maxLines, truncateMode, children]);

  const content = children || text;
  if (!content) return null;

  // Usar classes Tailwind quando disponíveis, fallback para CSS customizado
  const truncateClasses = truncateMode === 'ellipsis'
    ? 'truncate'
    : maxLines === 1 
      ? 'line-clamp-1'
      : maxLines === 2
        ? 'line-clamp-2'
        : maxLines === 3
          ? 'line-clamp-3'
          : `line-clamp-${maxLines}`;

  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative w-full">
      <div
        ref={textRef}
        className={`
          ${truncateClasses}
          ${className}
          ${showTooltip && isTruncated ? 'cursor-help' : ''}
        `}
        onMouseEnter={() => showTooltip && isTruncated && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        onFocus={() => showTooltip && isTruncated && setShowTooltipState(true)}
        onBlur={() => setShowTooltipState(false)}
        aria-label={showTooltip && isTruncated ? String(content) : undefined}
        role={showTooltip && isTruncated ? 'tooltip' : undefined}
      >
        {content}
      </div>

      {/* Tooltip */}
      {showTooltip && isTruncated && showTooltipState && (
        <div
          className="
            absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl
            bottom-full left-1/2 transform -translate-x-1/2 mb-2
            max-w-xs break-words
            pointer-events-none
          "
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'normal'
          }}
        >
          {content}
          {/* Seta do tooltip */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default TruncatedText;

