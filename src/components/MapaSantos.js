import React, { useState, useEffect } from "react";
import slugify from "slugify";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import pontosAssistencia from "./pontosAssistencia";
import pontosHistoricos from "./pontosHistoricos";
import pontosLazer from "./pontosLazer";
import pontosComunidades from "./pontosComunidades";
import pontosEducação from "./pontosEducação";
import pontosReligiao from "./pontosReligiao";
import detalhesIntro from "./detalhesInfo"; 
import "./MapaSantos.css";

const urlParams = new URLSearchParams(window.location.search);
const panel = urlParams.get('panel');
var initialPanel = detalhesIntro;
if(panel != '') {
  const mergedPoints = [...pontosAssistencia, ...pontosHistoricos, ...pontosLazer, ...pontosComunidades, ...pontosEducação, ...pontosReligiao];
  const pointFound = mergedPoints.find(item => slugify(item.detalhes.titulo).toLowerCase() === panel);
  if(pointFound != null) {
    initialPanel = pointFound.detalhes;
  }
}

const MapaSantos = () => {
  const [painelInfo, setPainelInfo] = useState(initialPanel);
  const [geojsonData, setGeojsonData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    bairros: false,
    assistencia: true,
    historicos: true,
    culturais: true,
    comunidades: true,
    educação: true,
    religiao: true,
  });

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/hericmr/gps/main/public/bairros.geojson"
        );
        if (!response.ok) throw new Error(`Erro ao carregar GeoJSON: HTTP status ${response.status}`);
        const data = await response.json();
        setGeojsonData(data);
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
    setVisibilidade((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  return (
    <div className="relative h-screen">
      <MapaBase>
        {visibilidade.bairros && geojsonData && <Bairros data={geojsonData} style={geoJSONStyle} />}
        {visibilidade.assistencia && <Marcadores pontos={pontosAssistencia} onClick={abrirPainel} />}
        {visibilidade.historicos && <Marcadores pontos={pontosHistoricos} onClick={abrirPainel} />}
        {visibilidade.culturais && <Marcadores pontos={pontosLazer} onClick={abrirPainel} />}
        {visibilidade.comunidades && <Marcadores pontos={pontosComunidades} onClick={abrirPainel} />}
        {visibilidade.educação && <Marcadores pontos={pontosEducação} onClick={abrirPainel} />}
        {visibilidade.religiao && <Marcadores pontos={pontosReligiao} onClick={abrirPainel} />}
      </MapaBase>

      {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={fecharPainel} />}
      
      <MenuCamadas
        estados={visibilidade}
        acoes={{
          toggleBairros: () => toggleVisibilidade("bairros"),
          toggleAssistencia: () => toggleVisibilidade("assistencia"),
          toggleHistoricos: () => toggleVisibilidade("historicos"),
          toggleCulturais: () => toggleVisibilidade("culturais"),
          toggleComunidades: () => toggleVisibilidade("comunidades"),
          toggleEducação: () => toggleVisibilidade("educação"),
          toggleReligiao: () => toggleVisibilidade("religiao"),
        }}
      />
    </div>
  );
};

export default MapaSantos;
