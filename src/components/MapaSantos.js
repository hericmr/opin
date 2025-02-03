import React, { useState, useEffect } from "react";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import pontosAssistencia from "./pontosAssistencia";
import pontosHistoricos from "./pontosHistoricos";
import pontosLazer from "./pontosLazer";
import detalhesIntro from "./detalhesInfo"; // Importando os detalhes de introdução
import "./MapaSantos.css";

const MapaSantos = () => {
  const [painelInfo, setPainelInfo] = useState(detalhesIntro);
  const [geojsonData, setGeojsonData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    bairros: false,
    assistencia: true,
    historicos: true,
    culturais: true,
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
        {visibilidade.assistencia && <Marcadores pontos={pontosAssistencia} onClick={setPainelInfo} />}
        {visibilidade.historicos && <Marcadores pontos={pontosHistoricos} onClick={setPainelInfo} />}
        {visibilidade.culturais && <Marcadores pontos={pontosLazer} onClick={setPainelInfo} />}
      </MapaBase>

      {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={() => setPainelInfo(null)} />}
      
      <MenuCamadas
        estados={visibilidade}
        acoes={{
          toggleBairros: () => toggleVisibilidade("bairros"),
          toggleAssistencia: () => toggleVisibilidade("assistencia"),
          toggleHistoricos: () => toggleVisibilidade("historicos"),
          toggleCulturais: () => toggleVisibilidade("culturais"),
        }}
      />
    </div>
  );
};

export default MapaSantos;
