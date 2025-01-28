import React, { useState, useEffect } from "react";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import BotaoAlternar from "./BotaoAlternar";
import BotaoAssistencia from "./BotaoAssistencia";
import PainelInformacoes from "./PainelInformacoes";
import pontos from "./pontosData";
import pontosAssistencia from "./pontosAssistencia";
import pontosHistoricos from "./pontosHistoricos";
import "./MapaSantos.css";
import BotaoHistoricos from "./BotaoHistoricos";

const MapaSantos = () => {
  const detalhesIntro = {
    titulo: "Territórios, resistência e identidade em Santos",
    descricao: `
      <p class="mb-4">Esta é uma cartografia social que busca mapear as territorialidades, as lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de locais carregados de memória histórica.</p>
      
      <div class="border border-green-300 p-4 rounded-lg bg-green-100">
        <p class="font-semibold mb-2">Os pontos estão representados por diferentes cores no mapa:</p>
        <ul class="list-none space-y-2">
          <li class="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="Marcador Azul" class="w-5 h-8 mr-2" />
            <span><strong class="text-blue-700">Azul:</strong> Equipamentos sociais, culturais, religiosos e políticos.</span>
          </li>
          <li class="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="Marcador Verde" class="w-5 h-8 mr-2" />
            <span><strong class="text-green-700">Verde:</strong> Unidades de assistência social e saúde.</span>
          </li>
          <li class="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png" alt="Marcador Amarelo" class="w-5 h-8 mr-2" />
            <span><strong class="text-yellow-600">Amarelo:</strong> Locais históricos e de memória.</span>
          </li>
        </ul>
      </div>
      
      <p class="mt-4">Entre os elementos mapeados, estão histórias relacionadas à escravização e lutas do povo negro, à opressão e resistência à ditadura empresarial-militar (1964-1984), e às lutas que moldaram e continuam moldando a identidade da região.</p>
      
      <p class="mt-4">Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelos estudantes de Serviço Social da UNIFESP, durante a Unidade Curricular de Políticas Públicas 2, em 2024 e 2025.</p>
    `,
  };

  const [painelInfo, setPainelInfo] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [bairrosVisiveis, setBairrosVisiveis] = useState(false);
  const [assistenciaVisiveis, setAssistenciaVisiveis] = useState(true);
  const [historicosVisiveis, setHistoricosVisiveis] = useState(true);

  useEffect(() => {
    setPainelInfo(detalhesIntro); // Define o painelInfo imediatamente

    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/hericmr/gps/main/public/bairros.geojson"
        );
        if (!response.ok)
          throw new Error(`Erro ao carregar GeoJSON: HTTP status ${response.status}`);
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      }
    };

    fetchGeoJSON();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPainelInfo(detalhesIntro), 3500);
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
        {bairrosVisiveis && geojsonData && (
          <Bairros data={geojsonData} style={geoJSONStyle} />
        )}
        {assistenciaVisiveis && (
          <Marcadores pontos={pontosAssistencia} onClick={setPainelInfo} />
        )}
        {historicosVisiveis && (
          <Marcadores pontos={pontosHistoricos} onClick={setPainelInfo} />
        )}
      </MapaBase>

      {painelInfo && (
        <PainelInformacoes
          painelInfo={painelInfo}
          closePainel={() => setPainelInfo(null)}
        />
      )}
      <BotaoAlternar
        visivel={bairrosVisiveis}
        onClick={() => setBairrosVisiveis(!bairrosVisiveis)}
      />
      <BotaoAssistencia
        visivel={assistenciaVisiveis}
        onClick={() => setAssistenciaVisiveis(!assistenciaVisiveis)}
      />
      <BotaoHistoricos
        visivel={historicosVisiveis}
        onClick={() => setHistoricosVisiveis(!historicosVisiveis)}
      />
    </div>
  );
};

export default MapaSantos;
