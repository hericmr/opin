import React, { useState, useEffect } from "react";
import PublicGoogleSheetsParser from 'public-google-sheets-parser'

import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar"; 
import PainelInformacoes from "./components/PainelInformacoes";

const fetchDataPoints = async () => {
  const spreadsheetId = '10h3GnQFWcHa8gZL1YfkJyMjxV3j24z1H-RtqU7TReYY'
  const parser = new PublicGoogleSheetsParser(spreadsheetId)
  return await parser.parse();
};
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

      <p className="mt-4 text-lg font-semibold">Carregando dados...</p>
    </div>
  );
};


const App = () => {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    function formatData(dataPoints) {
      return dataPoints.map((e) => {
        e.links = e.links ? e.links.split(";").map((l) => {
          let [texto, url] = l.split(':');
          return { texto: texto || "", url };
        }) : [];

        e.imagens = e.imagens ? e.imagens.split(",") : [];
        return e;
      });
    }

    initializeApp();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Erro: {error}</div>;
  }

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