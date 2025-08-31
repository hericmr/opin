import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { SearchProvider } from "./contexts/SearchContext";
import { RefreshProvider } from "./contexts/RefreshContext";
import Navbar from "./components/Navbar";
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

// Novos componentes de melhoria
import ToastProvider from './components/Toast';
import { SkipLink } from './components/Accessibility';
import WelcomeModal from './components/WelcomeModal';
import LoadingScreen from './components/LoadingScreen';
import { useEscolasData } from './hooks/useEscolasData';

// Lazy loading dos componentes
const MapaEscolasIndigenas = React.lazy(() => import("./components/MapaEscolasIndigenas"));
const BibliotecaEducacionalIndigena = React.lazy(() => import("./components/BibliotecaEducacionalIndigena"));
const AdminPanel = React.lazy(() => import("./components/AdminPanel"));
const SearchResults = React.lazy(() => import("./components/SearchResults"));
const TestLegendas = React.lazy(() => import("./components/TestLegendas"));

const AppContent = () => {
  const { dataPoints, loading, error } = useEscolasData();
  const [openPainelFunction, setOpenPainelFunction] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePainelOpenFunction = (openPainelFn) => {
    setOpenPainelFunction(() => openPainelFn);
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
      <Navbar onConteudoClick={() => navigate('/conteudo')} dataPoints={dataPoints} openPainelFunction={openPainelFunction} />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route 
            path="/" 
            element={
              <main id="main-content" className="flex-grow">
                <MapaEscolasIndigenas 
                  dataPoints={dataPoints}
                  onPainelOpen={handlePainelOpenFunction}
                />
              </main>
            } 
          />
          <Route 
            path="/conteudo" 
            element={
              <main id="main-content" className="flex-grow">
                <BibliotecaEducacionalIndigena locations={dataPoints} />
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
          <Route path="/test-legendas" element={<TestLegendas />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function AppRoutes() {
  const location = useLocation();
  
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

  return (
    <>
      <SkipLink targetId="main-content" />
      {!hideWelcomeModal && <WelcomeModal />}
      <AppContent />
    </>
  );
}

const App = () => {
  return (
    <ToastProvider>
      <SearchProvider>
        <RefreshProvider>
          <Router basename="/escolasindigenas">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </Router>
        </RefreshProvider>
      </SearchProvider>
    </ToastProvider>
  );
};

export default App;