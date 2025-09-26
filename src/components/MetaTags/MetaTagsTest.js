/**
 * Componente de teste para verificar meta tags
 * Útil para desenvolvimento e debug
 */

import React from 'react';
import { MetaTagsManager } from './index';

const MetaTagsTest = ({ escola }) => {
  if (!escola) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h3 className="text-yellow-800 font-bold">Meta Tags Test</h3>
        <p className="text-yellow-700">Nenhuma escola selecionada</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
      <h3 className="text-green-800 font-bold">Meta Tags Test</h3>
      <div className="text-green-700 text-sm space-y-1">
        <p><strong>Escola:</strong> {escola.titulo}</p>
        <p><strong>URL:</strong> {window.location.href}</p>
        <p><strong>Meta tags ativas:</strong> ✅</p>
      </div>
      
      {/* Renderizar meta tags */}
      <MetaTagsManager escola={escola} />
    </div>
  );
};

export default MetaTagsTest;