import React from 'react';

const HistoriaEscolaHeader = () => (
  <div className="flex items-center justify-between mb-3 sm:mb-4">
    <div className="flex items-center gap-3">
      <span className="bg-green-200 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
        <img 
          src={`${import.meta.env.BASE_URL || '/opin'}/onca.svg`} 
          alt="Ícone de onça" 
          className="w-18 h-18 sm:w-36 sm:h-36" 
          style={{ 
            filter: 'none', 
            borderRadius: '0', 
            boxShadow: 'none', 
            margin: '0',
            padding: '0',
            border: 'none',
            outline: 'none',
            transform: 'translateY(17px)'
          }}
          aria-hidden="true"
        />
      </span>
      <h2 className="text-xl sm:text-2xl font-bold text-black m-0">
        História da Escola
      </h2>
    </div>
  </div>
);

export default HistoriaEscolaHeader;
