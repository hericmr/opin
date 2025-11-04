/**
 * Componente MapaEscolasIndigenas - Exibe o mapa interativo com escolas indígenas e terras indígenas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.dataPoints - Array de pontos de dados das escolas
 * @param {Function} props.onPainelOpen - Função para abrir o painel de informações
 * @returns {React.ReactElement} - Componente renderizado
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MapSelector from "./MapSelector";
import { Link } from 'react-router-dom';
import PainelInformacoes from "./PainelInformacoes";
import "./MapaEscolasIndigenas.css";
import { criarSlug } from '../utils/slug';
import { useRefresh } from '../contexts/RefreshContext';
import logger from '../utils/logger';

const MapaEscolasIndigenas = ({ dataPoints, onPainelOpen, isLoading = false }) => {
  logger.debug("DataPoints recebidos no MapaEscolasIndigenas:", dataPoints ? {
    quantidade: dataPoints.length,
    exemplo: dataPoints[0] ? {
      titulo: dataPoints[0].titulo,
      latitude: dataPoints[0].Latitude,
      longitude: dataPoints[0].Longitude,
      tipo: dataPoints[0].tipo
    } : 'Nenhum ponto'
  } : 'Nenhum dataPoint');

  const { refreshKey } = useRefresh();

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const panel = urlParams.get('panel');
  const initialPanel = useMemo(() => {
    if (panel && panel !== '' && dataPoints && dataPoints.length > 0) {
      const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
      return pointFound || null;
    }
    return null;
  }, [panel, dataPoints]);

  const [painelInfo, setPainelInfo] = useState(initialPanel);
  const [initialPanelOpened, setInitialPanelOpened] = useState(!!initialPanel);
  
  // Memoize escolasVisiveis para evitar recálculos desnecessários
  const escolasVisiveis = useMemo(() => 
    dataPoints ? dataPoints.filter(point => point.pontuacao >= 0) : [],
    [dataPoints]
  );

  // Otimizar a função de abrir painel
  const abrirPainel = useCallback((info) => {
    if (!info) return;
    setPainelInfo(info);
  }, []);

  // Função para forçar refresh do painel
  const refreshPainel = useCallback(() => {
    logger.debug('Forçando refresh do painel de informações');
    // O refresh será disparado pelo contexto
  }, []);

  // Abrir painel automaticamente quando initialPanel for encontrado (apenas uma vez)
  useEffect(() => {
    if (initialPanel && !painelInfo && !initialPanelOpened) {
      logger.debug('MapaEscolasIndigenas: Abrindo painel automaticamente para:', initialPanel.titulo);
      setPainelInfo(initialPanel);
      setInitialPanelOpened(true);
    }
  }, [initialPanel, painelInfo, initialPanelOpened]);

  // Expor a função abrirPainel e refreshPainel para componentes externos
  useEffect(() => {
    logger.debug('MapaEscolasIndigenas: onPainelOpen disponível:', !!onPainelOpen);
    logger.debug('MapaEscolasIndigenas: abrirPainel disponível:', !!abrirPainel);
    if (onPainelOpen && typeof onPainelOpen === 'function') {
      logger.debug('MapaEscolasIndigenas: Expondo função abrirPainel e refreshPainel');
      onPainelOpen(abrirPainel, refreshPainel);
    }
  }, [abrirPainel, onPainelOpen, refreshPainel]);

  // Otimizar a função de fechar painel
  const fecharPainel = useCallback(() => {
    setPainelInfo(null);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Novo mapa sem gaps */}
      <MapSelector
        dataPoints={escolasVisiveis}
        onPainelOpen={abrirPainel}
        painelAberto={!!painelInfo}
        className="h-full w-full"
        isMainLoading={isLoading}
      />

      {/* Painel de informações */}
      {painelInfo && (
        <PainelInformacoes 
          painelInfo={painelInfo} 
          closePainel={fecharPainel} 
          refreshKey={refreshKey}
        />
      )}
      <div className="fixed bottom-4 left-4 z-30 pointer-events-auto">
        <Link
          to="/"
          className="block rounded-full border border-green-100 bg-green-900/90 p-2.5 cursor-pointer hover:bg-green-800"
          aria-label="Sair do mapa e voltar para a página inicial"
          title="Sair do mapa"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M16 17L21 12L16 7" stroke="#CDE8CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M21 12H9" stroke="#CDE8CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#CDE8CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(MapaEscolasIndigenas);