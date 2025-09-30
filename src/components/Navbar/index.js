import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf, BookOpen, BarChart3, Shield } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../hooks/useAuth';
import MobileToggle from './MobileToggle';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import MinimalLoginModal from '../Auth/MinimalLoginModal';

const Navbar = ({ dataPoints, openPainelFunction }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearch } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();

  // Detectar se é mobile na horizontal
  useEffect(() => {
    const checkMobileLandscape = () => {
      setIsMobileLandscape(window.innerWidth <= 1024 && window.innerWidth > window.innerHeight);
    };

    checkMobileLandscape();
    window.addEventListener('resize', checkMobileLandscape);
    return () => window.removeEventListener('resize', checkMobileLandscape);
  }, []);

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

  const isConteudoPage = location.pathname === '/conteudo';
  const isSearchPage = location.pathname === '/search';
  const isAdminPage = location.pathname === '/admin';
  const isPainelPage = location.pathname === '/dashboard' || location.pathname === '/painel-dados' || location.pathname === '/dados-escolas-indigenas';
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSearch = (searchTerm, coordinates = null) => {
    console.log('Buscando por:', searchTerm);
    
    if (coordinates) {
      // Se temos coordenadas, navegar para o mapa e centralizar
      setSearch(searchTerm, coordinates, searchTerm);
      navigate('/', { 
        state: { 
          searchTerm, 
          coordinates,
          highlightSchool: searchTerm 
        } 
      });
    } else {
      // Busca simples - navegar para página de resultados ou filtrar
      setSearch(searchTerm);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleResultClick = (result) => {
    console.log('Resultado clicado:', result);
    console.log('openPainelFunction disponível:', !!openPainelFunction);
    console.log('result.data disponível:', !!result.data);
    
    // Se temos a função de abrir painel e o resultado tem dados da escola
    if (openPainelFunction && result.data) {
      console.log('Abrindo painel com dados:', result.data);
      // Abrir o painel de informações com os dados da escola
      openPainelFunction(result.data);
      // Navegar para o mapa se não estivermos lá
      if (location.pathname !== '/') {
        navigate('/');
      }
    } else if (result.coordinates) {
      console.log('Fallback: navegando para o mapa com coordenadas');
      // Fallback: navegar para o mapa e centralizar no ponto
      setSearch(result.title, result.coordinates, result.title);
      navigate('/', { 
        state: { 
          searchTerm: result.title, 
          coordinates: result.coordinates,
          highlightSchool: result.title 
        } 
      });
    } else {
      console.log('Fallback: navegando para página de busca');
      // Busca simples
      setSearch(result.title);
      navigate(`/search?q=${encodeURIComponent(result.title)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#215A36] text-white shadow-lg">
      {/* Header Principal - Estilo UNIFESP */}
      <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between py-2 sm:py-1 md:py-0.5">
          
          {/* Título do Projeto - Lado esquerdo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase leading-none" style={{fontFamily: 'PapakiloDecorative, sans-serif'}}>
                    OPIN
                  </h1>
                  <div className="w-px h-4 sm:h-6 md:h-8 bg-white/30"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl capitalize" style={{fontFamily: 'Cinzel, serif'}}>
                      Observatório Dos Professores Indígenas
                    </span>
                    <p className="text-xs sm:text-sm text-white/80 normal-case">
                      do Estado de São Paulo
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Menu Superior - Lado direito */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            {/* Busca */}
            <div className="flex items-center space-x-2">
              <SearchBar 
                onSearch={handleSearch} 
                onResultClick={handleResultClick}
                isMobile={false} 
                isMobileLandscape={isMobileLandscape}
                dataPoints={dataPoints}
              />
            </div>
            
            {/* Links de Navegação */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/conteudo')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isConteudoPage 
                    ? 'bg-green-600 text-white' 
                    : 'text-white hover:bg-green-700/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden xl:inline">Materiais</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isPainelPage 
                    ? 'bg-green-600 text-white' 
                    : 'text-white hover:bg-green-700/20'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden xl:inline">Painel de Dados</span>
              </button>
            </div>
            
            {/* Admin */}
            <div className="flex items-center space-x-2">
              
              {/* Admin Panel */}
              {!isAuthenticated ? (
                <button
                  onClick={handleAdminClick}
                  className="p-2 rounded hover:bg-green-700/20 transition-colors"
                  title="Acesso administrativo"
                >
                  <Leaf className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80 hidden xl:inline">
                    Olá, {user?.username}
                  </span>
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Shield className="w-3 h-3" />
                    <span className="hidden lg:inline">Admin</span>
                  </button>
                  <button
                    onClick={logout}
                    className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Sair"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
            
            {/* Logos - Por último */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <a 
                href="https://www.unifesp.br/lindi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <img 
                  src={`${process.env.PUBLIC_URL}/lindi.svg`} 
                  alt="LINDI - Licenciatura Intercultural Indígena" 
                  className="h-12 xl:h-16 w-auto"
                />
              </a>
              
              <a 
                href="https://www.unifesp.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <img 
                  src={`${process.env.PUBLIC_URL}/logo.webp`} 
                  alt="UNIFESP" 
                  className="h-8 xl:h-12 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Mobile - Botão hambúrguer */}
          <div className="lg:hidden">
            <MobileToggle 
              mobileMenuOpen={mobileMenuOpen} 
              toggleMobileMenu={toggleMobileMenu} 
              isMobileLandscape={isMobileLandscape} 
            />
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen}
        isConteudoPage={isConteudoPage}
        isSearchPage={isSearchPage}
        isAdminPage={isAdminPage}
        isDashboardPage={isPainelPage}
        isAdmin={isAuthenticated}
        onAdminClick={handleAdminClick}
        isMobileLandscape={isMobileLandscape}
        onNavigation={handleNavigation}
      />

      {/* Modal de Login Minimalista */}
      <MinimalLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </header>
  );
};

export default React.memo(Navbar); 