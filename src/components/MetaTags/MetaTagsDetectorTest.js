/**
 * Componente de teste para MetaTagsDetector
 * Mostra informações sobre a detecção automática de escolas
 */

import React from 'react';
import { useEscolaAtual } from '../../hooks/useEscolaAtual';

const MetaTagsDetectorTest = ({ dataPoints }) => {
  const { isDetecting, debugInfo, hasEscola } = useEscolaAtual(dataPoints);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-bold text-gray-800 mb-2">
        🎯 MetaTagsDetector Test
      </h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-1 px-2 py-1 rounded text-xs ${
            hasEscola 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {hasEscola ? 'Escola Detectada' : 'Nenhuma Escola'}
          </span>
        </div>
        
        {isDetecting && (
          <div className="text-blue-600">
            🔍 Detectando...
          </div>
        )}
        
        {debugInfo && (
          <div className="space-y-1">
            <div><strong>Escola:</strong> {debugInfo.titulo}</div>
            <div><strong>Slug:</strong> {debugInfo.slug}</div>
            <div><strong>Município:</strong> {debugInfo.municipio}</div>
            <div><strong>Povos:</strong> {debugInfo.povos}</div>
            <div className="text-xs text-gray-500 break-all">
              <strong>URL:</strong> {debugInfo.url}
            </div>
          </div>
        )}
        
        {!hasEscola && (
          <div className="text-gray-500 text-xs">
            Acesse uma escola específica para ver as meta tags customizadas
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <strong>Como testar:</strong><br/>
          1. Acesse uma URL como:<br/>
          <code className="bg-gray-100 px-1 rounded">
            ?panel=e-e-i-nhandepouwa
          </code><br/>
          2. Verifique as meta tags no DevTools
        </div>
      </div>
    </div>
  );
};

export default MetaTagsDetectorTest;