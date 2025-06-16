/**
 * Componente MapaEscolasIndigenas - Exibe o mapa interativo com escolas indígenas e terras indígenas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.dataPoints - Array de pontos de dados das escolas
 * @returns {React.ReactElement} - Componente renderizado
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import TerrasIndigenas from "./TerrasIndigenas";
import EstadoSP from "./EstadoSP";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import detalhesIntro from "./detalhesInfo";
import "./MapaEscolasIndigenas.css";

// Função para converter título em slug
const criarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '')         // Remove hífens do início e fim
    .trim();
};

const MapaEscolasIndigenas = ({ dataPoints }) => {
  console.log("DataPoints recebidos no MapaEscolasIndigenas:", dataPoints ? {
    quantidade: dataPoints.length,
    exemplo: dataPoints[0] ? {
      titulo: dataPoints[0].titulo,
      latitude: dataPoints[0].latitude,
      longitude: dataPoints[0].longitude,
      tipo: dataPoints[0].tipo
    } : 'Nenhum ponto'
  } : 'Nenhum dataPoint');

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const panel = urlParams.get('panel');
  const initialPanel = useMemo(() => {
    if (panel && panel !== '' && dataPoints && dataPoints.length > 0) {
      const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
      return pointFound || detalhesIntro;
    }
    return detalhesIntro;
  }, [panel, dataPoints]);

  const [geojsonData, setGeojsonData] = useState(null);
  const [terrasIndigenasData, setTerrasIndigenasData] = useState(null);
  const [estadoSPData, setEstadoSPData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    educacao: true,
    terrasIndigenas: true,
    estadoSP: true,
  });
  const [painelInfo, setPainelInfo] = useState(initialPanel);
  
  // Memoize escolasVisiveis para evitar recálculos desnecessários
  const escolasVisiveis = useMemo(() => 
    dataPoints ? dataPoints.filter(point => point.pontuacao >= 0) : [],
    [dataPoints]
  );
  
  const totalEscolas = useMemo(() => escolasVisiveis.length, [escolasVisiveis]);

  // Adicionar useEffect para monitorar mudanças no painelInfo
  useEffect(() => {
    console.group("MapaEscolasIndigenas - painelInfo state changed");
    console.log("Novo valor de painelInfo:", {
      titulo: painelInfo?.titulo,
      tipo: painelInfo?.tipo,
      hasLink: !!painelInfo?.link_para_documentos,
    linkValue: painelInfo?.link_para_documentos,
      isInitialPanel: painelInfo === initialPanel,
      isNull: painelInfo === null,
      isUndefined: painelInfo === undefined
  });
    console.groupEnd();
  }, [painelInfo, initialPanel]);

  // Otimizar o carregamento dos GeoJSONs
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchGeoJSON = async () => {
      try {
        const [bairrosResponse, terrasIndigenasResponse, estadoSPResponse] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/bairros.geojson`, { signal: controller.signal }),
          fetch(`${process.env.PUBLIC_URL}/terras_indigenas_simplified.geojson`, { signal: controller.signal }),
          fetch(`${process.env.PUBLIC_URL}/SP_simplified.geojson`, { signal: controller.signal })
        ]);

        if (!isMounted) return;

        if (!bairrosResponse.ok || !terrasIndigenasResponse.ok || !estadoSPResponse.ok) {
          console.error('Erro ao carregar GeoJSONs');
          return;
        }

        const [bairrosData, terrasIndigenasData, estadoSPData] = await Promise.all([
          bairrosResponse.json(),
          terrasIndigenasResponse.json(),
          estadoSPResponse.json()
        ]);

        if (!isMounted) return;

        if (bairrosData?.features) setGeojsonData(bairrosData);
        if (terrasIndigenasData?.features) setTerrasIndigenasData(terrasIndigenasData);
        if (estadoSPData?.features) setEstadoSPData(estadoSPData);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Erro ao carregar GeoJSONs:', error);
      }
    };

    fetchGeoJSON();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Adicionar logs para verificar quando os dados são renderizados
  useEffect(() => {
    console.log("Estado dos dados GeoJSON:", {
      bairros: geojsonData ? "Carregado" : "Não carregado",
      terrasIndigenas: terrasIndigenasData ? "Carregado" : "Não carregado",
      estadoSP: estadoSPData ? "Carregado" : "Não carregado"
    });
  }, [geojsonData, terrasIndigenasData, estadoSPData]);

  // Otimizar a função de abrir painel
  const abrirPainel = useCallback((info) => {
    if (!info) return;
    setPainelInfo(info);
  }, []);

  // Otimizar a função de fechar painel
  const fecharPainel = useCallback(() => {
    setPainelInfo(null);
  }, []);

  // Otimizar a função de toggle visibilidade
  const toggleVisibilidade = useCallback((chave) => {
    setVisibilidade(prev => ({ ...prev, [chave]: !prev[chave] }));
  }, []);

  const geoJSONStyle = {
    fillColor: "green",
    color: "white",
    weight: 1,
    fillOpacity: 0.4,
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapaBase>
        {visibilidade.estadoSP && estadoSPData && <EstadoSP data={estadoSPData} />}
        {visibilidade.terrasIndigenas && terrasIndigenasData && (
          <TerrasIndigenas 
            data={terrasIndigenasData} 
            onClick={abrirPainel}
          />
        )}
        {dataPoints && <Marcadores dataPoints={escolasVisiveis} visibility={visibilidade} onClick={abrirPainel} />}
      </MapaBase>

      {painelInfo && (
        <>
          {console.log("MapaEscolasIndigenas - Renderizando PainelInformacoes com:", {
            painelInfo,
            hasLink: painelInfo?.link_para_documentos,
            linkValue: painelInfo?.link_para_documentos
          })}
          <PainelInformacoes painelInfo={painelInfo} closePainel={fecharPainel} />
        </>
      )}
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto" style={{ zIndex: 20 }}>
          <MenuCamadas
            estados={visibilidade}
            acoes={{
              toggleEducacao: () => toggleVisibilidade("educacao"),
              toggleTerrasIndigenas: () => toggleVisibilidade("terrasIndigenas"),
              toggleEstadoSP: () => toggleVisibilidade("estadoSP"),
            }}
            totalEscolas={totalEscolas}
          />
        </div>
      </div>
    </div>
  );
};

export default MapaEscolasIndigenas;