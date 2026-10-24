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
import { EscolasProvider } from './contexts/EscolasContext';
import { MetaTagsDetector } from './components/MetaTags';
import GlobalAdminShortcut from './components/GlobalAdminShortcut';
import GlobalSpinner from './components/GlobalSpinner';
import InstallPrompt from './components/InstallPrompt';
import CanonicalLink from './components/CanonicalLink';

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

  const isHeroNavbarRoute = React.useMemo(() => {
    const routerPath = location?.pathname?.replace(/\/$/, '') || '';
    return routerPath === '/conteudo' ||
           routerPath === '/jogos' ||
           routerPath === '/algunsdados' ||
           routerPath === '/painel-dados' ||
           routerPath === '/dados-escolas-indigenas' ||
           routerPath === '/search' ||
           routerPath === '/sobre' ||
           routerPath === '/escolas' ||
           routerPath.startsWith('/historia') ||
           routerPath.startsWith('/lindiflix') ||
           routerPath.startsWith('/escola') ||
           routerPath.startsWith('/galeria');
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

  const [bannerDismissed, setBannerDismissed] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <GlobalSpinner />
      </div>
    );
  }

  const effectiveDataPoints = error ? [] : dataPoints;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <ScrollToTop />
      <CanonicalLink />
      <MetaTagsDetector dataPoints={effectiveDataPoints} />

      {import.meta.env.DEV && error && !bannerDismissed && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-amber-50 border border-amber-300 text-amber-800 text-xs px-4 py-2 rounded-lg shadow-md">
          <span>Banco de dados não disponível. Verifique as variáveis <code className="font-mono bg-amber-100 px-1 rounded">VITE_API_URL</code> e <code className="font-mono bg-amber-100 px-1 rounded">VITE_API_ANON_KEY</code> no <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code>.</span>
          <button onClick={() => setBannerDismissed(true)} className="text-amber-600 hover:text-amber-900 font-bold">✕</button>
        </div>
      )}

      {!isMapRoute && !isHeroNavbarRoute && (
        <Navbar
          onConteudoClick={() => navigate('/conteudo')}
          dataPoints={effectiveDataPoints}
          openPainelFunction={openPainelFunction}
        />
      )}

      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-white/50 backdrop-blur-sm transition-opacity duration-300">
          <GlobalSpinner />
        </div>
      }>
        <Routes>
          {createRoutes(effectiveDataPoints, loading, handlePainelOpenFunction).map((route, index) => (
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
      <InstallPrompt />
    </>
  );
}

const App = () => {
  return (
    <HelmetProvider>
      <ToastProvider>
        <SearchProvider>
          <RefreshProvider>
            <EscolasProvider>
              <Router basename="/">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </Router>
            </EscolasProvider>
          </RefreshProvider>
        </SearchProvider>
      </ToastProvider>
    </HelmetProvider>
  );
};

export default App;