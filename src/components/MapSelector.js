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

  // Controle global de tamanho do texto (mover do Navbar para o menu de camadas)
  const [textScale, setTextScale] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('opin:textScale') : null;
    return stored ? parseFloat(stored) : 1;
  });

  useEffect(() => {
    const clamped = Math.min(1.3, Math.max(0.9, textScale));
    if (clamped !== textScale) {
      setTextScale(clamped);
      return;
    }
    const base = 16;
    document.documentElement.style.fontSize = `${base * clamped}px`;
    try {
      localStorage.setItem('opin:textScale', String(clamped));
    } catch {}
  }, [textScale]);

  const decreaseText = () => setTextScale((v) => Math.max(0.9, Math.round((v - 0.1) * 10) / 10));
  const increaseText = () => setTextScale((v) => Math.min(1.3, Math.round((v + 0.1) * 10) / 10));

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
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-900/80 to-green-800/80 text-white">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
        </svg>
        <h3 className="text-sm font-semibold tracking-wide">Camadas do Mapa</h3>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="text-white hover:bg-white/10 transition-all duration-200 p-1.5 rounded-md"
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
    </div>
  );

  // Componente para botão de camada
  const BotaoCamada = ({ id, label, checked, onChange, disabled = false, loading = false, error = false }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
        checked 
          ? 'bg-white/10' 
          : 'bg-white/5 hover:bg-white/10'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            checked ? 'text-white' : 'text-white/90'
          }`}>
            {label}
          </span>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-2 mt-1">
          {loading && !isMainLoading && (
            <div className="flex items-center gap-1 text-white/80">
              <span className="text-xs">Carregando...</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-1 text-red-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Erro</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Switch estilo Native Land */}
      <div className="flex-shrink-0 ml-2" role="switch" aria-checked={checked} aria-label={label}>
        <div className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ${checked ? 'bg-green-500/70' : 'bg-gray-300'}`}>
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`}></span>
        </div>
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
          <div className="bg-green-900/30 backdrop-blur-md shadow-2xl rounded-t-2xl text-white">
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
                />
                <BotaoCamada
                  id="marcadores"
                  label="Escolas Indígenas"
                  checked={showMarcadores}
                  onChange={() => setShowMarcadores(!showMarcadores)}
                
                />
                <BotaoCamada
                  id="terras-indigenas"
                  label="Terras Indígenas"
                  checked={showTerrasIndigenas}
                  onChange={() => setShowTerrasIndigenas(!showTerrasIndigenas)}
                  loading={terrasLoading}
                  error={terrasError}
                
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // Menu desktop - fixo no topo esquerdo
        <div className="fixed top-16 left-4 w-72 bg-green-900/30 backdrop-blur-md rounded-2xl shadow-2xl z-20 overflow-hidden text-white">
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
              />
              <BotaoCamada
                id="marcadores"
                label="Escolas Indígenas"
                checked={showMarcadores}
                onChange={() => setShowMarcadores(!showMarcadores)}
                
              />
              <BotaoCamada
                id="terras-indigenas"
                label="Terras Indígenas"
                checked={showTerrasIndigenas}
                onChange={() => setShowTerrasIndigenas(!showTerrasIndigenas)}
                loading={terrasLoading}
                error={terrasError}
                
              />
            </div>
          )}
        </div>
      )}

      {/* Botão flutuante de tamanho do texto (fora do menu, estilo Native Land) */}
      {isMobile ? (
        <button
          type="button"
          onClick={() => setTextScale((v) => (v >= 1.3 ? 1.0 : Math.round((v + 0.15) * 100) / 100))}
          className="fixed top-[calc(50%-5rem)] left-4 z-30 rounded-xl bg-green-900/90 hover:bg-green-800 p-2.5 flex items-center cursor-pointer pointer-events-auto transition-all duration-200"
          aria-label="Ajustar tamanho do texto"
          title={`Tamanho do texto: ${Math.round(textScale * 100)}% (toque para alterar)`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.6117 5.00684C6.86862 5.02589 7.11696 5.11134 7.3324 5.25488C7.57862 5.41908 7.77125 5.65263 7.88514 5.92578L11.9232 15.6162C12.1352 16.1258 11.8947 16.7115 11.3851 16.9238C10.8755 17.1362 10.2901 16.8942 10.0775 16.3848L9.08338 14H3.91736L2.92322 16.3857C2.71049 16.8948 2.12502 17.1359 1.6156 16.9238C1.10605 16.7114 0.865522 16.1258 1.07752 15.6162L5.11658 5.92578L5.16248 5.8252C5.27895 5.59518 5.45376 5.39859 5.66932 5.25488L5.76307 5.19727C5.98766 5.07035 6.24213 5.00195 6.50135 5.00195L6.6117 5.00684ZM4.75135 12H8.25037L6.50037 7.80176L4.75135 12Z" fill="#CDE8CF"></path>
            <path d="M18.0209 6.00098C18.0385 6.00133 18.0561 6.00165 18.0736 6.00293C18.0913 6.00421 18.1089 6.00562 18.1263 6.00781C18.1434 6.00996 18.1602 6.01358 18.1771 6.0166C18.1869 6.01835 18.1968 6.01946 18.2064 6.02148C18.234 6.02726 18.2614 6.03388 18.2885 6.04199C18.2921 6.04309 18.2956 6.04476 18.2992 6.0459C18.317 6.05145 18.3344 6.05789 18.3519 6.06445C18.368 6.07049 18.3841 6.07618 18.3998 6.08301C18.5114 6.13159 18.6161 6.20168 18.7074 6.29297L22.7074 10.293C23.0977 10.6835 23.0979 11.3166 22.7074 11.707C22.3169 12.0975 21.6839 12.0973 21.2933 11.707L19.0004 9.41406V16C19.0004 16.5522 18.5526 16.9999 18.0004 17C17.4481 17 17.0004 16.5523 17.0004 16V9.41406L14.7074 11.707C14.3169 12.0975 13.6839 12.0973 13.2933 11.707C12.9028 11.3165 12.9028 10.6835 13.2933 10.293L17.2933 6.29297C17.3386 6.2477 17.3876 6.20587 17.4408 6.16992C17.4934 6.13439 17.5488 6.10452 17.6058 6.08008C17.6512 6.06059 17.6989 6.04587 17.7474 6.0332C17.7614 6.02955 17.7753 6.0255 17.7894 6.02246C17.8033 6.01948 17.8173 6.01704 17.8314 6.01465C17.847 6.01199 17.8626 6.00973 17.8783 6.00781C17.8961 6.00565 17.914 6.00415 17.932 6.00293C17.948 6.00184 17.9639 6.00131 17.9799 6.00098C17.9866 6.00084 17.9936 6 18.0004 6C18.0072 6 18.0141 6.00084 18.0209 6.00098Z" fill="#CDE8CF"></path>
          </svg>
          <div className="hidden lg:block ml-2 text-green-100 text-sm">Tamanho do texto</div>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setTextScale((v) => (v >= 1.3 ? 1.0 : Math.round((v + 0.15) * 100) / 100))}
          className="fixed top-[calc(50%-5rem)] left-4 z-30 rounded-xl bg-green-900/90 hover:bg-green-800 p-2.5 flex items-center cursor-pointer pointer-events-auto transition-all duration-200"
          aria-label="Ajustar tamanho do texto"
          title={`Tamanho do texto: ${Math.round(textScale * 100)}% (clique para alterar)`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.6117 5.00684C6.86862 5.02589 7.11696 5.11134 7.3324 5.25488C7.57862 5.41908 7.77125 5.65263 7.88514 5.92578L11.9232 15.6162C12.1352 16.1258 11.8947 16.7115 11.3851 16.9238C10.8755 17.1362 10.2901 16.8942 10.0775 16.3848L9.08338 14H3.91736L2.92322 16.3857C2.71049 16.8948 2.12502 17.1359 1.6156 16.9238C1.10605 16.7114 0.865522 16.1258 1.07752 15.6162L5.11658 5.92578L5.16248 5.8252C5.27895 5.59518 5.45376 5.39859 5.66932 5.25488L5.76307 5.19727C5.98766 5.07035 6.24213 5.00195 6.50135 5.00195L6.6117 5.00684ZM4.75135 12H8.25037L6.50037 7.80176L4.75135 12Z" fill="#CDE8CF"></path>
            <path d="M18.0209 6.00098C18.0385 6.00133 18.0561 6.00165 18.0736 6.00293C18.0913 6.00421 18.1089 6.00562 18.1263 6.00781C18.1434 6.00996 18.1602 6.01358 18.1771 6.0166C18.1869 6.01835 18.1968 6.01946 18.2064 6.02148C18.234 6.02726 18.2614 6.03388 18.2885 6.04199C18.2921 6.04309 18.2956 6.04476 18.2992 6.0459C18.317 6.05145 18.3344 6.05789 18.3519 6.06445C18.368 6.07049 18.3841 6.07618 18.3998 6.08301C18.5114 6.13159 18.6161 6.20168 18.7074 6.29297L22.7074 10.293C23.0977 10.6835 23.0979 11.3166 22.7074 11.707C22.3169 12.0975 21.6839 12.0973 21.2933 11.707L19.0004 9.41406V16C19.0004 16.5522 18.5526 16.9999 18.0004 17C17.4481 17 17.0004 16.5523 17.0004 16V9.41406L14.7074 11.707C14.3169 12.0975 13.6839 12.0973 13.2933 11.707C12.9028 11.3165 12.9028 10.6835 13.2933 10.293L17.2933 6.29297C17.3386 6.2477 17.3876 6.20587 17.4408 6.16992C17.4934 6.13439 17.5488 6.10452 17.6058 6.08008C17.6512 6.06059 17.6989 6.04587 17.7474 6.0332C17.7614 6.02955 17.7753 6.0255 17.7894 6.02246C17.8033 6.01948 17.8173 6.01704 17.8314 6.01465C17.847 6.01199 17.8626 6.00973 17.8783 6.00781C17.8961 6.00565 17.914 6.00415 17.932 6.00293C17.948 6.00184 17.9639 6.00131 17.9799 6.00098C17.9866 6.00084 17.9936 6 18.0004 6C18.0072 6 18.0141 6.00084 18.0209 6.00098Z" fill="#CDE8CF"></path>
          </svg>
          <div className="hidden lg:block ml-2 text-green-100 text-sm">Tamanho do texto</div>
        </button>
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