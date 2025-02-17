import React, { useState, useEffect } from "react";
import slugify from "slugify";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import detalhesIntro from "./detalhesInfo"; 
import "./MapaSantos.css";

const MapaSantos = ({ dataPoints }) => {
  
  const urlParams = new URLSearchParams(window.location.search);
  const panel = urlParams.get('panel');
  var initialPanel = detalhesIntro;
  if(panel && panel !== '' && dataPoints && dataPoints.length > 0) {
    const pointFound = dataPoints.find((item) => slugify(item.titulo).toLowerCase() === panel);
    if(pointFound != null) {
      initialPanel = pointFound;
    }
  }
  
  const [geojsonData, setGeojsonData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    bairros: false,
    assistencia: true,
    historicos: true,
    culturais: true,
    comunidades: true,
    educação: true,
    religiao: true,
    bairro: true,
  });
  const [painelInfo, setPainelInfo] = useState(initialPanel);
  
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
        {<Marcadores dataPoints={dataPoints} visibility={visibilidade} onClick={abrirPainel} />}
      </MapaBase>

      {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={fecharPainel} />}
      
      <MenuCamadas
        estados={visibilidade}
        acoes={{
          toggleBairros:     () => toggleVisibilidade("bairros"),
          toggleAssistencia: () => toggleVisibilidade("assistencia"),
          toggleHistoricos:  () => toggleVisibilidade("historicos"),
          toggleCulturais:   () => toggleVisibilidade("culturais"),
          toggleComunidades: () => toggleVisibilidade("comunidades"),
          toggleEducação:    () => toggleVisibilidade("educação"),
          toggleReligiao:    () => toggleVisibilidade("religiao"),
          toggleBairro:      () => toggleVisibilidade("bairro"),
          
        }}
      />
    </div>
  );
};

export default MapaSantos;
