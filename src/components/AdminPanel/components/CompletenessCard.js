import React, { memo } from 'react';

/**
 * Componente de card de categoria de completude
 * Otimizado com React.memo para evitar re-renders desnecessários em listas
 * 
 * @param {string} category - Nome da categoria
 * @param {number} percentage - Porcentagem de completude
 * @param {number} fieldCount - Número de campos na categoria
 * @param {Function} onClick - Função chamada ao clicar no card
 * @param {Function} getCompletenessColor - Função para obter cor baseada na completude
 * @param {Function} getCompletenessIcon - Função para obter ícone baseada na completude
 * @param {Function} getSimpleProgressBarColor - Função para obter cor da barra de progresso
 */
const CompletenessCard = memo(({
  category,
  percentage,
  fieldCount,
  onClick,
  getCompletenessColor,
  getCompletenessIcon,
  getSimpleProgressBarColor
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:bg-gray-800/70 hover:border-gray-600/50 cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-200">{category}</h4>
        <span className="text-2xl">{getCompletenessIcon(percentage)}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Completude</span>
          <span className={`text-sm font-medium ${getCompletenessColor(percentage)}`}>
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getSimpleProgressBarColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        <p>{fieldCount} campos nesta categoria</p>
        <p className="text-gray-500 group-hover:text-gray-400 transition-colors">
          Clique para ver escolas sem informação
        </p>
      </div>
    </div>
  );
});

CompletenessCard.displayName = 'CompletenessCard';

export default CompletenessCard;

