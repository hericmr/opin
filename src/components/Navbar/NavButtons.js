import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { prefetchPage } from '../../router';

const NavButtons = ({ isConteudoPage, isSearchPage, isAdminPage, isPainelPage, isMobileLandscape }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/mapa') return location.pathname === '/mapa';
    if (path === '/algunsdados') {
      return location.pathname === '/algunsdados' ||
             location.pathname === '/painel-dados' ||
             location.pathname === '/dados-escolas-indigenas';
    }
    if (path === '/lindiflix') return location.pathname.startsWith('/lindiflix');
    return location.pathname === path;
  };

  const getButtonStyle = (active) => {
    const baseStyle = 'px-3 xl:px-4 py-1.5 text-base font-medium rounded-lg focus:outline-none relative';
    const activeStyle = 'bg-white/20 text-white shadow-sm';
    const inactiveStyle = 'text-white hover:text-white opacity-80 hover:opacity-100';
    
    return `${baseStyle} ${active ? activeStyle : inactiveStyle}`;
  };

  return (
    <nav className="flex items-center space-x-2" role="navigation" aria-label="Navegação principal">
      {/* Botão Home/Mapa */}
      <button
        onClick={() => navigate('/mapa')}
        onMouseEnter={() => prefetchPage('mapa')}
        onTouchStart={() => prefetchPage('mapa')}
        className={getButtonStyle(isActive('/mapa'))}
        title="Ir para o mapa das escolas indígenas"
        aria-label="Ir para o mapa das escolas indígenas"
        aria-current={isActive('/mapa') ? 'page' : undefined}
      >
        Mapa
      </button>

      {/* Botão Materiais Didáticos */}
      <button
        onClick={() => navigate('/conteudo')}
        onMouseEnter={() => prefetchPage('conteudo')}
        onTouchStart={() => prefetchPage('conteudo')}
        className={getButtonStyle(isActive('/conteudo'))}
        title="Ver materiais didáticos indígenas"
        aria-label="Ver materiais didáticos indígenas"
        aria-current={isActive('/conteudo') ? 'page' : undefined}
      >
        Materiais
      </button>

      {/* Botão Alguns dados */}
      <button
        onClick={() => navigate('/algunsdados')}
        onMouseEnter={() => prefetchPage('dashboard')}
        onTouchStart={() => prefetchPage('dashboard')}
        className={getButtonStyle(isActive('/algunsdados'))}
        title="Ver dados das escolas indígenas"
        aria-label="Ver dados das escolas indígenas"
        aria-current={isActive('/algunsdados') ? 'page' : undefined}
      >
        Alguns dados
      </button>

      {/* Botão Lindiflix */}
      <button
        onClick={() => navigate('/lindiflix')}
        onMouseEnter={() => prefetchPage('lindiflix')}
        onTouchStart={() => prefetchPage('lindiflix')}
        className={getButtonStyle(isActive('/lindiflix'))}
        title="Lindiflix – Vídeos das aldeias indígenas"
        aria-label="Lindiflix – Vídeos das aldeias indígenas"
        aria-current={isActive('/lindiflix') ? 'page' : undefined}
      >
        Lindiflix
      </button>
    </nav>
  );
};

export default NavButtons; 