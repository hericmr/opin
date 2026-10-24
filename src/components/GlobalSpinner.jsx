import React from 'react';

const GlobalSpinner = ({ message = "Carregando...", lightText = false }) => {
  return (
    <div className="flex flex-col items-center gap-3 justify-center w-full h-full p-4">
       <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
       {message && <p className={`font-medium text-sm ${lightText ? 'text-gray-300' : 'text-green-800'}`}>{message}</p>}
    </div>
  );
};

export default GlobalSpinner;
