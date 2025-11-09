import React, { useState, Suspense } from "react";
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
import { useEscolasData } from './hooks/useEscolasData';
import { MetaTagsDetector } from './components/MetaTags';

// Expose dev helpers in browser console (no UI impact)
// (dev helpers removed)

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
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Verificação inicial síncrona da URL para evitar flash da navbar
  // Isso é crítico para quando a página é acessada diretamente pela URL
  const initialIsDashboardRoute = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    // Verifica a URL atual da janela imediatamente
    const windowPath = window.location.pathname;
    const normalizedWindowPath = windowPath.replace(/^\/opin/, '').replace(/\/$/, '');
    
    // Verifica se é uma rota de dashboard
    if (normalizedWindowPath === '/dashboard' || 
        normalizedWindowPath === '/painel-dados' || 
        normalizedWindowPath === '/dados-escolas-indigenas' ||
        normalizedWindowPath.startsWith('/dashboard/') ||
        windowPath.includes('/dashboard/')) {
      return true;
    }
    
    // Verifica se há uma rota inicial definida
    if (window.__INITIAL_ROUTE__) {
      const initialRoute = window.__INITIAL_ROUTE__.replace(/\/$/, '');
      if (initialRoute === '/dashboard' || 
          initialRoute === '/painel-dados' || 
          initialRoute === '/dados-escolas-indigenas') {
        return true;
      }
    }
    
    return false;
  }, []); // Sem dependências - calcula apenas uma vez no mount
  
  // Força atualização quando a página carrega para detectar rotas corretamente
  React.useEffect(() => {
    // Pequeno delay para garantir que window.location está disponível
    const timer = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  
  // Verificação mais robusta de rotas do dashboard
  // Combina verificação inicial com verificação dinâmica
  // IMPORTANTE: Verifica PRIMEIRO a URL da janela para evitar flash da navbar
  const isDashboardRoute = React.useMemo(() => {
    // Se a verificação inicial já detectou dashboard, retorna true imediatamente
    if (initialIsDashboardRoute) {
      return true;
    }
    // PRIORIDADE 1: Verifica a URL atual da janela (mais confiável no carregamento inicial)
    // Isso é crítico para evitar que a navbar apareça quando acessado diretamente pela URL
    if (typeof window !== 'undefined' && window.location) {
      const windowPath = window.location.pathname;
      // Remove o basename se presente e normaliza
      const normalizedWindowPath = windowPath.replace(/^\/opin/, '').replace(/\/$/, '');
      
      // Verifica se a URL contém dashboard (incluindo /dashboard/ para páginas estáticas)
      if (normalizedWindowPath === '/dashboard' || 
          normalizedWindowPath === '/painel-dados' || 
          normalizedWindowPath === '/dados-escolas-indigenas' ||
          normalizedWindowPath.startsWith('/dashboard/') ||
          windowPath.includes('/dashboard/')) {
        return true;
      }
    }
    
    // PRIORIDADE 2: Verifica se há uma rota inicial definida (para página estática)
    if (typeof window !== 'undefined' && window.__INITIAL_ROUTE__) {
      const initialRoute = window.__INITIAL_ROUTE__.replace(/\/$/, '');
      if (initialRoute === '/dashboard' || 
          initialRoute === '/painel-dados' || 
          initialRoute === '/dados-escolas-indigenas') {
        return true;
      }
    }
    
    // PRIORIDADE 3: Verifica o pathname do React Router (quando disponível)
    const routerPath = location?.pathname?.replace(/\/$/, '') || '';
    
    // Verifica rotas diretas do dashboard
    if (routerPath === '/dashboard' || 
        routerPath === '/painel-dados' || 
        routerPath === '/dados-escolas-indigenas' ||
        routerPath.startsWith('/dashboard/')) {
      return true;
    }
    
    return false;
  }, [location?.pathname, forceUpdate]);
  
  const isMapRoute = React.useMemo(() => {
    const routerPath = location?.pathname?.replace(/\/$/, '') || '';
    return routerPath.includes('/mapa');
  }, [location?.pathname]);

  // Verifica se há uma rota inicial definida (para o dashboard estático)
  React.useEffect(() => {
    if (window.__INITIAL_ROUTE__) {
      const initialRoute = window.__INITIAL_ROUTE__;
      // Limpa a variável global
      delete window.__INITIAL_ROUTE__;
      
      // Aguarda um pouco para garantir que o Router esteja totalmente inicializado
      const timer = setTimeout(() => {
        // Verifica se já estamos na rota correta
        const currentPath = location.pathname.replace(/\/$/, ''); // Remove barra final
        const targetPath = initialRoute.replace(/\/$/, ''); // Remove barra final
        
        if (currentPath !== targetPath && !currentPath.includes(targetPath)) {
          // Navega para a rota inicial usando React Router (sem reload)
          navigate(initialRoute, { replace: true });
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, location.pathname]);

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
      
      {/* Navbar só aparece se NÃO for rota de mapa E NÃO for rota de dashboard */}
      {/* Verificação dupla para garantir que não apareça quando acessado diretamente */}
      {!isMapRoute && !isDashboardRoute && (
        <Navbar 
          onConteudoClick={() => navigate('/conteudo')} 
          dataPoints={dataPoints} 
          openPainelFunction={openPainelFunction} 
        />
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
                <Homepage dataPoints={dataPoints} />
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
  return (
    <>
      <SkipLink targetId="main-content" />
      <AppContent />
    </>
  );
}

const App = () => {
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