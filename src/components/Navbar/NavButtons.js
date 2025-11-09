import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Map, BarChart3 } from 'lucide-react';

const NavButtons = ({ isConteudoPage, isSearchPage, isAdminPage, isPainelPage, isMobileLandscape }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/mapa') return location.pathname === '/mapa';
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || 
             location.pathname === '/painel-dados' || 
             location.pathname === '/dados-escolas-indigenas';
    }
    return location.pathname === path;
  };

  const getButtonStyle = (active) => {
    const baseStyle = 'px-3 xl:px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 focus:outline-none flex items-center gap-2 relative';
    const activeStyle = 'bg-green-600 text-white shadow-md';
    const inactiveStyle = 'text-white hover:bg-green-700/20';
    
    return `${baseStyle} ${active ? activeStyle : inactiveStyle}`;
  };

  return (
    <nav className="flex items-center space-x-2" role="navigation" aria-label="Navegação principal">
      {/* Botão Home/Mapa */}
      <button
        onClick={() => navigate('/mapa')}
        className={getButtonStyle(isActive('/mapa'))}
        title="Ir para o mapa das escolas indígenas"
        aria-label="Ir para o mapa das escolas indígenas"
        aria-current={isActive('/mapa') ? 'page' : undefined}
      >
        <Map className="w-4 h-4" />
        <span className="hidden xl:inline">Mapa</span>
      </button>

      {/* Botão Materiais Didáticos */}
      <button
        onClick={() => navigate('/conteudo')}
        className={getButtonStyle(isActive('/conteudo'))}
        title="Ver materiais didáticos indígenas"
        aria-label="Ver materiais didáticos indígenas"
        aria-current={isActive('/conteudo') ? 'page' : undefined}
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden xl:inline">Materiais</span>
      </button>

      {/* Botão Alguns dados */}
      <button
        onClick={() => navigate('/dashboard')}
        className={getButtonStyle(isActive('/dashboard'))}
        title="Ver dados das escolas indígenas"
        aria-label="Ver dados das escolas indígenas"
        aria-current={isActive('/dashboard') ? 'page' : undefined}
      >
        <BarChart3 className="w-4 h-4" />
        <span className="hidden xl:inline">Alguns dados</span>
      </button>
    </nav>
  );
};

export default NavButtons; 