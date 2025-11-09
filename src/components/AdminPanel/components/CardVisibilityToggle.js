import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { isCardVisible } from '../constants/cardVisibilityConfig';
import { useGlobalCardVisibility } from '../../../hooks/useGlobalCardVisibility';

/**
 * Componente toggle para controlar visibilidade de um card específico
 * @param {string} cardId - ID do card (ex: 'basicInfo', 'modalidades')
 * @param {Object} editingLocation - Estado da edição da escola
 * @param {Function} setEditingLocation - Função para atualizar o estado
 * @param {string} label - Label opcional (se não fornecido, usa o nome do card)
 */
const CardVisibilityToggle = ({ cardId, editingLocation, setEditingLocation, label }) => {
  const { globalVisibility } = useGlobalCardVisibility();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Obter visibilidade atual (individual ou global)
  const cardsVisibilidade = editingLocation?.cards_visibilidade || {};
  const isVisible = isCardVisible(cardsVisibilidade, cardId, globalVisibility);
  
  // Verificar se tem configuração individual ou está usando global
  const hasIndividualConfig = cardsVisibilidade && cardsVisibilidade.hasOwnProperty(cardId);
  const usingGlobal = !hasIndividualConfig && globalVisibility;
  
  const handleToggle = () => {
    // Obter configuração atual ou criar nova
    const currentVisibility = editingLocation?.cards_visibilidade || {};
    
    // Se está usando global e quer desabilitar, criar configuração individual
    // Se está usando global e quer habilitar, não precisa criar (já está habilitado)
    // Se tem configuração individual, apenas alternar
    const newVisibility = { ...currentVisibility };
    
    if (usingGlobal && isVisible) {
      // Está usando global e está visível, ao desabilitar cria individual como false
      newVisibility[cardId] = false;
    } else if (usingGlobal && !isVisible) {
      // Está usando global e está oculto, ao habilitar cria individual como true
      newVisibility[cardId] = true;
    } else {
      // Tem configuração individual, apenas alternar
      newVisibility[cardId] = !isVisible;
    }
    
    setEditingLocation({
      ...editingLocation,
      cards_visibilidade: newVisibility
    });
  };

  // Extrair apenas o nome do card do label (remover "Visibilidade do Card: ")
  const cardName = label?.replace('Visibilidade do Card: ', '') || 'Card';

  return (
    <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-medium text-gray-200">
            {cardName}
          </span>
          {usingGlobal && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-500 hover:text-gray-400 transition-colors"
                aria-label="Usando configuração global"
              >
                <Info className="w-3 h-3" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-5 w-64 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl z-50">
                  <p className="text-xs text-gray-300">
                    Usando configuração global. Alterar aqui criará uma configuração individual para esta escola.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isVisible 
              ? 'bg-green-600' 
              : 'bg-gray-600'
            }
          `}
          role="switch"
          aria-checked={isVisible}
          aria-label={`${isVisible ? 'Ocultar' : 'Mostrar'} ${cardName}`}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isVisible ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
};

export default CardVisibilityToggle;
