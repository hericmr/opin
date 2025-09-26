import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
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
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-1 md:py-2 px-4">
          
          {/* Logo UNIFESP - Lado esquerdo */}
          <div className="flex items-center space-x-4">
            {/* Logos - Apenas Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="https://www.unifesp.br/lindi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <img 
                  src={`${process.env.PUBLIC_URL}/lindi.svg`} 
                  alt="LINDI - Licenciatura Intercultural Indígena" 
                  className="h-16 w-auto"
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
                  className="h-12 w-auto"
                />
              </a>
            </div>
            
            {/* Título do Projeto - Mobile e Desktop */}
            <div className="md:border-l md:border-white/30 md:pl-4">
              <button
                onClick={() => navigate('/')}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <h1 className="font-['Cinzel'] text-white md:text-lg text-sm">
                  OPIN - Observatório dos Professores Indígenas
                </h1>
                <p className="text-xs text-white/80">
                  do Estado de São Paulo
                </p>
              </button>
            </div>
          </div>

          {/* Menu Superior - Lado direito */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            {/* Busca e Admin */}
            <div className="flex items-center space-x-2">
              {/* Barra de busca */}
              <SearchBar 
                onSearch={handleSearch} 
                onResultClick={handleResultClick}
                isMobile={false} 
                isMobileLandscape={isMobileLandscape}
                dataPoints={dataPoints}
              />
              
              {/* Admin Panel */}
              {!isAuthenticated ? (
                <button
                  onClick={handleAdminClick}
                  className="p-2 rounded hover:bg-[#215A36] transition-colors"
                  title="Acesso administrativo"
                >
                  <Leaf className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/80">
                    Olá, {user?.username}
                  </span>
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-3 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Admin
                  </button>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Sair"
                  >
                    Sair
                  </button>
                </div>
              )}
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