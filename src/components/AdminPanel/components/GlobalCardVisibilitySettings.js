import React, { useState, useEffect } from 'react';
import { Info, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { CARD_VISIBILITY_CONFIG, getDefaultVisibility } from '../constants/cardVisibilityConfig';
import { GlobalConfigService } from '../../../services/globalConfigService';
import logger from '../../../utils/logger';

const GlobalCardVisibilitySettings = () => {
  const [visibility, setVisibility] = useState(getDefaultVisibility());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    loadGlobalConfig();
  }, []);

  const loadGlobalConfig = async () => {
    try {
      setLoading(true);
      const globalConfig = await GlobalConfigService.getGlobalCardsVisibility();
      
      if (globalConfig) {
        const defaults = getDefaultVisibility();
        setVisibility({ ...defaults, ...globalConfig });
      } else {
        setVisibility(getDefaultVisibility());
      }
    } catch (error) {
      logger.error('Erro ao carregar configuração global:', error);
      setVisibility(getDefaultVisibility());
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (cardId) => {
    setVisibility(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
    setSaveStatus(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);
      
      const result = await GlobalConfigService.saveGlobalCardsVisibility(visibility);
      
      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Configuração salva!' });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Erro ao salvar' });
      }
    } catch (error) {
      logger.error('Erro ao salvar configuração global:', error);
      setSaveStatus({ type: 'error', message: 'Erro ao salvar configuração' });
    } finally {
      setSaving(false);
    }
  };

  const gridCards = CARD_VISIBILITY_CONFIG.filter(card => card.category === 'grid');
  const standaloneCards = CARD_VISIBILITY_CONFIG.filter(card => card.category === 'standalone');

  if (loading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-6">
        <div className="text-center py-8">
          <div className="text-gray-400">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-6">
      {/* Topo da página */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-200">
              Visibilidade Global de Cards
            </h3>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
                aria-label="Informações"
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-6 w-80 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-50">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong className="text-gray-200">Configuração Global:</strong> Define o padrão para todas as escolas.
                  </p>
                  <p className="text-sm text-gray-300 mb-2">
                    <strong className="text-gray-200">Configuração Individual:</strong> Cada escola pode ter suas próprias configurações que sobrescrevem a global.
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong className="text-gray-200">Prioridade:</strong> Individual → Global → Padrão (todos visíveis)
                  </p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Define os cards visíveis por padrão em todas as escolas.
        </p>

        {saveStatus && (
          <div className={`mt-4 p-3 rounded-lg border flex items-center gap-2 ${
            saveStatus.type === 'success'
              ? 'bg-green-900/50 border-green-700/50 text-green-200'
              : 'bg-red-900/50 border-red-700/50 text-red-200'
          }`}>
            {saveStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{saveStatus.message}</span>
          </div>
        )}
      </div>

      {/* Seções em duas colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cards do Grid */}
        <div>
          <div className="border-b border-gray-700/50 pb-2 mb-4">
            <h4 className="text-base font-medium text-gray-300">Grid Principal</h4>
          </div>
          <div className="space-y-3">
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
          <div className="border-b border-gray-700/50 pb-2 mb-4">
            <h4 className="text-base font-medium text-gray-300">Seções Adicionais</h4>
          </div>
          <div className="space-y-3">
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
    </div>
  );
};

const CardToggle = ({ card, isVisible, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-200">{card.label}</h4>
      </div>
      <button
        onClick={onToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${isVisible 
            ? 'bg-green-600' 
            : 'bg-gray-600'
          }
        `}
        role="switch"
        aria-checked={isVisible}
        aria-label={`${isVisible ? 'Ocultar' : 'Mostrar'} ${card.label}`}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${isVisible ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default GlobalCardVisibilitySettings;

