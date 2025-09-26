/**
 * Componente para testar meta tags em URLs específicas
 * Demonstra como as meta tags são customizadas para cada escola
 */

import React from 'react';
import { useEscolaAtual } from '../../hooks/useEscolaAtual';
import { gerarUrlEscola, gerarTituloEscola, gerarDescricaoEscola } from '../../utils/metaTags';

const MetaTagsUrlTest = ({ dataPoints }) => {
  const { escolaAtual, debugInfo } = useEscolaAtual(dataPoints);

  // Exemplos de URLs para testar
  const exemplosUrls = dataPoints?.slice(0, 5).map(escola => ({
    escola,
    url: gerarUrlEscola(escola),
    titulo: gerarTituloEscola(escola),
    descricao: gerarDescricaoEscola(escola)
  })) || [];

  const copiarUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada para a área de transferência!');
  };

  const abrirUrl = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          🎯 Teste de Meta Tags Customizadas
        </h1>
        
        {/* Status atual */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📍 Escola Atual Detectada
          </h2>
          {escolaAtual ? (
            <div className="space-y-2 text-sm">
              <div><strong>Escola:</strong> {debugInfo?.titulo}</div>
              <div><strong>URL Atual:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{debugInfo?.url}</code></div>
              <div><strong>Meta Tags:</strong> <span className="text-green-600">✅ Ativas</span></div>
            </div>
          ) : (
            <div className="text-gray-600">
              Nenhuma escola específica detectada. As meta tags padrão estão ativas.
            </div>
          )}
        </div>

        {/* Exemplos de URLs para testar */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧪 Teste com URLs Específicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exemplosUrls.map((exemplo, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {exemplo.escola.titulo}
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Título:</strong> {exemplo.titulo}
                  </div>
                  <div>
                    <strong>Descrição:</strong> {exemplo.descricao.substring(0, 100)}...
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    <strong>URL:</strong> {exemplo.url}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => copiarUrl(exemplo.url)}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={() => abrirUrl(exemplo.url)}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                  >
                    🔗 Abrir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instruções de teste */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">
            📋 Como Testar Meta Tags Customizadas
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Copie uma URL específica:</strong>
              <div className="mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  https://hericmr.github.io/escolasindigenas/?panel=e-e-i-nhandepouwa
                </code>
              </div>
            </div>
            
            <div>
              <strong>2. Teste nas ferramentas:</strong>
              <div className="mt-1 space-y-1">
                <a 
                  href="https://developers.facebook.com/tools/debug/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  🔵 Facebook Sharing Debugger
                </a>
                <a 
                  href="https://cards-dev.twitter.com/validator" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  🐦 Twitter Card Validator
                </a>
                <a 
                  href="https://www.linkedin.com/post-inspector/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  💼 LinkedIn Post Inspector
                </a>
              </div>
            </div>
            
            <div>
              <strong>3. Verifique no DevTools:</strong>
              <div className="mt-1 text-gray-600">
                Abra DevTools → Elements → Procure por &lt;meta&gt; tags no &lt;head&gt;
              </div>
            </div>
          </div>
        </div>

        {/* Meta tags geradas */}
        {escolaAtual && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-3">
              🎯 Meta Tags Geradas para Esta Escola
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>og:title:</strong> {gerarTituloEscola(escolaAtual)}
              </div>
              <div>
                <strong>og:description:</strong> {gerarDescricaoEscola(escolaAtual)}
              </div>
              <div>
                <strong>og:url:</strong> {gerarUrlEscola(escolaAtual)}
              </div>
              <div>
                <strong>twitter:title:</strong> {gerarTituloEscola(escolaAtual)}
              </div>
              <div>
                <strong>twitter:description:</strong> {gerarDescricaoEscola(escolaAtual)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaTagsUrlTest;