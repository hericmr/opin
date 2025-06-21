import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, BookOpen } from 'lucide-react';

const NavButtons = ({ isConteudoPage, isMobileLandscape }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(isConteudoPage ? '/' : '/conteudo')}
      className="px-3 xl:px-4 py-2 text-sm font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                 transition-all duration-200 rounded-lg hover:shadow-md active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-2"
    >
      {isConteudoPage ? <MapPin className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
      <span className="hidden xl:inline">
        {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
      </span>
      <span className="xl:hidden">
        {isConteudoPage ? 'Mapa' : 'Conteúdo'}
      </span>
    </button>
  );
};

export default NavButtons; 