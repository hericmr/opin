import React, { useState, useEffect } from "react";
import PublicGoogleSheetsParser from 'public-google-sheets-parser'

import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar"; 
import PainelInformacoes from "./components/PainelInformacoes";

//carrega os dados da planilha
const fetchDataPoints = async () => {
  const spreadsheetId = '10h3GnQFWcHa8gZL1YfkJyMjxV3j24z1H-RtqU7TReYY'
  const parser = new PublicGoogleSheetsParser(spreadsheetId)
  return await parser.parse();
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

      //estrutura os campos de links e imagens para facilitar seu consumo
      function formatData(dataPoints) {
        dataPoints = dataPoints.map((e) => {
          if (e.links) {
            e.links = e.links.split(";").map((l) => {
              let linkResult = { texto: "", url: "" };
              let linkFields = l.split(':');
              if (linkFields.length > 1) {
                linkResult.texto = linkFields[0];
                linkResult.url = linkFields[1];
              } else {
                linkResult.url = linkFields[0];
              }
              return linkResult;
            });
          } else {
            e.links = [];
          }

          if (e.imagens) {
            e.imagens = e.imagens.split(",");
          } else {
            e.imagens = [];
          }

          return e;
        });
        return dataPoints;
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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