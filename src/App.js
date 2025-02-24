import React, { useState, useEffect } from "react";
import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar";
import PainelInformacoes from "./components/PainelInformacoes";

// Função para buscar os dados da planilha do Google Sheets
const fetchDataPoints = async () => {
  const spreadsheetId = '10h3GnQFWcHa8gZL1YfkJyMjxV3j24z1H-RtqU7TReYY';
  const parser = new PublicGoogleSheetsParser(spreadsheetId);
  return await parser.parse();
};

// Componente de tela de carregamento
const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
      <div className="relative">
        {/* Spinner Animado */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/cartografiasocial/favicon.ico" alt="Ícone de carregamento" className="w-8 h-8" />
        </div>
      </div>

      <p className="mt-4 text-lg font-semibold animate-pulse">Carregando dados...</p>
    </div>
  );
};

// Componente principal da aplicação
const App = () => {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para formatar os dados da planilha
  const formatData = (dataPoints) => {
    return dataPoints.map((e) => {
      // Formata os links (texto:url;texto:url)
      e.links = e.links && typeof e.links === 'string' ? e.links.split(";").map((l) => {
        let [texto, url] = l.split(':');
        return { texto: texto || "", url };
      }) : [];

      // Formata as imagens (url1,url2,url3)
      e.imagens = e.imagens && typeof e.imagens === 'string' ? e.imagens.split(",") : [];

      // Formata os áudios (url1,url2,url3) e renomeia para audioUrl
      e.audioUrl = e.audio && typeof e.audio === 'string' ? e.audio.split(",") : [];

      return e;
    });
  };

  // Efeito para inicializar o aplicativo
  useEffect(() => {
    const initializeApp = async () => {
      try {
        let dataPoints = await fetchDataPoints();
        dataPoints = formatData(dataPoints);
        setDataPoints(dataPoints);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Exibe a tela de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <LoadingScreen />;
  }

  // Exibe uma mensagem de erro caso ocorra algum problema
  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Erro ao carregar os dados:</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Renderiza o aplicativo
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <MapaSantos dataPoints={dataPoints} />
        <PainelInformacoes />
      </main>
    </div>
  );
};

export default App;