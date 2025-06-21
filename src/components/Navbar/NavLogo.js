import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavLogo = ({ isMobileLandscape }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 group flex-1 min-w-0">
      <h1
        onClick={() => navigate('/')}
        className={`cursor-pointer hover:text-amber-200 transition-colors duration-200 border-b-2 border-transparent 
                  hover:border-amber-400 font-[Caveat] truncate leading-tight ${
                    isMobileLandscape 
                      ? 'text-sm' 
                      : 'text-sm sm:text-base md:text-lg lg:text-2xl'
                  }`}
      >
        Observatório dos Professores Indígenas no Estado de São Paulo
      </h1>
    </div>
  );
};

export default NavLogo; 