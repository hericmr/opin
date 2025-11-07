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
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();

  // Ler panel da URL sempre que location mudar
  const panel = useMemo(() => {
    const params = new URLSearchParams(location.search || '');
    return params.get('panel');
  }, [location.search]);
  const initialPanel = useMemo(() => {
    // Primeiro verificar se há dados da escola no navigation state
    if (location.state?.schoolData) {
      return location.state.schoolData;
    }
    
    // Depois verificar URL params
    if (panel && panel !== '' && dataPoints && dataPoints.length > 0) {
      const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
      return pointFound || null;
    }
    return null;
  }, [panel, dataPoints, location.state]);

  const [painelInfo, setPainelInfo] = useState(null);
  const [initialPanelOpened, setInitialPanelOpened] = useState(false);
  
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

  // Abrir painel automaticamente quando initialPanel for encontrado na URL (apenas uma vez)
  useEffect(() => {
    // Se há um panel na URL e ainda não foi aberto, abrir o painel
    if (initialPanel && !initialPanelOpened && panel) {
      logger.debug('MapaEscolasIndigenas: Abrindo painel automaticamente da URL para:', initialPanel.titulo);
      setPainelInfo(initialPanel);
      setInitialPanelOpened(true);
      // Forçar painel maximizado quando vem da URL
      try {
        localStorage.setItem('opin:painelIsMaximized', 'true');
      } catch (e) {
        console.warn('Erro ao salvar estado de maximização:', e);
      }
    }
    // Se não há panel na URL, resetar o estado
    if (!panel && initialPanelOpened) {
      setInitialPanelOpened(false);
    }
  }, [initialPanel, initialPanelOpened, panel]);

  // Abrir painel quando navigation state mudar (quando vem da busca)
  useEffect(() => {
    if (location.state?.schoolData) {
      const schoolData = location.state.schoolData;
      // Verificar se é uma escola diferente da atual
      const isDifferentSchool = !painelInfo || painelInfo.id !== schoolData.id;
      if (isDifferentSchool) {
        logger.debug('MapaEscolasIndigenas: Abrindo painel a partir do navigation state:', schoolData.titulo);
        setPainelInfo(schoolData);
      }
    }
  }, [location.state?.schoolData, painelInfo]);

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
    setInitialPanelOpened(false);

    const params = new URLSearchParams(location.search);
    if (params.has('panel')) {
      params.delete('panel');
    }

    const search = params.toString();
    const nextPath = `${location.pathname}${search ? `?${search}` : ''}${location.hash || ''}`;

    let nextState = location.state || null;
    if (nextState && typeof nextState === 'object' && 'schoolData' in nextState) {
      const { schoolData, ...restState } = nextState;
      nextState = Object.keys(restState).length > 0 ? restState : null;
    }

    navigate(nextPath, { replace: true, state: nextState });
  }, [location.hash, location.pathname, location.search, location.state, navigate]);

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
    </div>
  );
};

// Export directly - React.lazy handles code splitting
export default MapaEscolasIndigenas;