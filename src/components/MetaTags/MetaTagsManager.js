/**
 * Gerenciador principal de meta tags
 * Componente modular e expansível que coordena todos os tipos de meta tags
 */

import React from 'react';
import OpenGraphTags from './OpenGraphTags';
import TwitterCardTags from './TwitterCardTags';
import GoogleSEOTags from './GoogleSEOTags';
import StructuredDataTags from './StructuredDataTags';

/**
 * Componente principal que gerencia todas as meta tags
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.escola - Dados da escola para gerar meta tags
 * @param {boolean} props.enableOpenGraph - Habilitar Open Graph tags (padrão: true)
 * @param {boolean} props.enableTwitterCards - Habilitar Twitter Cards (padrão: true)
 * @param {boolean} props.enableGoogleSEO - Habilitar meta tags do Google (padrão: true)
 * @param {boolean} props.enableStructuredData - Habilitar dados estruturados (padrão: true)
 * @returns {React.ReactElement} Componente renderizado
 */
const MetaTagsManager = ({ 
  escola, 
  enableOpenGraph = true,
  enableTwitterCards = true,
  enableGoogleSEO = true,
  enableStructuredData = true
}) => {
  // Se não há escola, não renderiza nada
  if (!escola) return null;

  return (
    <>
      {enableOpenGraph && <OpenGraphTags escola={escola} />}
      {enableTwitterCards && <TwitterCardTags escola={escola} />}
      {enableGoogleSEO && <GoogleSEOTags escola={escola} />}
      {enableStructuredData && <StructuredDataTags escola={escola} />}
    </>
  );
};

export default MetaTagsManager;