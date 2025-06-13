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
import EditLocationPanel from './components/EditLocationPanel';
import TerrasIndigenas from './components/TerrasIndigenas';
import Marcadores from './components/Marcadores';
import { useShare } from './components/hooks/useShare';
import './App.css';

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/escolasindigenas/favicon.ico" alt="Ícone de carregamento" className="w-8 h-8" />
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
      console.log("Tentando buscar o arquivo CSV em:", `${process.env.PUBLIC_URL}/escolas_indigenas_SP_inep.csv`);
      const response = await fetch(`${process.env.PUBLIC_URL}/escolas_indigenas_SP_inep.csv`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      console.log("Conteúdo do CSV (primeiros 200 caracteres):", csvText.substring(0, 200));
      
      // Verifica se o conteúdo é realmente um CSV
      if (!csvText.includes(',')) {
        console.error("Conteúdo recebido:", csvText);
        throw new Error('O arquivo retornado não é um CSV válido');
      }
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          transform: (value) => value.trim(),
          complete: (results) => {
            console.log("Resultado do parse:", results);
            if (!results.data || results.data.length === 0) {
              reject(new Error("Nenhum dado encontrado no CSV"));
              return;
            }
            
            // Verifica se as colunas necessárias existem
            const firstRow = results.data[0];
            console.log("Primeira linha:", firstRow);
            
            const requiredColumns = ['Escola', 'Município', 'Latitude', 'Longitude'];
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
          return null;
        }

        // Coordenadas
        let latitude = null;
        let longitude = null;
        
        if (e.Latitude && e.Longitude) {
          // Remove pontos e converte para número
          const lat = e.Latitude.toString().replace(/\./g, '');
          const lng = e.Longitude.toString().replace(/\./g, '');
          
          // Converte para o formato decimal correto (divide por 10^7)
          latitude = parseFloat(lat) / 10000000;
          longitude = parseFloat(lng) / 10000000;

          console.log(`Coordenadas convertidas para ${e.Escola}:`, {
            original: { lat: e.Latitude, lng: e.Longitude },
            convertido: { lat: latitude, lng: longitude }
          });
        }

        // Só inclui o ponto se tiver coordenadas válidas
        if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Ponto sem coordenadas válidas: ${e.Escola || 'Título não disponível'}`);
          return null;
        }

        // Validação adicional das coordenadas
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          console.warn(`Coordenadas fora do intervalo válido para ${e.Escola}:`, { latitude, longitude });
          return null;
        }

        const ponto = {
          titulo: e.Escola || "Título não disponível",
          descricao: `${e.Município || ''} - ${e['Terra Indigena (TI)'] || ''}`.trim(),
          latitude: latitude,
          longitude: longitude,
          tipo: "educacao",
          pontuacao: 100,
          pontuacaoPercentual: 100,
          // Adicionando todos os campos do CSV
          ...e,
          // Campos específicos para exibição
          povos_indigenas: e['Povos indigenas'] || '',
          linguas_faladas: e['Linguas faladas'] || '',
          modalidade_ensino: e['Modalidade de Ensino/turnos de funcionamento'] || '',
          numero_alunos: e['Numero de alunos'] || '',
          infraestrutura: e['Espaço escolar e estrutura'] || '',
          acesso_internet: e['Acesso à internet'] || 'Não',
          equipamentos: e['Equipamentos Tecnológicos (Computadores, tablets e impressoras)'] || ''
        };

        console.log(`Registro ${index} formatado com coordenadas:`, {
          titulo: ponto.titulo,
          latitude: ponto.latitude,
          longitude: ponto.longitude,
          tipo: ponto.tipo
        });
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
    <div className="min-h-screen flex flex-col">
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
        <Route path="/edit/:id" element={<EditLocationPanel />} />
        <Route path="/terras" element={<TerrasIndigenas />} />
        <Route path="/marcadores" element={<Marcadores />} />
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