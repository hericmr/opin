import React from 'react';

/**
 * Componente de barra de progresso geral de completude
 * 
 * @param {number} overallCompleteness - Porcentagem de completude geral
 * @param {Function} getCompletenessColor - Função para obter cor baseada na completude
 * @param {Function} getProgressBarColor - Função para obter cor da barra de progresso
 */
const OverallProgressBar = ({
  overallCompleteness,
  getCompletenessColor,
  getProgressBarColor
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-200">Progresso Geral</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompletenessColor(overallCompleteness)}`}>
          {overallCompleteness}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(overallCompleteness)}`}
          style={{ width: `${overallCompleteness}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OverallProgressBar;

