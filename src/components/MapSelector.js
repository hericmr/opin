import React, { useState, useEffect, useCallback } from 'react';
import OpenLayersMap from './OpenLayersMap';
import { useGeoJSONCache } from '../hooks/useGeoJSONCache';
import { MAP_CONFIG } from '../utils/mapConfig';

const MapSelector = ({ 
  dataPoints, 
  onPainelOpen, 
  painelAberto = false,
  className = "h-screen w-full"
}) => {
  // Carregar dados GeoJSON
  const { data: terrasIndigenasData, loading: terrasLoading, error: terrasError } = useGeoJSONCache('terras_indigenas');
  const { data: estadoSPData, loading: estadoLoading, error: estadoError } = useGeoJSONCache('SP');

  // Estados para controlar visibilidade das camadas
  const [showTerrasIndigenas, setShowTerrasIndigenas] = useState(true);
  const [showEstadoSP, setShowEstadoSP] = useState(true);

  // Estado para controlar visibilidade dos marcadores
  const [showMarcadores, setShowMarcadores] = useState(true);

  // Estados para responsividade
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

  // Handler para minimizar/expandir
  const handleMinimize = useCallback(() => setIsMinimized(prev => !prev), []);

  // Log de status das camadas
  useEffect(() => {
    console.log('MapSelector: Status das camadas GeoJSON:', {
      terrasIndigenas: {
        loading: terrasLoading,
        error: terrasError,
        hasData: !!terrasIndigenasData,
        features: terrasIndigenasData?.features?.length || 0,
        type: terrasIndigenasData?.type,
        firstFeature: terrasIndigenasData?.features?.[0] ? {
          type: terrasIndigenasData.features[0].type,
          properties: terrasIndigenasData.features[0].properties ? Object.keys(terrasIndigenasData.features[0].properties) : 'Sem propriedades'
        } : 'Nenhum feature'
      },
      estadoSP: {
        loading: estadoLoading,
        error: estadoError,
        hasData: !!estadoSPData,
        features: estadoSPData?.features?.length || 0,
        type: estadoSPData?.type,
        firstFeature: estadoSPData?.features?.[0] ? {
          type: estadoSPData.features[0].type,
          properties: estadoSPData.features[0].properties ? Object.keys(estadoSPData.features[0].properties) : 'Sem propriedades'
        } : 'Nenhum feature'
      }
    });
  }, [terrasIndigenasData, estadoSPData, terrasLoading, estadoLoading, terrasError, estadoError]);

  useEffect(() => {
    if (!painelAberto && isMobile) {
      console.log('MapSelector: Painel fechado em mobile, reativando marcadores');
      setShowMarcadores(true);
    }
  }, [painelAberto, isMobile]);

  // Componente para o cabeçalho do menu
  const CabecalhoMenu = ({ onMinimize, isMobile, isMinimized }) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white">
      <h3 className="text-sm font-medium text-gray-800">Camadas do Mapa</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          aria-label={isMinimized ? "Expandir" : "Minimizar"}
          type="button"
        >
          {isMinimized ? "▾" : "▴"}
        </button>
      </div>
    </div>
  );

  // Componente para botão de camada
  const BotaoCamada = ({ id, label, checked, onChange, disabled = false, loading = false, error = false, total, color, subItems = null }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        checked ? 'bg-gray-50' : 'hover:bg-gray-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {subItems ? (
        // Para Terras Indígenas com subcategorias
        <div className="flex flex-col gap-1">
          {subItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        // Para outras camadas
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: color }}
        />
      )}
      
      <span className="text-sm text-gray-800">{label}</span>
      
      {total !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({total})</span>
      )}
      
      {loading && <span className="text-blue-500 ml-1">(carregando...)</span>}
      {error && <span className="text-red-500 ml-1">(erro)</span>}
      
      {subItems ? (
        // Indicador para Terras Indígenas
        <div className="ml-auto w-2 h-2 rounded-full bg-gray-300" />
      ) : (
        // Indicador para outras camadas
        <div 
          className="ml-auto w-2 h-2 rounded-full" 
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  );

  // Definir center/zoom iniciais conforme dispositivo
  const mapCenter = isMobile ? MAP_CONFIG.mobile.center : MAP_CONFIG.center;
  const mapZoom = isMobile ? MAP_CONFIG.mobile.zoom : MAP_CONFIG.zoom;

  // Log para debug do zoom
  console.log('MapSelector - Debug zoom:', {
    isMobile,
    mobileZoom: MAP_CONFIG.mobile.zoom,
    desktopZoom: MAP_CONFIG.zoom,
    selectedZoom: mapZoom,
    mobileCenter: MAP_CONFIG.mobile.center,
    desktopCenter: MAP_CONFIG.center,
    selectedCenter: mapCenter
  });

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Controles de camadas responsivos */}
      {isMobile ? (
        // Menu mobile - fixo na parte inferior
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="bg-white border-t border-gray-100 shadow-lg">
            <CabecalhoMenu
              onMinimize={handleMinimize}
              isMobile={true}
              isMinimized={isMinimized}
            />
            {!isMinimized && (
              <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
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
        </div>
      ) : (
        // Menu desktop - fixo no topo direito
        <div className="fixed top-24 right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <CabecalhoMenu
            onMinimize={handleMinimize}
            isMobile={false}
            isMinimized={isMinimized}
          />
          {!isMinimized && (
            <div className="p-2 flex flex-col gap-1 max-h-96 overflow-y-auto">
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

export default MapSelector; 