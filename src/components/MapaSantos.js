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
  console.log("DataPoints recebidos:", dataPoints); // Verifique os dados recebidos

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
        const [bairrosResponse, terrasIndigenasResponse, estadoSPResponse] = await Promise.all([
          fetch("https://raw.githubusercontent.com/hericmr/gps/main/public/bairros.geojson"),
          fetch("/cartografiasocial/terras_indigenas.geojson"),
          fetch("/cartografiasocial/SP.geojson")
        ]);

        if (!bairrosResponse.ok) throw new Error(`Erro ao carregar GeoJSON dos bairros: HTTP status ${bairrosResponse.status}`);
        if (!terrasIndigenasResponse.ok) throw new Error(`Erro ao carregar GeoJSON das terras indígenas: HTTP status ${terrasIndigenasResponse.status}`);
        if (!estadoSPResponse.ok) throw new Error(`Erro ao carregar GeoJSON do estado: HTTP status ${estadoSPResponse.status}`);

        const [bairrosData, terrasIndigenasData, estadoSPData] = await Promise.all([
          bairrosResponse.json(),
          terrasIndigenasResponse.json(),
          estadoSPResponse.json()
        ]);

        setGeojsonData(bairrosData);
        setTerrasIndigenasData(terrasIndigenasData);
        setEstadoSPData(estadoSPData);
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      }
    };
    fetchGeoJSON();
  }, []);

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
          toggleAssistencia: () => toggleVisibilidade("assistencia"),
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