import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../hooks/useAuth';
import { useBreakpoint } from '../../hooks/responsive/useBreakpoint';
import { Leaf, Shield } from 'lucide-react';
import NavButtons from '../Navbar/NavButtons';
import SearchBar from '../Navbar/SearchBar';
import MinimalLoginModal from '../Auth/MinimalLoginModal';

const PageHeader = ({ 
  title, 
  description, 
  titleFontFamily = 'PapakiloLight, sans-serif',
  titleSize = 'text-4xl md:text-5xl lg:text-6xl',
  descriptionSize = 'text-sm md:text-base',
  className = '',
  children,
  showShareButtons = true,
  showNavbar = false,
  dataPoints = [],
  openPainelFunction = null
}) => {
  const heroImageUrl = `${import.meta.env.BASE_URL || '/opin'}/hero.png`;
  const contentRef = React.useRef(null);
  const searchBarRef = React.useRef(null);
  const [containerHeight, setContainerHeight] = React.useState('auto');
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSearch } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();
  const { width } = useBreakpoint();
  
  const isMobileLandscape = React.useMemo(() => {
    return width <= 1024 && width > window.innerHeight;
  }, [width]);
  
  const isConteudoPage = React.useMemo(() => location.pathname === '/conteudo', [location.pathname]);
  const isSearchPage = React.useMemo(() => location.pathname === '/search', [location.pathname]);
  const isAdminPage = React.useMemo(() => location.pathname === '/admin', [location.pathname]);
  const isPainelPage = React.useMemo(() => 
    location.pathname === '/dashboard' || 
    location.pathname === '/painel-dados' || 
    location.pathname === '/dados-escolas-indigenas',
    [location.pathname]
  );
  
  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
    navigate('/admin');
  };

  const handleSearch = (searchTerm, coordinates = null) => {
    if (coordinates) {
      setSearch(searchTerm, coordinates, searchTerm);
      navigate('/mapa', { 
        state: { 
          searchTerm, 
          coordinates,
          highlightSchool: searchTerm 
        } 
      });
    } else {
      setSearch(searchTerm);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleResultClick = (result) => {
    if (openPainelFunction && result.data) {
      openPainelFunction(result.data);
      if (location.pathname !== '/mapa') {
        navigate('/mapa');
      }
    } else if (result.coordinates) {
      setSearch(result.title, result.coordinates, result.title);
      navigate('/mapa', { 
        state: { 
          searchTerm: result.title, 
          coordinates: result.coordinates,
          highlightSchool: result.title 
        } 
      });
    } else {
      setSearch(result.title);
      navigate(`/search?q=${encodeURIComponent(result.title)}`);
    }
  };
  
  const updateHeight = React.useCallback(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      setContainerHeight(`${height}px`);
    }
  }, []);
  
  React.useEffect(() => {
    updateHeight();
    
    // Recalcular quando a janela for redimensionada
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [updateHeight, title, description, children]);
  
  return (
    <div 
      className={`text-white shadow-lg relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `url('${heroImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: containerHeight,
        zIndex: 10 // Garantir que fique acima de outros elementos, mas abaixo da navbar se ela aparecer
      }}
    >
      {/* Overlay para melhorar legibilidade do texto */}
      <div className="absolute inset-0 bg-green-900/60"></div>
      <div ref={contentRef} className="relative z-10" style={{ paddingTop: showNavbar ? '0' : '80px', paddingBottom: '2rem' }}>
        {/* Navbar integrada no topo do hero - usando os mesmos espaçamentos da navbar original */}
        {showNavbar && (
          <div className="w-full max-w-none px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24">
            <div className="flex items-center justify-between py-1 sm:py-1.5 md:py-2">
                {/* Logo e título - Lado esquerdo */}
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0 flex-shrink">
                  <button
                    onClick={() => navigate('/')}
                    className="text-left hover:opacity-80 transition-opacity focus:outline-none focus:rounded"
                    aria-label="Ir para página inicial - OPIN"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <img 
                        src={`${import.meta.env.BASE_URL || '/opin'}/logo_index.png`}
                        alt="OPIN - Observatório dos Professores Indígenas"
                        className="h-6 sm:h-7 md:h-8 lg:h-10 xl:h-12 w-auto object-contain object-left"
                        style={{ display: 'block' }}
                      />
                      <div className="hidden sm:block w-px h-4 sm:h-6 md:h-8 bg-white/30 flex-shrink-0"></div>
                      <div className="hidden md:flex flex-col justify-center min-w-0">
                        <span className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl capitalize truncate" style={{fontFamily: 'Cinzel, serif'}}>
                          Observatório Dos Professores Indígenas
                        </span>
                        <p className="text-xs sm:text-sm text-white/80 normal-case truncate">
                          do Estado de São Paulo
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Menu Superior - Lado direito */}
                <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-sm">
                  {/* Botões de Navegação */}
                  <NavButtons
                    isConteudoPage={isConteudoPage}
                    isSearchPage={isSearchPage}
                    isAdminPage={isAdminPage}
                    isPainelPage={isPainelPage}
                    isMobileLandscape={isMobileLandscape}
                  />
                  
                  {/* Busca */}
                  <div ref={searchBarRef} className="flex items-center">
                    <SearchBar 
                      onSearch={handleSearch} 
                      onResultClick={handleResultClick}
                      isMobile={false} 
                      isMobileLandscape={isMobileLandscape}
                      dataPoints={dataPoints}
                    />
                  </div>
                  
                  {/* Logos */}
                  <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
                    <a 
                      href="https://unifesp.br/campus/san7/graduacao/cursos/licenciatura-intercultural-indigena" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={`${import.meta.env.BASE_URL || '/opin'}/lindi.svg`} 
                        alt="LINDI - Licenciatura Intercultural Indígena" 
                        className="h-12 xl:h-16 w-auto"
                      />
                    </a>
                    
                    <a 
                      href="https://unifesp.br" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={`${import.meta.env.BASE_URL || '/opin'}/logo.webp`} 
                        alt="UNIFESP" 
                        className="h-8 xl:h-12 w-auto"
                      />
                    </a>
                  </div>
                  
                  {/* Admin */}
                  <div className="flex items-center space-x-2">
                    {!isAuthenticated ? (
                      <button
                        onClick={handleAdminClick}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors focus:outline-none"
                        title="Acesso administrativo"
                        aria-label="Acesso administrativo"
                      >
                        <Leaf className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/80 hidden xl:inline" aria-live="polite">
                          Olá, {user?.username}
                        </span>
                        <button
                          onClick={() => navigate('/admin')}
                          className="p-1.5 rounded hover:bg-white/10 transition-colors focus:outline-none"
                          title="Painel administrativo"
                          aria-label="Painel administrativo"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={logout}
                          className="px-3 py-1.5 text-xs rounded hover:bg-white/10 transition-colors focus:outline-none"
                          aria-label="Sair"
                        >
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Título da Página - Estilo Native Land Digital */}
          <div className="mt-4">
            <h1 
              className={`text-white ${titleSize} uppercase leading-none text-center`} 
              style={{ fontFamily: titleFontFamily }}
            >
              {title}
            </h1>
          </div>
          
          {/* Conteúdo adicional opcional (breadcrumbs, etc) */}
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Login */}
      {showLoginModal && (
        <MinimalLoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default PageHeader;