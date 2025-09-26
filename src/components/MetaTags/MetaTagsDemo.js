/**
 * Componente de demonstração do sistema de meta tags
 * Pode ser usado para testar e demonstrar funcionalidades
 */

import React, { useState } from 'react';
import { MetaTagsManager } from './index';
import { useMetaTags, useShareData } from '../../hooks/useMetaTags';

// Dados de exemplo para demonstração
const escolasExemplo = [
  {
    id: 1,
    titulo: "E.E.I. Nhandepouwa",
    "Município": "São Paulo",
    "Povos indigenas": "Guarani",
    "Linguas faladas": "Guarani, Português",
    "Modalidade de Ensino/turnos de funcionamento": "Ensino Fundamental",
    "Numero de alunos": "50",
    Latitude: -23.5505,
    Longitude: -46.6333
  },
  {
    id: 2,
    titulo: "E.E.I. Aldeia Ywy Pyhau",
    "Município": "São Paulo",
    "Povos indigenas": "Guarani Mbya",
    "Linguas faladas": "Guarani Mbya, Português",
    "Modalidade de Ensino/turnos de funcionamento": "Educação Infantil e Fundamental",
    "Numero de alunos": "35",
    Latitude: -23.5505,
    Longitude: -46.6333
  }
];

const MetaTagsDemo = () => {
  const [escolaSelecionada, setEscolaSelecionada] = useState(escolasExemplo[0]);
  const metaTags = useMetaTags(escolaSelecionada);
  const shareData = useShareData(escolaSelecionada);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Meta tags dinâmicas */}
      <MetaTagsManager escola={escolaSelecionada} />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          🎯 Demonstração do Sistema de Meta Tags
        </h1>
        
        {/* Seletor de escola */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione uma escola para testar:
          </label>
          <select
            value={escolaSelecionada.id}
            onChange={(e) => {
              const escola = escolasExemplo.find(e => e.id === parseInt(e.target.value));
              setEscolaSelecionada(escola);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {escolasExemplo.map(escola => (
              <option key={escola.id} value={escola.id}>
                {escola.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Informações da escola selecionada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              📋 Informações da Escola
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Nome:</strong> {escolaSelecionada.titulo}</div>
              <div><strong>Município:</strong> {escolaSelecionada['Município']}</div>
              <div><strong>Povos:</strong> {escolaSelecionada['Povos indigenas']}</div>
              <div><strong>Línguas:</strong> {escolaSelecionada['Linguas faladas']}</div>
              <div><strong>Modalidade:</strong> {escolaSelecionada['Modalidade de Ensino/turnos de funcionamento']}</div>
              <div><strong>Alunos:</strong> {escolaSelecionada['Numero de alunos']}</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🔗 Meta Tags Geradas
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>URL:</strong> <span className="text-blue-600 break-all">{metaTags.url}</span></div>
              <div><strong>Título:</strong> {metaTags.title}</div>
              <div><strong>Descrição:</strong> {metaTags.description}</div>
              <div><strong>Imagem:</strong> <span className="text-blue-600 break-all">{metaTags.image}</span></div>
            </div>
          </div>
        </div>

        {/* Dados de compartilhamento */}
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">
            📱 Dados para Compartilhamento
          </h3>
          <div className="space-y-2 text-sm">
            <div><strong>WhatsApp:</strong> {shareData?.title}</div>
            <div><strong>Facebook:</strong> {shareData?.description}</div>
            <div><strong>Twitter:</strong> {shareData?.title} - {shareData?.description.substring(0, 100)}...</div>
            <div><strong>LinkedIn:</strong> {shareData?.description}</div>
          </div>
        </div>

        {/* Links de teste */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            🧪 Testar Meta Tags
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">Redes Sociais:</h4>
              <div className="space-y-1">
                <a 
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(metaTags.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🔵 Facebook Debugger
                </a>
                <a 
                  href={`https://cards-dev.twitter.com/validator`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🐦 Twitter Card Validator
                </a>
                <a 
                  href={`https://www.linkedin.com/post-inspector/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  💼 LinkedIn Inspector
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-yellow-700 mb-2">SEO:</h4>
              <div className="space-y-1">
                <a 
                  href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(metaTags.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  🔍 Google Rich Results
                </a>
                <a 
                  href={`https://validator.w3.org/nu/?doc=${encodeURIComponent(metaTags.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  ✅ W3C Validator
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Código de exemplo */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💻 Como Usar no Seu Código
          </h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { MetaTagsManager } from './components/MetaTags';

// Uso básico
<MetaTagsManager escola={escolaData} />

// Uso com controle granular
<MetaTagsManager 
  escola={escolaData}
  enableOpenGraph={true}
  enableTwitterCards={true}
  enableGoogleSEO={true}
  enableStructuredData={true}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MetaTagsDemo;