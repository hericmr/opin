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
import GlobalAdminShortcut from './components/GlobalAdminShortcut';

// Expose dev helpers in browser console (no UI impact)
// (dev helpers removed)

// Import routes configuration
import { createRoutes } from "./router";

// Componente para restaurar o scroll ao topo em cada mudança de rota
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { dataPoints, loading, error } = useEscolasData();
  const [openPainelFunction, setOpenPainelFunction] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isMapRoute = React.useMemo(() => {
    const routerPath = location?.pathname?.replace(/\/$/, '') || '';
    return routerPath.includes('/mapa');
  }, [location.pathname]);

  // Verificação para rotas que usam navbar integrada no Hero (showNavbar={true})
  const isHeroNavbarRoute = React.useMemo(() => {
    // Verifica a URL atual da janela primeiro
    if (typeof window !== 'undefined' && window.location) {
      const windowPath = window.location.pathname;
      const normalizedWindowPath = windowPath.replace(/^\/opin/, '').replace(/\/$/, '');
      
      if (normalizedWindowPath === '/conteudo' || 
          normalizedWindowPath === '/algunsdados' || 
          normalizedWindowPath === '/painel-dados' || 
          normalizedWindowPath === '/dados-escolas-indigenas') {
        return true;
      }
    }
    
    // Verifica o pathname do React Router
    const routerPath = location?.pathname?.replace(/\/$/, '') || '';
    return routerPath === '/conteudo' || 
           routerPath === '/algunsdados' || 
           routerPath === '/painel-dados' || 
           routerPath === '/dados-escolas-indigenas';
  }, [location?.pathname]);

  // Handler para redirecionamento do GitHub Pages (404.html)
  React.useEffect(() => {
    const githubPagesRedirect = sessionStorage.getItem('githubPagesRedirect');
    if (githubPagesRedirect) {
      sessionStorage.removeItem('githubPagesRedirect');
      const [path, ...rest] = githubPagesRedirect.split('?');
      const queryString = rest.length > 0 ? '?' + rest.join('?') : '';
      const fullPath = path + queryString;
      
      const timer = setTimeout(() => {
        const currentPath = location.pathname.replace(/\/$/, '');
        const targetPath = path.replace(/\/$/, '');
        if (currentPath !== targetPath) {
          navigate(fullPath, { replace: true });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, location.pathname]);

  const handlePainelOpenFunction = React.useCallback((openPainelFn) => {
    setOpenPainelFunction(() => openPainelFn);
  }, []);

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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <ScrollToTop />
      <MetaTagsDetector dataPoints={dataPoints} />
      
      {!isMapRoute && !isHeroNavbarRoute && (
        <Navbar 
          onConteudoClick={() => navigate('/conteudo')} 
          dataPoints={dataPoints} 
          openPainelFunction={openPainelFunction} 
        />
      )}

      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-white/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
             <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-green-800 font-medium text-sm">Carregando...</p>
          </div>
        </div>
      }>
        <Routes>
          {createRoutes(dataPoints, loading, handlePainelOpenFunction).map((route, index) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

function AppRoutes() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <GlobalAdminShortcut />
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