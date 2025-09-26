/**
 * Teste rápido para verificar se as meta tags customizadas estão funcionando
 * Componente simples para debug e verificação
 */

import React from 'react';
import { useEscolaAtual } from '../../hooks/useEscolaAtual';

const MetaTagsQuickTest = ({ dataPoints }) => {
  const { escolaAtual, debugInfo } = useEscolaAtual(dataPoints);

  if (!escolaAtual) {
    return (
      <div className="fixed top-4 left-4 bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm z-50">
        <div className="text-gray-600">
          <strong>🎯 Meta Tags:</strong> Padrão (nenhuma escola específica)
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Acesse uma URL como: ?panel=e-e-i-nhandepouwa
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-green-100 border border-green-300 rounded-lg p-3 text-sm z-50 max-w-sm">
      <div className="text-green-800">
        <strong>🎯 Meta Tags:</strong> Customizadas
      </div>
      <div className="text-xs text-green-700 mt-1">
        <div><strong>Escola:</strong> {debugInfo?.titulo}</div>
        <div><strong>Slug:</strong> {debugInfo?.slug}</div>
        <div className="text-xs text-gray-500 break-all mt-1">
          <strong>URL:</strong> {debugInfo?.url}
        </div>
      </div>
      <div className="text-xs text-green-600 mt-2">
        ✅ Meta tags específicas ativas!
      </div>
    </div>
  );
};

export default MetaTagsQuickTest;