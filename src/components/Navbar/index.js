import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import NavLogo from './NavLogo';
import MobileToggle from './MobileToggle';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';

const Navbar = ({ dataPoints, openPainelFunction }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearch } = useSearch();

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
    const enteredPassword = prompt("Digite a senha de administrador:");
    if (enteredPassword === process.env.REACT_APP_ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  };

  const isConteudoPage = location.pathname === '/conteudo';
  
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-green-900/95 to-green-800/90 backdrop-blur-md text-white shadow-lg">
      <nav className={`container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between ${isMobileLandscape ? 'h-12' : ''}`}>
        
        {/* Logo e Título */}
        <NavLogo isMobileLandscape={isMobileLandscape} />

        {/* Mobile - Botão hambúrguer e busca */}
        <div className="lg:hidden flex items-center space-x-2">
          <SearchBar 
            onSearch={handleSearch} 
            onResultClick={handleResultClick}
            isMobile={true} 
            isMobileLandscape={isMobileLandscape}
            dataPoints={dataPoints}
          />
          <MobileToggle 
            mobileMenuOpen={mobileMenuOpen} 
            toggleMobileMenu={toggleMobileMenu} 
            isMobileLandscape={isMobileLandscape} 
          />
        </div>

        {/* Desktop - Layout completo */}
        <DesktopNav 
          isConteudoPage={isConteudoPage}
          isAdmin={isAdmin}
          onAdminClick={handleAdminClick}
          isMobileLandscape={isMobileLandscape}
          onSearch={handleSearch}
          onResultClick={handleResultClick}
          dataPoints={dataPoints}
        />
      </nav>

      {/* Menu Mobile */}
      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen}
        isConteudoPage={isConteudoPage}
        isAdmin={isAdmin}
        onAdminClick={handleAdminClick}
        isMobileLandscape={isMobileLandscape}
        onNavigation={handleNavigation}
      />
    </header>
  );
};

export default React.memo(Navbar); 