import React, { useState, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SearchProvider } from "./contexts/SearchContext";
import { RefreshProvider } from "./contexts/RefreshContext";
import Navbar from "./components/Navbar";
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

// Novos componentes de melhoria
import ToastProvider from './components/Toast';
import { SkipLink } from './components/Accessibility';
import WelcomeModal from './components/WelcomeModal';
import { useEscolasData } from './hooks/useEscolasData';
import { MetaTagsDetector } from './components/MetaTags';
import TutorialMapa from './components/TutorialMapa';
import { useTutorial } from './hooks/useTutorial';

// Lazy loading dos componentes
const MapaEscolasIndigenas = React.lazy(() => import("./components/MapaEscolasIndigenas"));
const Homepage = React.lazy(() => import("./components/Homepage"));
const MateriaisDidáticos = React.lazy(() => import("./components/MateriaisDidáticos/MateriaisDidáticos"));
const AdminPanel = React.lazy(() => import("./components/AdminPanel"));
const SearchResults = React.lazy(() => import("./components/SearchResults"));
const TestLegendas = React.lazy(() => import("./components/TestLegendas"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));

const AppContent = () => {
  const { dataPoints, loading, error } = useEscolasData();
  const [openPainelFunction, setOpenPainelFunction] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMapRoute = location?.pathname?.includes('/mapa');

  const handlePainelOpenFunction = (openPainelFn) => {
    setOpenPainelFunction(() => openPainelFn);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <p className="text-green-800">Carregando...</p>
        </div>
      </div>
    );
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
      {/* Meta tags automáticas para escolas específicas */}
      <MetaTagsDetector dataPoints={dataPoints} />
      
      {!isMapRoute && (
        <Navbar onConteudoClick={() => navigate('/conteudo')} dataPoints={dataPoints} openPainelFunction={openPainelFunction} />
      )}
      <Suspense fallback={
        loading ? null : (
          <div className="flex items-center justify-center p-8 bg-green-50">
            <div className="text-center">
              <p className="text-green-800">Carregando...</p>
            </div>
          </div>
        )
      }>
        <Routes>
          <Route 
            path="/" 
            element={
              <main id="main-content" className="flex-grow">
                <Homepage />
              </main>
            } 
          />
          <Route 
            path="/mapa" 
            element={
              <main id="main-content" className="flex-grow">
                <MapaEscolasIndigenas 
                  dataPoints={dataPoints}
                  onPainelOpen={handlePainelOpenFunction}
                  isLoading={loading}
                />
              </main>
            } 
          />
          <Route 
            path="/conteudo" 
            element={
              <main id="main-content" className="flex-grow">
                <MateriaisDidáticos locations={dataPoints} />
              </main>
            } 
          />
          <Route 
            path="/search" 
            element={
              <main id="main-content" className="flex-grow">
                <SearchResults dataPoints={dataPoints} />
              </main>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <main id="main-content" className="flex-grow">
                <AdminPanel />
              </main>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <main id="main-content" className="flex-grow" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                <Dashboard />
              </main>
            } 
          />
          <Route 
            path="/painel-dados" 
            element={
              <main id="main-content" className="flex-grow" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                <Dashboard />
              </main>
            } 
          />
          <Route 
            path="/dados-escolas-indigenas" 
            element={
              <main id="main-content" className="flex-grow" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                <Dashboard />
              </main>
            } 
          />
          <Route path="/test-legendas" element={<TestLegendas />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function AppRoutes() {
  const location = useLocation();
  const { isTutorialRunning, completeTutorial, skipTutorial, startTutorial } = useTutorial();
  
  // Verificar se há parâmetro 'panel' na URL (Slugify)
  const urlParams = new URLSearchParams(location.search);
  const hasPanelParam = urlParams.get('panel');
  
  // Slugs/paths para os quais NÃO deve mostrar o modal
  const slugsSemModal = [
    "/slug-exemplo", // adicione outros slugs aqui
  ];
  
  // Esconde o modal se:
  // 1. Há um parâmetro 'panel' na URL (Slugify)
  // 2. Algum slug da lista for prefixo do path
  const hideWelcomeModal = hasPanelParam || slugsSemModal.some(slug => location.pathname.startsWith(slug));

  // Expor função para iniciar tutorial (usado pela Navbar e WelcomeModal)
  useEffect(() => {
    window.startTutorial = startTutorial;
    return () => {
      delete window.startTutorial;
    };
  }, [startTutorial]);

  return (
    <>
      <SkipLink targetId="main-content" />
      {!hideWelcomeModal && <WelcomeModal onStartTutorial={startTutorial} />}
      <TutorialMapa 
        isRunning={isTutorialRunning} 
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
      <AppContent />
    </>
  );
}

const App = () => {
  // Verifica se há uma rota inicial definida (para o dashboard)
  React.useEffect(() => {
    if (window.__INITIAL_ROUTE__) {
      const initialRoute = window.__INITIAL_ROUTE__;
      // Limpa a variável global
      delete window.__INITIAL_ROUTE__;
      // Navega para a rota inicial após um pequeno delay para garantir que o router esteja pronto
      setTimeout(() => {
        window.history.replaceState({}, '', `/opin${initialRoute}`);
        window.location.reload();
      }, 100);
    }
  }, []);

  return (
    <HelmetProvider>
      <ToastProvider>
        <SearchProvider>
          <RefreshProvider>
            <Router basename="/opin">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Router>
          </RefreshProvider>
        </SearchProvider>
      </ToastProvider>
    </HelmetProvider>
  );
};

export default App;