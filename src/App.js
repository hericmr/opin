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
      console.log("=== DEBUG: Iniciando busca de dados do Supabase ===");
      console.log("Tentando buscar dados da tabela 'escolas_completa'...");
      
      const { data, error } = await supabase
        .from('escolas_completa')
        .select('*');

      if (error) {
        console.error("=== DEBUG: Erro ao buscar dados ===", {
          codigo: error.code,
          mensagem: error.message,
          detalhes: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log("=== DEBUG: Resposta do Supabase ===", {
        dadosRecebidos: data ? "Sim" : "Não",
        quantidadeRegistros: data?.length || 0,
        primeiroRegistro: data?.[0] ? {
          id: data[0].id,
          titulo: data[0].titulo,
          tipo: data[0].tipo,
          latitude: data[0].latitude,
          longitude: data[0].longitude
        } : "Nenhum registro"
      });

      if (!data || data.length === 0) {
        console.warn("=== DEBUG: Nenhum dado encontrado na tabela 'escolas_completa' ===");
        return [];
      }

      return data;
    } catch (error) {
      console.error("=== DEBUG: Erro ao buscar dados do Supabase ===", error);
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
        let latitude = parseFloat(e.Latitude);
        let longitude = parseFloat(e.Longitude);

        // Só inclui o ponto se tiver coordenadas válidas (não nulas e não NaN)
        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Ponto sem coordenadas válidas: ${e.Escola}`, {
            latitude: e.Latitude,
            longitude: e.Longitude
          });
          return null;
        }

        const ponto = {
          // Informações básicas
          titulo: e.Escola,
          municipio: e["Município"],
          endereco: e["Endereço"],
          terra_indigena: e["Terra Indigena (TI)"],
          tipo_escola: e["Escola Estadual ou Municipal"],
          parcerias_municipio: e["Parcerias com o município"],
          diretoria_ensino: e["Diretoria de Ensino"],
          
          // Informações sobre povos e línguas
          povos_indigenas: e["Povos indigenas"],
          linguas_faladas: e["Linguas faladas"],
          
          // Informações sobre a escola
          ano_criacao: e["Ano de criação da escola"],
          modalidade_ensino: e["Modalidade de Ensino/turnos de funcionamento"],
          numero_alunos: e["Numero de alunos"],
          
          // Infraestrutura
          espaco_escolar: e["Espaço escolar e estrutura"],
          cozinha_merenda: e["Cozinha/Merenda escolar/diferenciada"],
          acesso_agua: e["Acesso à água"],
          coleta_lixo: e["Tem coleta de lixo?"],
          acesso_internet: e["Acesso à internet"],
          equipamentos: e["Equipamentos Tecnológicos (Computadores, tablets e impressoras)"],
          modo_acesso: e["Modo de acesso à escola"],
          
          // Gestão e professores
          gestao: e["Gestão/Nome"],
          outros_funcionarios: e["Outros funcionários"],
          professores_indigenas: e["Quantidade de professores indígenas"],
          professores_nao_indigenas: e["Quantidade de professores não indígenas"],
          professores_falam_lingua: e["Professores falam a língua indígena?"],
          formacao_professores: e["Formação dos professores"],
          formacao_continuada: e["Formação continuada oferecida"],
          
          // Projeto Pedagógico
          ppp_proprio: e["A escola possui PPP próprio?"],
          ppp_comunidade: e["PPP elaborado com a comunidade?"],
          disciplinas_bilingues: e["Disciplinas bilíngues?"],
          material_nao_indigena: e["Material pedagógico não indígena"],
          material_indigena: e["Material pedagógico indígena"],
          praticas_pedagogicas: e["Práticas pedagógicas indígenas"],
          formas_avaliacao: e["Formas de avaliação"],
          
          // Projetos e parcerias
          projetos_andamento: e["Projetos em andamento"],
          parcerias_universidades: e["Parcerias com universidades?"],
          acoes_ongs: e["Ações com ONGs ou coletivos?"],
          desejos_comunidade: e["Desejos da comunidade para a escola"],
          
          // Redes sociais e mídia
          usa_redes_sociais: e["Escola utiliza redes sociais?"],
          links_redes_sociais: e["Links das redes sociais"],
          historia_aldeia: e["historia da aldeia"],
          
          // Coordenadas
          latitude: latitude,
          longitude: longitude,
          
          // Campos adicionais do Supabase
          id: e.id,
          links: e.links,
          imagens: e.imagens,
          audio: e.audio,
          video: e.video,
          
          // Campos para o mapa
          tipo: 'educacao', // Definindo como educação por padrão
          pontuacao: 100,
          pontuacaoPercentual: 100
        };

        console.log(`Registro ${index} formatado:`, {
          titulo: ponto.titulo,
          latitude: ponto.latitude,
          longitude: ponto.longitude
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
          console.warn("Nenhum dado encontrado na tabela 'escolas_completa'.");
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

  // Adicionar função para buscar location pelo ID
  const getLocationById = (id) => {
    if (!dataPoints) return {};
    const location = dataPoints.find(point => point.id === parseInt(id));
    return location || {};
  };

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
                    : dataPoints.filter(point => point.pontuacao >= 0) // Caso contrário, filtra por pontuação mínima de 20%
                } 
              />
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
        <Route 
          path="/edit/:id" 
          element={
            <EditLocationPanel 
              location={getLocationById(new URLSearchParams(location.search).get('id'))}
              onClose={() => navigate('/')}
              onSave={() => {
                navigate('/');
                window.location.reload();
              }}
            />
          } 
        />
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