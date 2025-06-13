import React, { useState, useEffect } from "react";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import TerrasIndigenas from "./TerrasIndigenas";
import EstadoSP from "./EstadoSP";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import detalhesIntro from "./detalhesInfo"; 
import "./MapaSantos.css";

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

const MapaSantos = ({ dataPoints }) => {
  console.log("DataPoints recebidos no MapaSantos:", dataPoints ? {
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
  if (panel && panel !== '' && dataPoints && dataPoints.length > 0) {
    const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
    if (pointFound != null) {
      initialPanel = pointFound;
    }
  }

  const [geojsonData, setGeojsonData] = useState(null);
  const [terrasIndigenasData, setTerrasIndigenasData] = useState(null);
  const [estadoSPData, setEstadoSPData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    bairros: false,
    bairrosLaranja: true,
    assistencia: true,
    historicos: true,
    culturais: true,
    comunidades: true,
    educação: true,
    religiao: true,
    bairro: true,
    terrasIndigenas: true,
    estadoSP: true,
  });
  const [painelInfo, setPainelInfo] = useState(initialPanel);

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
    setPainelInfo(info);
  };

  const fecharPainel = () => {
    setPainelInfo(null);
  };

  const geoJSONStyle = {
    fillColor: "green",
    color: "white",
    weight: 1,
    fillOpacity: 0.4,
  };

  const toggleVisibilidade = (chave) => {
    console.log(`Alterando visibilidade: ${chave}`);
    if (chave === "bairros") {
      // Quando alternar bairros, também alterna os marcadores de bairro
      setVisibilidade((prev) => ({ 
        ...prev, 
        [chave]: !prev[chave],
        bairro: !prev[chave] // Sincroniza com os marcadores de bairro
      }));
    } else if (chave === "bairrosLaranja") {
      // Quando alternar bairros laranja, também alterna os marcadores de bairro
      setVisibilidade((prev) => ({ 
        ...prev, 
        [chave]: !prev[chave],
        bairro: !prev[chave] // Sincroniza com os marcadores de bairro
      }));
    } else {
      setVisibilidade((prev) => ({ ...prev, [chave]: !prev[chave] }));
    }
  };

  return (
    <div className="relative h-screen">
      <MapaBase>
        {visibilidade.estadoSP && estadoSPData && <EstadoSP data={estadoSPData} />}
        {visibilidade.bairros && geojsonData && <Bairros data={geojsonData} style={geoJSONStyle} />}
        {visibilidade.terrasIndigenas && terrasIndigenasData && <TerrasIndigenas data={terrasIndigenasData} onClick={abrirPainel} />}
        {dataPoints && <Marcadores dataPoints={dataPoints} visibility={visibilidade} onClick={abrirPainel} />}
      </MapaBase>

      {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={fecharPainel} />}
      
      <MenuCamadas
        estados={visibilidade}
        acoes={{
          toggleBairros: () => toggleVisibilidade("bairros"),
          toggleBairrosLaranja: () => toggleVisibilidade("bairrosLaranja"),
          toggleHistoricos: () => toggleVisibilidade("historicos"),
          toggleCulturais: () => toggleVisibilidade("culturais"),
          toggleComunidades: () => toggleVisibilidade("comunidades"),
          toggleEducação: () => toggleVisibilidade("educação"),
          toggleReligiao: () => toggleVisibilidade("religiao"),
          toggleBairro: () => toggleVisibilidade("bairro"),
          toggleTerrasIndigenas: () => toggleVisibilidade("terrasIndigenas"),
          toggleEstadoSP: () => toggleVisibilidade("estadoSP"),
        }}
      />
    </div>
  );
};

export default MapaSantos;