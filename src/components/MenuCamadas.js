import React, { useState, useEffect, memo, useCallback } from "react";
import PropTypes from 'prop-types';

const CAMADAS = {
  ESTADO_SP: { id: 'estadoSP', label: 'Estado de São Paulo', cor: '#10B981' },
  ESCOLAS: { id: 'educacao', label: 'Escolas Indígenas', cor: '#3B82F6' },
  TERRAS_INDIGENAS: { 
    id: 'terrasIndigenas', 
    label: 'Terras Indígenas', 
    cor: '#DC143C',
    corSecundaria: '#8B0000',
    labelSecundaria: 'Declaradas'
  }
};

const CabecalhoMenu = memo(({ onMinimize, isMobile, isMinimized }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg">
    <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Camadas do Mapa</h3>
    <div className="flex items-center gap-2">
      <button
        onClick={onMinimize}
        className="text-white hover:text-green-200 transition-colors p-1 rounded-md hover:bg-green-600"
        aria-label={isMinimized ? "Expandir" : "Minimizar"}
        type="button"
      >
        {isMinimized ? "▾" : "▴"}
      </button>
    </div>
  </div>
));

CabecalhoMenu.displayName = 'CabecalhoMenu';

const BotaoCamada = memo(({ camada, ativo, onClick, total }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      ativo 
        ? 'bg-green-100 border border-green-300 shadow-sm' 
        : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
    }`}
    type="button"
  >
    {camada.id === 'terrasIndigenas' ? (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: camada.cor }} />
          <span className="text-xs font-medium text-gray-700">Regularizadas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: camada.corSecundaria }} />
          <span className="text-xs font-medium text-gray-700">{camada.labelSecundaria}</span>
        </div>
      </div>
    ) : (
      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: camada.cor }} />
    )}
    <span className="text-sm font-medium text-gray-800 flex-1 text-left">{camada.label}</span>
    {total !== undefined && (
      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">({total})</span>
    )}
    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: ativo ? camada.cor : '#e5e7eb' }} />
  </button>
));

BotaoCamada.displayName = 'BotaoCamada';

const MenuCamadas = ({ estados, acoes, totalEscolas }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Função para verificar se é mobile
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    // Verifica no carregamento inicial
    checkMobile();
    
    // Adiciona listener de resize
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [checkMobile]);

  // Handlers para ações do menu
  const handleMenuClose = useCallback(() => setMenuAberto(false), []);
  const handleMenuOpen = useCallback(() => setMenuAberto(true), []);
  const handleMinimize = useCallback(() => setIsMinimized(prev => !prev), []);

  // Renderização para mobile
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="bg-white border-t-2 border-green-600 shadow-2xl rounded-t-xl">
          <CabecalhoMenu
            onMinimize={handleMinimize}
            isMobile={true}
            isMinimized={isMinimized}
          />
          {!isMinimized && (
            <div className="p-4 flex flex-col gap-2 max-h-60 overflow-y-auto">
              <BotaoCamada 
                camada={CAMADAS.ESTADO_SP} 
                ativo={estados.estadoSP} 
                onClick={acoes.toggleEstadoSP} 
              />
              <BotaoCamada 
                camada={CAMADAS.ESCOLAS} 
                ativo={estados.educacao} 
                onClick={acoes.toggleEducacao} 
                total={totalEscolas} 
              />
              <BotaoCamada 
                camada={CAMADAS.TERRAS_INDIGENAS} 
                ativo={estados.terrasIndigenas} 
                onClick={acoes.toggleTerrasIndigenas} 
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Menu desktop fixo no topo direito
  return (
    <div className="fixed top-24 right-4 w-72 bg-white border-2 border-green-600 rounded-xl shadow-2xl z-20 overflow-hidden">
      <CabecalhoMenu 
        onMinimize={handleMinimize}
        isMobile={false}
        isMinimized={isMinimized}
      />
      {!isMinimized && (
        <div className="p-4 flex flex-col gap-2 max-h-96 overflow-y-auto">
          <BotaoCamada 
            camada={CAMADAS.ESTADO_SP} 
            ativo={estados.estadoSP} 
            onClick={acoes.toggleEstadoSP} 
          />
          <BotaoCamada 
            camada={CAMADAS.ESCOLAS} 
            ativo={estados.educacao} 
            onClick={acoes.toggleEducacao} 
            total={totalEscolas} 
          />
          <BotaoCamada 
            camada={CAMADAS.TERRAS_INDIGENAS} 
            ativo={estados.terrasIndigenas} 
            onClick={acoes.toggleTerrasIndigenas} 
          />
        </div>
      )}
    </div>
  );
};

MenuCamadas.propTypes = {
  estados: PropTypes.shape({
    estadoSP: PropTypes.bool.isRequired,
    educacao: PropTypes.bool.isRequired,
    terrasIndigenas: PropTypes.bool.isRequired
  }).isRequired,
  acoes: PropTypes.shape({
    toggleEstadoSP: PropTypes.func.isRequired,
    toggleEducacao: PropTypes.func.isRequired,
    toggleTerrasIndigenas: PropTypes.func.isRequired
  }).isRequired,
  totalEscolas: PropTypes.number
};

MenuCamadas.displayName = 'MenuCamadas';

export default memo(MenuCamadas);