import React, { useState, useEffect, memo } from "react";
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

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

const CabecalhoMenu = memo(({ onClose, onMinimize, isMobile, isMinimized }) => (
  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 cursor-move bg-white">
    <h3 className="text-sm font-medium text-gray-800">Camadas do Mapa</h3>
    <div className="flex items-center gap-2">
      {/* ➕ Agora permite minimizar também no mobile, se quiser */}
      <button
        onClick={onMinimize}
        className="text-gray-500 hover:text-gray-700"
        aria-label={isMinimized ? "Expandir" : "Minimizar"}
      >
        {isMinimized ? "▾" : "▴"}
      </button>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  </div>
));

const BotaoCamada = memo(({ camada, ativo, onClick, total }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition ${
      ativo ? 'bg-gray-50' : 'hover:bg-gray-50'
    }`}
  >
    {camada.id === 'terrasIndigenas' ? (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: camada.cor }} />
          <span className="text-xs text-gray-600">Regularizadas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: camada.corSecundaria }} />
          <span className="text-xs text-gray-600">{camada.labelSecundaria}</span>
        </div>
      </div>
    ) : (
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: camada.cor }} />
    )}
    <span className="text-sm text-gray-800">{camada.label}</span>
    {total !== undefined && (
      <span className="text-xs text-gray-500 ml-1">({total})</span>
    )}
    <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: ativo ? camada.cor : '#e5e7eb' }} />
  </button>
));

const MenuCamadas = ({ estados, acoes, totalEscolas }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 170 });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Se mudar para mobile, ajusta a posição
      if (mobile) {
        setPosition({ x: 24, y: 120 });
      }
    };
    window.addEventListener("resize", checkMobile);
    checkMobile(); // Verifica no carregamento inicial
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🔸 Menu Mobile sempre aparece fixo no rodapé
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100]">
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <CabecalhoMenu
            onClose={() => setMenuAberto(false)}
            onMinimize={() => setIsMinimized(!isMinimized)}
            isMobile={true}
            isMinimized={isMinimized}
          />
          {!isMinimized && (
            <div className="p-2 flex flex-col gap-1">
              <BotaoCamada camada={CAMADAS.ESTADO_SP} ativo={estados.estadoSP} onClick={acoes.toggleEstadoSP} />
              <BotaoCamada camada={CAMADAS.ESCOLAS} ativo={estados.educacao} onClick={acoes.toggleEducacao} total={totalEscolas} />
              <BotaoCamada camada={CAMADAS.TERRAS_INDIGENAS} ativo={estados.terrasIndigenas} onClick={acoes.toggleTerrasIndigenas} />
            </div>
          )}
        </div>

        {/* Botão de abrir menu no mobile, caso feche */}
        {!menuAberto && (
          <button
            onClick={() => setMenuAberto(true)}
            className="fixed bottom-4 right-4 bg-white border border-gray-200 shadow-md p-2 rounded-full z-50"
          >
            ☰
          </button>
        )}
      </div>
    );
  }

  // 🔸 Se menu fechado no desktop, mostra botão flutuante
  if (!menuAberto) {
    return (
      <button
        onClick={() => setMenuAberto(true)}
        className="fixed bottom-4 right-4 bg-white border border-gray-200 shadow-md p-2 rounded-full z-50"
      >
        ☰
      </button>
    );
  }

  // 🔸 Menu Desktop
  return (
    <Draggable
      handle=".cursor-move"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div className="fixed w-64 bg-white border border-gray-100 rounded-lg shadow-lg z-[100]">
        <CabecalhoMenu 
          onClose={() => setMenuAberto(false)}
          onMinimize={() => setIsMinimized(!isMinimized)}
          isMobile={false}
          isMinimized={isMinimized}
        />
        {!isMinimized && (
          <div className="p-2 flex flex-col gap-1">
            <BotaoCamada camada={CAMADAS.ESTADO_SP} ativo={estados.estadoSP} onClick={acoes.toggleEstadoSP} />
            <BotaoCamada camada={CAMADAS.ESCOLAS} ativo={estados.educacao} onClick={acoes.toggleEducacao} total={totalEscolas} />
            <BotaoCamada camada={CAMADAS.TERRAS_INDIGENAS} ativo={estados.terrasIndigenas} onClick={acoes.toggleTerrasIndigenas} />
          </div>
        )}
      </div>
    </Draggable>
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

export default memo(MenuCamadas);
