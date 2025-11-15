import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Info, Globe } from 'lucide-react';
import { CARD_VISIBILITY_CONFIG, getDefaultVisibility } from '../constants/cardVisibilityConfig';
import { GlobalConfigService } from '../../../services/globalConfigService';

const CardVisibilityTab = ({ editingLocation, onUpdate }) => {
  const [globalVisibility, setGlobalVisibility] = useState(null);
  const [visibility, setVisibility] = useState(() => {
    // Inicializar com valores da escola ou padrões
    const escolaVisibility = editingLocation?.cards_visibilidade || {};
    const defaults = getDefaultVisibility();
    return { ...defaults, ...escolaVisibility };
  });

  useEffect(() => {
    // Carregar configuração global
    const loadGlobalConfig = async () => {
      const globalConfig = await GlobalConfigService.getGlobalCardsVisibility();
      setGlobalVisibility(globalConfig);
    };
    loadGlobalConfig();
  }, []);

  useEffect(() => {
    // Atualizar quando editingLocation mudar
    if (editingLocation?.cards_visibilidade) {
      const defaults = getDefaultVisibility();
      setVisibility({ ...defaults, ...editingLocation.cards_visibilidade });
    } else if (editingLocation) {
      // Se não tem configuração individual, usar global ou padrões
      if (globalVisibility) {
        setVisibility({ ...globalVisibility });
      } else {
        const defaults = getDefaultVisibility();
        setVisibility(defaults);
      }
    }
  }, [editingLocation, globalVisibility]);

  const handleToggle = (cardId) => {
    const newVisibility = {
      ...visibility,
      [cardId]: !visibility[cardId]
    };
    setVisibility(newVisibility);
    
    // Notificar componente pai sobre mudança
    if (onUpdate) {
      onUpdate({ cards_visibilidade: newVisibility });
    }
  };

  const gridCards = CARD_VISIBILITY_CONFIG.filter(card => card.category === 'grid');
  const standaloneCards = CARD_VISIBILITY_CONFIG.filter(card => card.category === 'standalone');

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-semibold mb-1">Controle Individual de Visibilidade de Cards</p>
            <p className="text-blue-300">
              Configure a visibilidade dos cards especificamente para esta escola. 
              Esta configuração sobrescreve a configuração global. 
              As alterações serão salvas junto com os outros dados da escola.
            </p>
          </div>
        </div>
      </div>

      {globalVisibility && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-semibold mb-1">Configuração Global Ativa</p>
              <p className="text-yellow-300">
                Existe uma configuração global de visibilidade. Os cards que você configurar aqui 
                sobrescreverão a configuração global para esta escola específica.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cards do Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Cards do Grid Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gridCards.map((card) => (
            <CardToggle
              key={card.id}
              card={card}
              isVisible={visibility[card.id]}
              onToggle={() => handleToggle(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Cards Standalone */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Seções Adicionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standaloneCards.map((card) => (
            <CardToggle
              key={card.id}
              card={card}
              isVisible={visibility[card.id]}
              onToggle={() => handleToggle(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CardToggle = ({ card, isVisible, onToggle }) => {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all cursor-pointer
        ${isVisible 
          ? 'bg-green-900/20 border-green-600/50 hover:border-green-500/70' 
          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/70 opacity-60'
        }
      `}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isVisible ? (
              <Eye className="w-5 h-5 text-green-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500" />
            )}
            <h4 className="font-semibold text-gray-200">{card.label}</h4>
          </div>
          <p className="text-sm text-gray-400">{card.description}</p>
        </div>
        <div className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${isVisible 
            ? 'bg-green-600/30 text-green-300' 
            : 'bg-gray-700/50 text-gray-500'
          }
        `}>
          {isVisible ? 'Visível' : 'Oculto'}
        </div>
      </div>
    </div>
  );
};

export default CardVisibilityTab;

