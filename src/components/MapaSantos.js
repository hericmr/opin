import React, { useState, useEffect } from "react";
import MapaBase from "./MapaBase";
import Marcadores from "./Marcadores";
import Bairros from "./Bairros";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import pontosAssistencia from "./pontosAssistencia";
import pontosHistoricos from "./pontosHistoricos";
import pontosLazer from "./pontosLazer";
import "./MapaSantos.css";



const MapaSantos = () => {
  const detalhesIntro = {
    titulo: "Territórios, resistência e identidade em Santos",
    descricao: `
      <p class="mb-4">Esta é uma cartografia social que busca mapear as territorialidades, as lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de locais carregados de memória histórica.</p>
      
      <div class="border border-green-200 p-4 rounded-lg bg-green-100 max-w-md mx-auto">
        <p class="font-semibold mb-2 text-center">Os pontos estão representados por:</p>
        <ul class="list-none space-y-2">
          <li class="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="Marcador Azul" class="w-5 h-8 mr-2" />
            <span><strong class="text-blue-700">Lazer:</strong> Equipamentos sociais, culturais e de lazer.</span>
          </li>
          <li class="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="Marcador Verde" class="w-5 h-8 mr-2" />
            <span><strong class="text-green-700">Assistência:</strong> Unidades de assistência social e saúde.</span>
          </li>
          <li class="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png" alt="Marcador Amarelo" class="w-5 h-8 mr-2" />
            <span><strong class="text-yellow-600">Históricos:</strong> Locais históricos e de memória.</span>
          </li>
        </ul>
      </div>
      
      <p class="mt-4">Entre os elementos mapeados, estão histórias relacionadas à escravização e lutas do povo negro, à opressão e resistência à ditadura empresarial-militar (1964-1984), e às lutas que moldaram e continuam moldando a identidade da região.</p>
      
      <p class="mt-4">Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelas(os) estudantes de Serviço Social da UNIFESP do vespertino e noturno durante a Unidade Curricular de Políticas Públicas 2, em 2024 e 2025.</p>
      <img src="/gps/fotos/turma.png" alt="Turma do Vespertino" className="h-10 w-auto object-contain" />
    `,
  };


  const [painelInfo, setPainelInfo] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [visibilidade, setVisibilidade] = useState({
    bairros: false,
    assistencia: true,
    historicos: true,
    culturais: true,
  });

  useEffect(() => {
    setPainelInfo(detalhesIntro);

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
