import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavLogo = ({ isMobileLandscape }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 group flex-1 min-w-0">
      <div 
        onClick={() => navigate('/')}
        className="cursor-pointer hover:text-amber-200 transition-colors duration-200 
                  border-b-2 border-transparent hover:border-amber-400 flex items-center gap-2"
      >
        {/* Título completo com fonte Caveat */}
        <h1 className={`font-[Caveat] leading-tight ${
          isMobileLandscape 
            ? 'text-sm' 
            : 'text-sm sm:text-base md:text-lg lg:text-xl'
        }`}>
          OPIN - Observatório dos Professores Indígenas Estado de São Paulo
        </h1>
      </div>
    </div>
  );
};

export default NavLogo; 