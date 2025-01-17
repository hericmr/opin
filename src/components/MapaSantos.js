import React, { useState, useEffect } from "react";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import BotaoAlternar from "./BotaoAlternar";
import PainelInformacoes from "./PainelInformacoes";
import pontos from "./pontosData";
import "./MapaSantos.css";

const MapaSantos = () => {
  const detalhesIntro = {
    titulo: "Cartografia Social de Santos",
    descricao: `
      <p> Esta é uma cartografia social que busca mapear as territorialidades e valorizar as lutas e conquistas dos movimentos sociais e da classe trabalhadora na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais e históricos, como escolas, igrejas, unidades de saúde, espaços culturais e de lazer, além de locais carregados de memória histórica. </p>
      <br>
      <p> Entre os elementos mapeados, estão histórias relacionadas à escravização e lutas do povo negro, à opressão e resistência à ditadura empresarial-militar (1964-1984), e às lutas que moldaram e continuam moldando a identidade da região. </p>
      <br>
      <p>Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelos estudantes de Serviço Social da UNIFESP, durante a Unidade Curricular de Políticas Públicas 2, em 2024 e 2025.</p>
    `,
  };

  const [painelInfo, setPainelInfo] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [bairrosVisiveis, setBairrosVisiveis] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPainelInfo(detalhesIntro), 3500);
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/hericmr/gps/main/public/bairros.geojson");
        if (!response.ok) throw new Error(`Erro ao carregar GeoJSON: HTTP status ${response.status}`);
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      }
    };

    fetchGeoJSON();
    return () => clearTimeout(timer);
  }, []);

  const geoJSONStyle = {
    fillColor: "green",
    color: "white",
    weight: 1,
    fillOpacity: 0.4,
  };

  return (
    <div className="relative h-screen">
      <MapaBase>
        <Marcadores pontos={pontos} onClick={setPainelInfo} />
        {bairrosVisiveis && geojsonData && <Bairros data={geojsonData} style={geoJSONStyle} />}
      </MapaBase>

      {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={() => setPainelInfo(null)} />}
      <BotaoAlternar visivel={bairrosVisiveis} onClick={() => setBairrosVisiveis(!bairrosVisiveis)} />
    </div>
  );
};

export default MapaSantos;
