import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, BookOpen, Search, Home } from 'lucide-react';

const NavButtons = ({ isConteudoPage, isSearchPage, isAdminPage, isMobileLandscape }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getButtonStyle = (active) => `
    px-3 xl:px-4 py-2 text-sm font-medium text-white 
    ${active 
      ? 'bg-amber-600/80 border-amber-400/60' 
      : 'bg-green-800/60 hover:bg-amber-700/60'
    }
    transition-all duration-200 rounded-lg hover:shadow-md active:scale-95
    focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-2
    border-2 ${active ? 'border-amber-400/60' : 'border-transparent'}
  `;

  return (
    <div className="flex items-center space-x-2">
      {/* Botão Home/Mapa - TEMPORARIAMENTE DESATIVADO */}
      {/* <button
        onClick={() => navigate('/')}
        className={getButtonStyle(isActive('/'))}
        title="Voltar ao mapa das escolas indígenas"
      >
        <Home className="w-4 h-4" />
        <span className="hidden xl:inline">
          {isActive('/') ? 'Mapa Ativo' : 'Mapa das Escolas'}
        </span>
        <span className="xl:hidden">
          Mapa
        </span>
      </button> */}

      {/* Botão Conteúdo Educacional - TEMPORARIAMENTE DESATIVADO */}
      {/* <button
        onClick={() => navigate('/conteudo')}
        className={getButtonStyle(isActive('/conteudo'))}
        title="Ver todo o conteúdo educacional"
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden xl:inline">
          {isActive('/conteudo') ? 'Conteúdo Ativo' : 'Conteúdo Educacional'}
        </span>
        <span className="xl:hidden">
          Conteúdo
        </span>
      </button> */}

      {/* Botão Busca (apenas se estivermos na página de busca) */}
      {isSearchPage && (
        <button
          onClick={() => navigate('/search')}
          className={getButtonStyle(true)}
          title="Resultados da busca"
        >
          <Search className="w-4 h-4" />
          <span className="hidden xl:inline">
            Resultados da Busca
          </span>
          <span className="xl:hidden">
            Busca
          </span>
        </button>
      )}
    </div>
  );
};

export default NavButtons; 