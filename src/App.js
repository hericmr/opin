import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from './supabaseClient';
import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar";
import PainelInformacoes from "./components/PainelInformacoes";
import AddLocationButton from "./components/AddLocationButton";
import ConteudoCartografia from "./components/ConteudoCartografia";
import AdminPanel from "./components/AdminPanel";
import Papa from 'papaparse';

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

const AppContent = () => {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDataPoints = async () => {
    try {
      const response = await fetch('/cartografiasocial/escolas.csv');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();
      
      // Verifica se o conteúdo é realmente um CSV
      if (csvText.includes('<!DOCTYPE html>')) {
        throw new Error('O arquivo retornado não é um CSV válido');
      }
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          transform: (value) => value.trim(),
          complete: (results) => {
            if (!results.data || results.data.length === 0) {
              reject(new Error("Nenhum dado encontrado no CSV"));
              return;
            }
            
            // Verifica se as colunas necessárias existem
            const firstRow = results.data[0];
            const requiredColumns = ['Escola', 'Latitude', 'Longitude'];
            const missingColumns = requiredColumns.filter(col => !(col in firstRow));
            
            if (missingColumns.length > 0) {
              reject(new Error(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`));
              return;
            }
            
            console.log("Dados do CSV carregados:", results.data);
            resolve(results.data);
          },
          error: (error) => {
            console.error("Erro ao processar CSV:", error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error("Erro ao buscar arquivo CSV:", error);
      throw error;
    }
  };

  const formatData = (dataPoints) => {
    console.log("Iniciando formatação dos dados...");
    console.log("Número total de registros:", dataPoints.length);
    
    const formattedData = dataPoints
      .filter(e => {
        if (!e || typeof e !== 'object' || Array.isArray(e)) {
          console.warn("Registro inválido:", e);
          return false;
        }
        return true;
      })
      .map((e, index) => {
      console.log(`Formatando registro ${index}:`, e);

        // Verifica se as propriedades necessárias existem
        if (!e.Escola) {
          console.warn(`Registro ${index} sem nome da escola:`, e);
        }

      // Coordenadas
        let latitude = null;
        let longitude = null;
        
        if (e.Latitude && e.Longitude) {
          const lat = e.Latitude.toString().trim();
          const lng = e.Longitude.toString().trim();
          
          if (!isNaN(lat) && !isNaN(lng) && lat !== "" && lng !== "") {
            latitude = parseFloat(lat);
            longitude = parseFloat(lng);
          }
        }

        // Só inclui o ponto se tiver coordenadas válidas
        if (latitude === null || longitude === null) {
          console.warn(`Ponto sem coordenadas válidas: ${e.Escola || 'Título não disponível'}`);
          return null;
        }

        const ponto = {
          titulo: e.Escola || "Título não disponível",
          descricao: `${e.Endereço || ''} - ${e.Município || ''}, ${e.UF || ''}${e.Telefone ? ` - Tel: ${e.Telefone}` : ''}`.trim(),
          latitude: latitude,
          longitude: longitude,
          tipo: "educação",
          pontuacao: 40,
          pontuacaoPercentual: 100,
          // Adicionando todos os campos do CSV
          Escola: e.Escola,
          Endereço: e.Endereço,
          Município: e.Município,
          UF: e.UF,
          Telefone: e.Telefone,
          'Dependência Administrativa': e['Dependência Administrativa'],
          'Etapas e Modalidade de Ensino Oferecidas': e['Etapas e Modalidade de Ensino Oferecidas'],
          'Código INEP': e['Código INEP'],
          Localização: e.Localização,
          'Localidade Diferenciada': e['Localidade Diferenciada']
        };

        console.log(`Registro ${index} formatado:`, ponto);
        return ponto;
      })
      .filter(ponto => ponto !== null);
    
    console.log("Formatação concluída. Número de pontos válidos:", formattedData.length);
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
    <div className="App">
      <Navbar onConteudoClick={() => navigate('/conteudo')} />
      <Routes>
        <Route 
          path="/" 
          element={
            <main className="flex-grow">
              <MapaSantos 
                dataPoints={
                  new URLSearchParams(location.search).get('panel')
                    ? dataPoints // Se houver um panel na URL, mostra todos os pontos
                    : dataPoints.filter(point => point.pontuacao >= 70) // Caso contrário, filtra por pontuação
                } 
              />
              <PainelInformacoes dataPoints={dataPoints} />
              <AddLocationButton onLocationAdded={handleLocationAdded} />
            </main>
          } 
        />
        <Route 
          path="/conteudo" 
          element={<ConteudoCartografia locations={dataPoints} />} 
        />
        <Route 
          path="/admin" 
          element={<AdminPanel />} 
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/escolasindigenas">
      <AppContent />
    </Router>
  );
};

export default App;