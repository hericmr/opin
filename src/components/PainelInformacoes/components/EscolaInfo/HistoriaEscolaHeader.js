import React from 'react';

const HistoriaEscolaHeader = () => (
  <header className="mb-6 sm:mb-8 max-w-4xl mx-auto w-full">
    <div className="flex items-center gap-3 mb-3 sm:mb-4">
      <span className="bg-green-200 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
        <img 
          src={`${process.env.PUBLIC_URL}/onca.svg`} 
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
    <div className="h-1 w-20 sm:w-24 bg-green-200 rounded-full" />
  </header>
);

export default HistoriaEscolaHeader;
