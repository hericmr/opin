import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../hooks/useAuth';
import { useBreakpoint } from '../../hooks/responsive/useBreakpoint';
import { getLocalImageUrl } from '../../utils/imageUtils';
import MobileToggle from './MobileToggle';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import NavButtons from './NavButtons';
import NavLogos from './NavLogos';
import MinimalLoginModal from '../Auth/MinimalLoginModal';

const Navbar = ({ dataPoints, openPainelFunction }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearch } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();
  const { width } = useBreakpoint();
  const searchBarRef = useRef(null);

  // Calcular se é mobile landscape baseado na largura e orientação
  const isMobileLandscape = useMemo(() => {
    return width <= 1024 && width > window.innerHeight;
  }, [width]);

  // Atalho de teclado Ctrl+K / Cmd+K para busca
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchBarRef.current) {
          // Forçar a expansão da busca
          const searchButton = searchBarRef.current.querySelector('button[aria-label="Buscar"]');
          if (searchButton) {
            searchButton.click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Controlar mudança de fundo da navbar baseado no scroll
  // Similar ao Native Land Digital: transparente no topo, sólido quando rola
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Mudar para fundo sólido quando rolar mais de 50px
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Texto: controles movidos para o menu de camadas

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

  // Helper para normalizar o pathname (tratar trailing slashes e index.html gerados para SEO)
  const normalizedPath = useMemo(() => {
    let p = location.pathname;
    if (p.endsWith('/index.html')) p = p.replace('/index.html', '');
    if (p.endsWith('/') && p.length > 1) p = p.slice(0, -1);
    return p;
  }, [location.pathname]);

  // Memoizar cálculos de rotas para evitar recálculos desnecessários
  const isConteudoPage = useMemo(() => normalizedPath === '/conteudo', [normalizedPath]);
  const isSearchPage = useMemo(() => normalizedPath === '/search', [normalizedPath]);
  const isAdminPage = useMemo(() => normalizedPath === '/admin', [normalizedPath]);
  const isPainelPage = useMemo(() =>
    normalizedPath === '/algunsdados' ||
    normalizedPath === '/painel-dados' ||
    normalizedPath === '/dados-escolas-indigenas',
    [normalizedPath]
  );

  // Páginas que usam hero image (navbar transparente)
  const isGaleriaPage = useMemo(() => normalizedPath.startsWith('/galeria'), [normalizedPath]);
  const isLindiflixPage = useMemo(() => normalizedPath.startsWith('/lindiflix'), [normalizedPath]);
  const isHeroPage = useMemo(() => {
    return isPainelPage || isConteudoPage || isGaleriaPage || isLindiflixPage || 
           normalizedPath === '/search' || normalizedPath === '/sobre' || normalizedPath === '/escolas' || normalizedPath === '/jogos' || normalizedPath.startsWith('/escola') || normalizedPath.startsWith('/historia') || normalizedPath === '/';
  }, [isPainelPage, isConteudoPage, isGaleriaPage, isLindiflixPage, normalizedPath]);

  const toggleMobileMenu = React.useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSearch = (searchTerm, coordinates = null) => {
    if (coordinates) {
      // Se temos coordenadas, navegar para o mapa e centralizar
      setSearch(searchTerm, coordinates, searchTerm);
      navigate('/mapa', {
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
    // Se temos a função de abrir painel e o resultado tem dados da escola
    if (openPainelFunction && result.data) {
      // Abrir o painel de informações com os dados da escola
      openPainelFunction(result.data);
      // Navegar para o mapa se não estivermos lá
      if (location.pathname !== '/mapa') {
        navigate('/mapa');
      }
    } else if (result.coordinates) {
      // Fallback: navegar para o mapa e centralizar no ponto
      setSearch(result.title, result.coordinates, result.title);
      navigate('/mapa', {
        state: {
          searchTerm: result.title,
          coordinates: result.coordinates,
          highlightSchool: result.title
        }
      });
    } else {
      // Busca simples
      setSearch(result.title);
      navigate(`/search?q=${encodeURIComponent(result.title)}`);
    }
  };

  // Determinar se deve mostrar fundo sólido
  // Se estiver em página hero E não tiver rolado, manter transparente
  // Caso contrário, mostrar fundo sólido
  const shouldShowSolidBackground = !isHeroPage || isScrolled;

  // Verificar se está na homepage
  const isHomepage = useMemo(() => normalizedPath === '/', [normalizedPath]);

  // Verificar se está numa página do Lindiflix (movido para cima)

  // URL da imagem hero
  const heroImageUrl = `${import.meta.env.BASE_URL}hero.webp`;

  return (
    <header
      className={`${isHeroPage && !isHomepage ? 'absolute' : 'fixed shadow-lg'} top-0 left-0 right-0 z-50 text-white transition-all duration-300 ${isHomepage ? '' : (shouldShowSolidBackground ? 'bg-[#215A36]' : 'bg-transparent')
        }`}
      style={isHomepage ? {
        backgroundImage: `url('${heroImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      } : {}}
      role="banner"
    >
      {/* Overlay para legibilidade do texto na homepage */}
      {isHomepage && (
        <div className="absolute inset-0 bg-green-900/60 pointer-events-none"></div>
      )}
      {/* Header Principal - Estilo UNIFESP */}
      <div className={`w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-12 ${isHomepage ? 'relative z-10' : ''}`}>
        <div className="flex items-center justify-between py-1 sm:py-1.5 md:py-2">

          {/* Título do Projeto - Lado esquerdo */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0 flex-shrink">
            <button
              onClick={() => navigate('/')}
              className="text-left hover:opacity-80 transition-opacity focus:outline-none focus:rounded"
              aria-label="Ir para página inicial - OPIN"
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <img
                  src={getLocalImageUrl(`${import.meta.env.BASE_URL}logo_index.webp`)}
                  alt="OPIN - Observatório dos Professores Indígenas"
                  className="h-6 sm:h-7 md:h-8 lg:h-10 xl:h-12 w-auto object-contain object-left"
                  style={{ display: 'block' }}
                />
                <div className="hidden sm:block w-px h-4 sm:h-6 md:h-8 bg-white/30 flex-shrink-0"></div>
                <div className="hidden md:flex flex-col justify-center min-w-0">
                  <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl whitespace-normal break-words leading-tight" style={{ fontFamily: 'PapakiloLight, sans-serif' }}>
                    OBSERVATÓRIO DOS PROFESSORES INDÍGENAS
                  </span>
                  <p className="text-xs sm:text-sm text-white/80 normal-case whitespace-normal break-words mt-0.5">
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
            <NavLogos />

            {/* Admin - Far right (só mostra quando autenticado) */}
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80 hidden xl:inline" aria-live="polite">
                  Olá, {user?.username}
                </span>
                <button
                  onClick={() => navigate('/admin')}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors focus:outline-none"
                  aria-label="Painel administrativo"
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs rounded hover:bg-white/10 transition-colors focus:outline-none"
                  aria-label="Sair da conta"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

          {/* Mobile - Busca e Botão hambúrguer */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex-1 max-w-xs">
              <SearchBar
                onSearch={handleSearch}
                onResultClick={handleResultClick}
                isMobile={true}
                isMobileLandscape={isMobileLandscape}
                dataPoints={dataPoints}
              />
            </div>
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