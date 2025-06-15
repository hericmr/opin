/**
 * Componente MapaEscolasIndigenas - Exibe o mapa interativo com escolas indígenas e terras indígenas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.dataPoints - Array de pontos de dados das escolas
 * @returns {React.ReactElement} - Componente renderizado
 */
import React, { useState, useEffect } from "react";
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

  const urlParams = new URLSearchParams(window.location.search);
  const panel = urlParams.get('panel');
  var initialPanel = detalhesIntro;
  console.log("detalhesIntro:", detalhesIntro);
  if (panel && panel !== '' && dataPoints && dataPoints.length > 0) {
    const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
    if (pointFound != null) {
      initialPanel = pointFound;
    }
  }
  console.log("initialPanel:", initialPanel);

  const [geojsonData, setGeojsonData] = useState(null);
  const [terrasIndigenasData, setTerrasIndigenasData] = useState(null);
  const [estadoSPData, setEstadoSPData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    educacao: true,
    terrasIndigenas: true,
    estadoSP: true,
  });
  const [painelInfo, setPainelInfo] = useState(initialPanel);
  
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

  // Calcula o total de escolas visíveis no mapa (com pontuação >= 0)
  const escolasVisiveis = dataPoints ? dataPoints.filter(point => point.pontuacao >= 0) : [];
  const totalEscolas = escolasVisiveis.length;

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        console.log("Iniciando carregamento dos arquivos GeoJSON...");
        
        const [bairrosResponse, terrasIndigenasResponse, estadoSPResponse] = await Promise.all([
          fetch("/escolasindigenas/bairros.geojson"),
          fetch("/escolasindigenas/terras_indigenas.geojson"),
          fetch("/escolasindigenas/SP.geojson")
        ]);

        console.log("Respostas recebidas:", {
          bairros: bairrosResponse.status,
          terrasIndigenas: terrasIndigenasResponse.status,
          estadoSP: estadoSPResponse.status
        });

        if (!bairrosResponse.ok) {
          console.error(`Erro ao carregar GeoJSON dos bairros: HTTP status ${bairrosResponse.status}`);
          return;
        }
        if (!terrasIndigenasResponse.ok) {
          console.error(`Erro ao carregar GeoJSON das terras indígenas: HTTP status ${terrasIndigenasResponse.status}`);
          return;
        }
        if (!estadoSPResponse.ok) {
          console.error(`Erro ao carregar GeoJSON do estado: HTTP status ${estadoSPResponse.status}`);
          return;
        }

        const [bairrosData, terrasIndigenasData, estadoSPData] = await Promise.all([
          bairrosResponse.json(),
          terrasIndigenasResponse.json(),
          estadoSPResponse.json()
        ]);

        console.log("Dados GeoJSON carregados:", {
          bairros: bairrosData ? "OK" : "Falha",
          terrasIndigenas: terrasIndigenasData ? "OK" : "Falha",
          estadoSP: estadoSPData ? "OK" : "Falha"
        });

        if (!bairrosData || !bairrosData.features) {
          console.error("Dados dos bairros inválidos:", bairrosData);
          return;
        }

        if (!terrasIndigenasData || !terrasIndigenasData.features) {
          console.error("Dados das terras indígenas inválidos:", terrasIndigenasData);
          return;
        }

        if (!estadoSPData || !estadoSPData.features) {
          console.error("Dados do estado inválidos:", estadoSPData);
          return;
        }

        setGeojsonData(bairrosData);
        setTerrasIndigenasData(terrasIndigenasData);
        setEstadoSPData(estadoSPData);

        console.log("Estados atualizados com os dados GeoJSON");
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      }
    };
    fetchGeoJSON();
  }, []);

  // Adicionar logs para verificar quando os dados são renderizados
  useEffect(() => {
    console.log("Estado dos dados GeoJSON:", {
      bairros: geojsonData ? "Carregado" : "Não carregado",
      terrasIndigenas: terrasIndigenasData ? "Carregado" : "Não carregado",
      estadoSP: estadoSPData ? "Carregado" : "Não carregado"
    });
  }, [geojsonData, terrasIndigenasData, estadoSPData]);

  const abrirPainel = (info) => {
    console.group("MapaEscolasIndigenas - abrirPainel");
    console.log("Info recebida:", {
      titulo: info?.titulo,
      tipo: info?.tipo,
      hasLink: !!info?.link_para_documentos,
      linkValue: info?.link_para_documentos
    });
    setPainelInfo(info);
    console.log("painelInfo atualizado");
    console.groupEnd();
  };

  const fecharPainel = () => {
    console.group("MapaEscolasIndigenas - fecharPainel");
    console.log("Estado anterior:", {
      titulo: painelInfo?.titulo,
      tipo: painelInfo?.tipo,
      hasLink: !!painelInfo?.link_para_documentos
    });
    setPainelInfo(null);
    console.log("painelInfo definido como null");
    console.groupEnd();
  };

  const geoJSONStyle = {
    fillColor: "green",
    color: "white",
    weight: 1,
    fillOpacity: 0.4,
  };

  const toggleVisibilidade = (chave) => {
    console.log(`Alterando visibilidade: ${chave}`);
    setVisibilidade((prev) => ({ ...prev, [chave]: !prev[chave] }));
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