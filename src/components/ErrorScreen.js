// components/ErrorScreen.js
import React from 'react';

const ErrorScreen = ({ error }) => (
  <div className="text-center text-red-500 mt-10">
    <p>Erro ao carregar os dados:</p>
    <p className="text-sm">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Tentar novamente...
    </button>
  </div>
);

export default React.memo(ErrorScreen);