/**
 * Exemplo de uso do sistema de meta tags
 * Demonstra como usar os componentes de forma modular
 */

import React from 'react';
import { 
  MetaTagsManager, 
  OpenGraphTags, 
  TwitterCardTags, 
  gerarUrlEscola,
  gerarTituloEscola,
  gerarDescricaoEscola
} from './index';

// Exemplo de dados de escola
const exemploEscola = {
  id: 1,
  titulo: "E.E.I. Nhandepouwa",
  "Município": "São Paulo",
  "Povos indigenas": "Guarani",
  "Linguas faladas": "Guarani, Português",
  "Modalidade de Ensino/turnos de funcionamento": "Ensino Fundamental",
  "Numero de alunos": "50",
  Latitude: -23.5505,
  Longitude: -46.6333
};

const MetaTagsExample = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-800">
        Exemplo de Meta Tags Dinâmicas
      </h1>
      
      {/* Exemplo 1: Uso completo */}
      <div className="border border-green-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-700 mb-2">
          1. Uso Completo (Recomendado)
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Renderiza todas as meta tags automaticamente
        </p>
        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
          {`<MetaTagsManager escola={escola} />`}
        </div>
        <MetaTagsManager escola={exemploEscola} />
      </div>

      {/* Exemplo 2: Uso granular */}
      <div className="border border-blue-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          2. Uso Granular (Controle Individual)
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Controle individual de cada tipo de meta tag
        </p>
        <div className="bg-gray-100 p-2 rounded text-sm font-mono mb-2">
          {`<MetaTagsManager 
  escola={escola}
  enableOpenGraph={true}
  enableTwitterCards={false}
  enableGoogleSEO={true}
  enableStructuredData={false}
/>`}
        </div>
        <MetaTagsManager 
          escola={exemploEscola}
          enableOpenGraph={true}
          enableTwitterCards={false}
          enableGoogleSEO={true}
          enableStructuredData={false}
        />
      </div>

      {/* Exemplo 3: Componentes individuais */}
      <div className="border border-purple-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-purple-700 mb-2">
          3. Componentes Individuais
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Use apenas os componentes necessários
        </p>
        <div className="space-y-2">
          <div className="bg-gray-100 p-2 rounded text-sm font-mono">
            {`<OpenGraphTags escola={escola} />`}
          </div>
          <div className="bg-gray-100 p-2 rounded text-sm font-mono">
            {`<TwitterCardTags escola={escola} />`}
          </div>
        </div>
        <OpenGraphTags escola={exemploEscola} />
        <TwitterCardTags escola={exemploEscola} />
      </div>

      {/* Exemplo 4: Utilitários */}
      <div className="border border-orange-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-orange-700 mb-2">
          4. Utilitários de Geração
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Funções para gerar URLs, títulos e descrições
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>URL:</strong> {gerarUrlEscola(exemploEscola)}
          </div>
          <div>
            <strong>Título:</strong> {gerarTituloEscola(exemploEscola)}
          </div>
          <div>
            <strong>Descrição:</strong> {gerarDescricaoEscola(exemploEscola)}
          </div>
        </div>
      </div>

      {/* Informações de teste */}
      <div className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
        <h2 className="text-lg font-semibold text-yellow-700 mb-2">
          🧪 Como Testar
        </h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Facebook:</strong> 
            <a 
              href="https://developers.facebook.com/tools/debug/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Facebook Sharing Debugger
            </a>
          </div>
          <div>
            <strong>Twitter:</strong> 
            <a 
              href="https://cards-dev.twitter.com/validator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Twitter Card Validator
            </a>
          </div>
          <div>
            <strong>LinkedIn:</strong> 
            <a 
              href="https://www.linkedin.com/post-inspector/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              LinkedIn Post Inspector
            </a>
          </div>
          <div>
            <strong>Google:</strong> 
            <a 
              href="https://search.google.com/test/rich-results" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              Rich Results Test
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaTagsExample;