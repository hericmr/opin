import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import pontos from "./pontosData";
import { customIcon } from "./CustomIcon";
import PainelInformacoes from "./PainelInformacoes";
import "./MapaSantos.css";

const MapaSantos = () => {
  const detalhesIntro = {
    titulo: "Cartografia Social de Santos",
    descricao: `
      <p> Esta plataforma interativa é uma cartografia social que busca mapear as territorialidades e valorizar as lutas e conquistas dos movimentos sociais e da classe trabalhadora na cidade de Santos.</p>
      <br>
      <p> O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais e históricos, como escolas, igrejas, unidades de saúde, espaços culturais e de lazer, além de locais carregados de memória histórica. </p>
      <br>
      <p> Entre os elementos mapeados, estão histórias relacionadas à escravização e lutas do povo negro, à opressão e resistência à ditadura empresarial-militar (1964-1984), e às lutas que moldaram e continuam moldando a identidade da região. </p>
      <br>
      <p>Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelos estudantes de Serviço Social da UNIFESP, durante a Unidade Curricular de Políticas Públicas 2, em 2024 e 2025.</p>
    `,
  };

  const [painelInfo, setPainelInfo] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [bairrosVisiveis, setBairrosVisiveis] = useState(false); // Estado para controlar a visibilidade dos bairros

  useEffect(() => {
    // Temporizador para exibir a mensagem inicial após 3,5 segundos
    const timer = setTimeout(() => {
      setPainelInfo(detalhesIntro);
    }, 3500);

    // Função para buscar o GeoJSON
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/hericmr/gps/main/public/bairros.geojson"); // Verifique o caminho correto do seu arquivo GeoJSON
        if (!response.ok) {
          throw new Error(`Erro ao carregar GeoJSON: HTTP status ${response.status}`);
        }

        const data = await response.json(); // Tenta fazer o parse do JSON
        setGeojsonData(data); // Atualiza o estado com os dados GeoJSON
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      }
    };

    fetchGeoJSON();

    // Limpa o temporizador ao desmontar o componente
    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (detalhes) => {
    setPainelInfo(detalhes);
  };

  const closePainel = () => {
    setPainelInfo(null);
  };

  const geoJSONStyle = {
    fillColor: "blue",
    color: "white",
    weight: 1,
    fillOpacity: 0.6,
  };

  // Função para alternar a visibilidade dos bairros
  const toggleBairros = () => {
    setBairrosVisiveis(!bairrosVisiveis);
  };

  return (
    <div className="relative h-screen">
      {/* Mapa */}
      <MapContainer
        center={[-23.97 , -46.29]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        />
        {pontos.map((ponto, index) => (
          <Marker
            key={index}
            position={[ponto.lat, ponto.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(ponto.detalhes),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
              {ponto.detalhes.titulo}
            </Tooltip>
            <Popup>
              <span className="text-base font-medium text-gray-700">
                {ponto.desc}
              </span>
            </Popup>
          </Marker>
        ))}

        {/* GeoJSON dos Bairros */}
        {bairrosVisiveis && geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={geoJSONStyle}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`Bairro: ${feature.properties.NOME}`);
              layer.on("click", () => {
                console.log(`Clicked on: ${feature.properties.NOME}`);
              });
            }}
          />
        )}
      </MapContainer>

      {/* Painel de Informações */}
      {painelInfo && (
        <PainelInformacoes painelInfo={painelInfo} closePainel={closePainel} />
      )}

      {/* Botão para alternar a visibilidade dos bairros */}
      <button
        onClick={toggleBairros}
        className="absolute top-20 left-5 z-10 p-3 bg-green-7 00 text-white rounded-md shadow-lg"
      >
        {bairrosVisiveis ? "Ocultar Bairros" : "Ver Bairros"}
      </button>
    </div>
  );
};

export default MapaSantos;
