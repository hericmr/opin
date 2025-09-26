import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import OpenLayersTerrasIndigenas from './OpenLayersTerrasIndigenas';
import OpenLayersEstadoSP from './OpenLayersEstadoSP';

/**
 * Componente OpenLayersLayers - Gerenciador unificado de todas as camadas GeoJSON
 * Centraliza o controle das camadas de terras indígenas e estado SP
 */
const OpenLayersLayers = ({ 
  terrasIndigenasData,
  estadoSPData,
  showTerrasIndigenas = true,
  showEstadoSP = true,
  onPainelOpen,
  map,
  className = "h-full w-full"
}) => {
  // Refs para controle das camadas
  const terrasIndigenasRef = useRef(null);
  const estadoSPRef = useRef(null);
  
  // Estados para controle das camadas
  const [layersStatus, setLayersStatus] = React.useState({
    terrasIndigenas: {
      visible: showTerrasIndigenas,
      loaded: false,
      error: null
    },
    estadoSP: {
      visible: showEstadoSP,
      loaded: false,
      error: null
    }
  });

  // Verificar se há dados válidos
  const hasValidData = useMemo(() => {
    return {
      terrasIndigenas: terrasIndigenasData && terrasIndigenasData.features && terrasIndigenasData.features.length > 0,
      estadoSP: estadoSPData && estadoSPData.features && estadoSPData.features.length > 0
    };
  }, [terrasIndigenasData, estadoSPData]);

  /**
   * Atualiza status de uma camada
   */
  const updateLayerStatus = useCallback((layerName, updates) => {
    setLayersStatus(prev => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        ...updates
      }
    }));
  }, []);

  /**
   * Handler para mudanças na visibilidade das camadas - REMOVIDO: não utilizado
   */
  // const handleLayerVisibilityChange = useCallback((layerName, visible) => {
  //   updateLayerStatus(layerName, { visible });
  // }, [updateLayerStatus]);

  /**
   * Handler para erros nas camadas
   */
  const handleLayerError = useCallback((layerName, error) => {
    console.error(`[OpenLayersLayers] Erro na camada ${layerName}:`, error);
    updateLayerStatus(layerName, { error: error.message });
  }, [updateLayerStatus]);

  /**
   * Handler para sucesso no carregamento das camadas
   */
  const handleLayerSuccess = useCallback((layerName) => {
    updateLayerStatus(layerName, { loaded: true, error: null });
  }, [updateLayerStatus]);

  /**
   * Obtém estatísticas das camadas
   */
  const getLayersStats = useCallback(() => {
    const stats = {
      total: 0,
      visible: 0,
      loaded: 0,
      errors: 0
    };

    Object.values(layersStatus).forEach(layer => {
      stats.total++;
      if (layer.visible) stats.visible++;
      if (layer.loaded) stats.loaded++;
      if (layer.error) stats.errors++;
    });

    return stats;
  }, [layersStatus]);

  /**
   * Obtém informações detalhadas das camadas
   */
  const getLayersInfo = useCallback(() => {
    return {
      terrasIndigenas: {
        ...layersStatus.terrasIndigenas,
        hasData: hasValidData.terrasIndigenas,
        featureCount: hasValidData.terrasIndigenas ? terrasIndigenasData.features.length : 0
      },
      estadoSP: {
        ...layersStatus.estadoSP,
        hasData: hasValidData.estadoSP,
        featureCount: hasValidData.estadoSP ? estadoSPData.features.length : 0
      }
    };
  }, [layersStatus, hasValidData, terrasIndigenasData, estadoSPData]);

  // Log de status das camadas
  useEffect(() => {
    const stats = getLayersStats();
    const info = getLayersInfo();
    
    console.log('[OpenLayersLayers] Status das camadas:', {
      stats,
      info,
      hasValidData
    });
  }, [layersStatus, getLayersStats, getLayersInfo, hasValidData]);

  // Atualizar status quando props mudarem
  useEffect(() => {
    setLayersStatus(prev => ({
      terrasIndigenas: {
        ...prev.terrasIndigenas,
        visible: showTerrasIndigenas
      },
      estadoSP: {
        ...prev.estadoSP,
        visible: showEstadoSP
      }
    }));
  }, [showTerrasIndigenas, showEstadoSP]);

  // Se não há dados válidos, não renderizar nada
  if (!hasValidData.terrasIndigenas && !hasValidData.estadoSP) {
    return (
      <div className={className}>
        <div className="text-center text-gray-500 p-4">
          Nenhuma camada GeoJSON disponível
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Camada Terras Indígenas */}
      {hasValidData.terrasIndigenas && (
        <OpenLayersTerrasIndigenas
          ref={terrasIndigenasRef}
          data={terrasIndigenasData}
          onPainelOpen={onPainelOpen}
          showTerrasIndigenas={showTerrasIndigenas}
          map={map}
          onLoad={() => handleLayerSuccess('terrasIndigenas')}
          onError={(error) => handleLayerError('terrasIndigenas', error)}
        />
      )}

      {/* Camada Estado SP */}
      {hasValidData.estadoSP && (
        <OpenLayersEstadoSP
          ref={estadoSPRef}
          data={estadoSPData}
          showEstadoSP={showEstadoSP}
          map={map}
          onLoad={() => handleLayerSuccess('estadoSP')}
          onError={(error) => handleLayerError('estadoSP', error)}
        />
      )}
    </div>
  );
};

export default OpenLayersLayers;
