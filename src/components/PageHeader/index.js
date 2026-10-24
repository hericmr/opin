import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBreakpoint } from '../../hooks/responsive/useBreakpoint';
import MobileMenu from '../Navbar/MobileMenu';
import MinimalLoginModal from '../Auth/MinimalLoginModal';
import Navbar from '../Navbar';

const PageHeader = ({
  title,
  logoImage = null,
  description,
  titleFontFamily = 'PapakiloLight, sans-serif',
  titleFontWeight = 'normal',
  titleSize = 'text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
  descriptionSize = 'text-sm md:text-base',
  className = '',
  children,
  showShareButtons = true,
  showNavbar = false,
  dataPoints = [],
  openPainelFunction = null,
  overlayColor = 'rgba(20, 81, 45, 0.6)',
  blendMode = 'normal',
  backgroundImage = null,
  backgroundPosition = 'center center',
  desktopBackgroundPosition = null,
  minHeight = null,
  titlePosition = 'center',
  navbarOnly = false,
  bottomLeftTitleSize = 'text-6xl sm:text-6xl md:text-7xl lg:text-8xl',
}) => {
  const defaultHeroUrl = `${import.meta.env.BASE_URL}hero_grayscale.webp`;
  const heroImageUrl = backgroundImage || defaultHeroUrl;
  const contentRef = React.useRef(null);
  const [containerHeight, setContainerHeight] = React.useState('auto');
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { width, isDesktop } = useBreakpoint();

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isMobileLandscape = React.useMemo(() => {
    return width <= 1024 && width > window.innerHeight;
  }, [width]);

  const isConteudoPage = React.useMemo(() => location.pathname === '/conteudo', [location.pathname]);
  const isSearchPage = React.useMemo(() => location.pathname === '/search', [location.pathname]);
  const isAdminPage = React.useMemo(() => location.pathname === '/admin', [location.pathname]);
  const isPainelPage = React.useMemo(() =>
    location.pathname === '/algunsdados' ||
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

  const updateHeight = React.useCallback(() => {
    if (contentRef.current) {
      // Só a navbar: o hero acompanha a altura real dela, que varia com a largura da tela
      const navbar = navbarOnly && contentRef.current.querySelector('header');
      const height = navbar ? navbar.offsetHeight : contentRef.current.offsetHeight;
      setContainerHeight(`${height}px`);
    }
  }, [navbarOnly]);

  React.useLayoutEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    // A navbar muda de altura quando as fontes e o logo terminam de carregar
    const navbar = navbarOnly && contentRef.current?.querySelector('header');
    const observer = navbar && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    if (observer) observer.observe(navbar);
    return () => {
      window.removeEventListener('resize', updateHeight);
      observer?.disconnect();
    };
  }, [updateHeight, navbarOnly, title, description, children]);

  return (
    <>
    <div
      className={`text-white shadow-lg relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `url('${heroImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: (isDesktop && desktopBackgroundPosition) || backgroundPosition,
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: containerHeight,
        minHeight: minHeight || undefined,
        zIndex: 10
      }}
    >
      {/* Overlay de cor */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ backgroundColor: overlayColor, mixBlendMode: blendMode }}
      />
      {/* Gradiente inferior para legibilidade do título bottom-left */}
      {titlePosition === 'bottom-left' && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
      )}

      <div ref={contentRef} className="relative z-10 flex flex-col" style={{ paddingTop: showNavbar && !navbarOnly ? '80px' : '0', paddingBottom: navbarOnly || titlePosition === 'bottom-left' ? '0' : '2rem', minHeight: minHeight || undefined }}>
        {showNavbar && (
          <Navbar dataPoints={dataPoints} openPainelFunction={openPainelFunction} />
        )}
        {navbarOnly ? null : titlePosition === 'bottom-left' ? (
          /* Título no canto inferior esquerdo — estilo editorial */
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex flex-col justify-end pb-8 pb-10" style={{ flex: 1 }}>
            {children && <div className="mb-4">{children}</div>}
            {logoImage ? (
              <img src={logoImage} alt={title || 'Logo'} className="h-20 w-auto object-contain" />
            ) : title ? (
              <h1
                className={`text-white ${bottomLeftTitleSize} font-normal leading-tight`}
                style={{ fontFamily: titleFontFamily, fontWeight: titleFontWeight }}
              >
                {title}
              </h1>
            ) : null}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Título centrado — padrão */}
            <div className="mt-4 flex items-center justify-center min-h-20 sm:min-h-24 md:min-h-28">
              {logoImage ? (
                <img
                  src={logoImage}
                  alt={title || 'Logo'}
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                />
              ) : (
                <h1
                  className={`text-white ${titleSize} uppercase leading-none text-center`}
                  style={{ fontFamily: titleFontFamily, fontWeight: titleFontWeight }}
                >
                  {title}
                </h1>
              )}
            </div>
            {children && <div className="mt-4">{children}</div>}
          </div>
        )}
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

      {/* Modal de Login */}
      {showLoginModal && (
        <MinimalLoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
    {/* Spacer em fluxo normal com a mesma altura do header absoluto —
        garante que o conteúdo abaixo sempre começa após o hero, sem marginTop hardcoded */}
    <div aria-hidden="true" style={{ height: containerHeight, minHeight: minHeight || undefined, flexShrink: 0 }} />
    </>
  );
};

export default PageHeader;