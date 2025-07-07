import React from 'react';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-green-800 font-medium">Carregando OPIN...</p>
      <p className="text-green-600 text-sm">Observatório dos Professores Indígenas</p>
    </div>
  </div>
);

export default LoadingScreen; 