import React, { useState, useEffect, useCallback } from 'react';
import OpenLayersMap from './OpenLayersMap';
import { useGeoJSONCache } from '../hooks/useGeoJSONCache';
import { MAP_CONFIG } from '../utils/mapConfig';
import { ResponsiveIcon } from '../hooks/useResponsiveIcon';
import { useBreakpoint } from '../hooks/responsive/useBreakpoint';
import logger from '../utils/logger';

const MapSelector = ({ 
  dataPoints, 
  onPainelOpen, 
  painelAberto = false,
  className = "h-screen w-full",
  isMainLoading = false
}) => {
  // Carregar dados GeoJSON
  const { data: terrasIndigenasData, loading: terrasLoading, error: terrasError } = useGeoJSONCache('terras_indigenas');
  const { data: estadoSPData, loading: estadoLoading, error: estadoError } = useGeoJSONCache('SP');

  // Estados para controlar visibilidade das camadas
  const [showTerrasIndigenas, setShowTerrasIndigenas] = useState(true);
  const [showEstadoSP, setShowEstadoSP] = useState(true);

  // Estado para controlar visibilidade dos marcadores
  const [showMarcadores, setShowMarcadores] = useState(true);

  // Estados para responsividade - usando hook centralizado
  const { isMobile } = useBreakpoint();
  const [isMinimized, setIsMinimized] = useState(false);

  // Handler para minimizar/expandir
  const handleMinimize = useCallback(() => setIsMinimized(prev => !prev), []);

  // Log de status das camadas (apenas em desenvolvimento)
  useEffect(() => {
    logger.debug('MapSelector: Status das camadas GeoJSON:', {
      terrasIndigenas: {
        loading: terrasLoading,
        error: terrasError,
        hasData: !!terrasIndigenasData,
        features: terrasIndigenasData?.features?.length || 0,
      },
      estadoSP: {
        loading: estadoLoading,
        error: estadoError,
        hasData: !!estadoSPData,
        features: estadoSPData?.features?.length || 0,
      }
    });
  }, [terrasIndigenasData, estadoSPData, terrasLoading, estadoLoading, terrasError, estadoError]);

  // Reativar marcadores quando painel fecha em mobile
  useEffect(() => {
    if (!painelAberto && isMobile) {
      logger.debug('MapSelector: Painel fechado em mobile, reativando marcadores');
      setShowMarcadores(true);
    }
  }, [painelAberto, isMobile]);

    // Componente para o cabeçalho do menu
  const CabecalhoMenu = ({ onMinimize, isMobile, isMinimized }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
        </svg>
        <h3 className="text-sm font-semibold tracking-wide">Camadas do Mapa</h3>
      </div>
      <button
        onClick={onMinimize}
        className="text-green-100 hover:text-white hover:bg-green-600 transition-all duration-200 p-1.5 rounded-md"
        aria-label={isMinimized ? "Expandir" : "Minimizar"}
        type="button"
      >
        <ResponsiveIcon 
          isMobile={isMobile} 
          isMinimized={isMinimized} 
          className="w-4 h-4" 
        />
      </button>
    </div>
  );

  // Componente para botão de camada
  const BotaoCamada = ({ id, label, checked, onChange, disabled = false, loading = false, error = false, total, color, subItems = null }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        checked 
          ? 'bg-green-50 shadow-sm' 
          : 'bg-white hover:bg-green-50/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Indicador de cor principal */}
      <div className="flex-shrink-0">
        {subItems ? (
          // Para Terras Indígenas com subcategorias
          <div className="flex flex-col gap-1.5">
            {subItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          // Para outras camadas
          <div 
            className={`w-4 h-4 rounded-full shadow-sm ${
              checked ? 'ring-2 ring-green-200' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            checked ? 'text-green-900' : 'text-gray-800'
          }`}>
            {label}
          </span>
          
          {total !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              checked 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {total}
            </span>
          )}
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-2 mt-1">
          {loading && !isMainLoading && (
            <div className="flex items-center gap-1 text-blue-600">
              <span className="text-xs">Carregando...</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-1 text-red-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Erro</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Indicador de estado */}
      <div className="flex-shrink-0">
        {subItems ? (
          // Indicador para Terras Indígenas
                  <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
          checked ? 'bg-green-600' : 'bg-gray-300'
        }`} />
      ) : (
        // Indicador para outras camadas
        <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
          checked ? 'bg-green-600' : 'bg-gray-300'
        }`} />
        )}
      </div>
    </button>
  );

  // Definir center/zoom iniciais conforme dispositivo
  const mapCenter = isMobile ? MAP_CONFIG.mobile.center : MAP_CONFIG.center;
  const mapZoom = isMobile ? MAP_CONFIG.mobile.zoom : MAP_CONFIG.zoom;

  logger.debug('MapSelector - Configuração do mapa:', {
    isMobile,
    zoom: mapZoom,
    center: mapCenter
  });

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Controles de camadas responsivos */}
      {isMobile ? (
        // Menu mobile - fixo na parte inferior
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="bg-white shadow-2xl rounded-t-2xl">
            <CabecalhoMenu
              onMinimize={handleMinimize}
              isMobile={true}
              isMinimized={isMinimized}
            />
            {!isMinimized && (
              <div className="p-4 flex flex-col gap-3 max-h-80 overflow-y-auto">
                <BotaoCamada
                  id="estado-sp"
                  label="Estado de São Paulo"
                  checked={showEstadoSP}
                  onChange={() => setShowEstadoSP(!showEstadoSP)}
                  loading={estadoLoading}
                  error={estadoError}
                  color="#10B981"
                />
                <BotaoCamada
                  id="marcadores"
                  label="Escolas Indígenas"
                  checked={showMarcadores}
                  onChange={() => setShowMarcadores(!showMarcadores)}
                  color="#3B82F6"
                />
                <BotaoCamada
                  id="terras-indigenas"
                  label="Terras Indígenas"
                  checked={showTerrasIndigenas}
                  onChange={() => setShowTerrasIndigenas(!showTerrasIndigenas)}
                  loading={terrasLoading}
                  error={terrasError}
                  subItems={[
                    { label: "Regularizadas", color: "#DC143C" },
                    { label: "Declaradas", color: "#8B0000" }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // Menu desktop - fixo no topo direito
        <div className="fixed top-24 right-4 w-72 bg-white rounded-2xl shadow-2xl z-20 overflow-hidden">
          <CabecalhoMenu
            onMinimize={handleMinimize}
            isMobile={false}
            isMinimized={isMinimized}
          />
          {!isMinimized && (
            <div className="p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
              <BotaoCamada
                id="estado-sp"
                label="Estado de São Paulo"
                checked={showEstadoSP}
                onChange={() => setShowEstadoSP(!showEstadoSP)}
                loading={estadoLoading}
                error={estadoError}
                color="#10B981"
              />
              <BotaoCamada
                id="marcadores"
                label="Escolas Indígenas"
                checked={showMarcadores}
                onChange={() => setShowMarcadores(!showMarcadores)}
                total={dataPoints?.length}
                color="#3B82F6"
              />
              <BotaoCamada
                id="terras-indigenas"
                label="Terras Indígenas"
                checked={showTerrasIndigenas}
                onChange={() => setShowTerrasIndigenas(!showTerrasIndigenas)}
                loading={terrasLoading}
                error={terrasError}
                subItems={[
                  { label: "Regularizadas", color: "#DC143C" },
                  { label: "Declaradas", color: "#8B0000" }
                ]}
              />
            </div>
          )}
        </div>
      )}

      {/* Mapa OpenLayers unificado */}
      <OpenLayersMap
        dataPoints={showMarcadores ? dataPoints : []}
        onPainelOpen={onPainelOpen}
        className="h-full w-full"
        center={mapCenter}
        zoom={mapZoom}
        // Props para camadas GeoJSON
        terrasIndigenasData={terrasIndigenasData}
        estadoSPData={estadoSPData}
        showTerrasIndigenas={showTerrasIndigenas}
        showEstadoSP={showEstadoSP}
        // Props para marcadores
        showMarcadores={showMarcadores}
      />
    </div>
  );
};

export default React.memo(MapSelector); 