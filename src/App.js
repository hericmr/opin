import React, { useState, useEffect } from "react";
import { supabase } from './supabaseClient';
import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar";
import PainelInformacoes from "./components/PainelInformacoes";
import AddLocationButton from "./components/AddLocationButton";

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/cartografiasocial/favicon.ico" alt="Ícone de carregamento" className="w-8 h-8" />
      </div>
    </div>
    <p className="mt-4 text-lg font-semibold animate-pulse">Carregando dados...</p>
  </div>
);

const App = () => {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataPoints = async () => {
    console.log("Iniciando consulta ao Supabase na tabela 'locations'...");
    const { data, error } = await supabase
      .from('locations3')
      .select('*');
    
    if (error) {
      console.error("Erro na consulta ao Supabase:", error);
      throw new Error(error.message);
    }
    
    console.log("Consulta realizada com sucesso. Dados recebidos:", data);
    return data;
  };

  const formatData = (dataPoints) => {
    console.log("Iniciando formatação dos dados...");
    const formattedData = dataPoints.map((e, index) => {
      console.log(`Formatando registro ${index}:`, e);

      // Links
      e.links = (e.links && typeof e.links === 'string')
        ? e.links.split(";").map((l) => {
            let [texto, url] = l.split(':');
            return { texto: texto || "Sem título", url: url || "#" };
          })
        : [];

      // Imagens
      e.imagens = (e.imagens && typeof e.imagens === 'string')
        ? e.imagens.split(",")
        : [];

      // Áudio
      e.audioUrl = (e.audio && typeof e.audio === 'string')
        ? e.audio.split(",")
        : [];

      // Título e Descrição
      e.titulo = e.titulo || "Título não disponível";
      e.descricao = e.descricao || "Sem descrição";

      // Coordenadas
      if (e.localizacao && typeof e.localizacao === 'string') {
        const [lat, lng] = e.localizacao.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          e.latitude = lat;
          e.longitude = lng;
        } else {
          console.warn("Coordenadas inválidas para o registro:", e);
          e.latitude = null;
          e.longitude = null;
        }
      } else {
        e.latitude = null;
        e.longitude = null;
      }

      // Descrição detalhada
      if (e.descricao_detalhada) {
        e.descricao_detalhada = e.descricao_detalhada
          .replace(/\n/g, "<br>")
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\*(.*?)\*/g, "<i>$1</i>");
      }

      console.log(`Registro ${index} formatado:`, e);
      return e;
    });
    console.log("Formatação concluída. Dados formatados:", formattedData);
    return formattedData;
  };

  const handleLocationAdded = (newLocation) => {
    const formattedLocation = formatData([newLocation])[0];
    setDataPoints((prevDataPoints) => [...prevDataPoints, formattedLocation]);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Inicializando aplicativo...");
        let dataPoints = await fetchDataPoints();
        console.log("Dados brutos recebidos do Supabase:", dataPoints);
        if (dataPoints.length === 0) {
          console.warn("Nenhum dado encontrado na tabela 'locations'.");
        }
        dataPoints = formatData(dataPoints);
        console.log("Dados formatados:", dataPoints);
        setDataPoints(dataPoints);
      } catch (err) {
        console.error("Erro ao buscar ou formatar dados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Erro ao carregar os dados:</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente...
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <MapaSantos dataPoints={dataPoints} />
        <PainelInformacoes dataPoints={dataPoints} />
        <AddLocationButton onLocationAdded={handleLocationAdded} />
      </main>
    </div>
  );
};

export default App;