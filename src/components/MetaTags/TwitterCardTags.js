/**
 * Componente para Twitter Cards (Twitter/X)
 * Modular e expansível
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gerarUrlEscola, gerarTituloEscola, gerarDescricaoEscola, gerarImagemEscola, DEFAULT_META_CONFIG } from '../../utils/metaTags';

const TwitterCardTags = ({ escola }) => {
  if (!escola) return null;

  const url = gerarUrlEscola(escola);
  const title = gerarTituloEscola(escola);
  const description = gerarDescricaoEscola(escola);
  const image = gerarImagemEscola(escola);

  return (
    <Helmet>
      {/* Twitter Card básico */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULT_META_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={DEFAULT_META_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      
      {/* Imagem Twitter Card */}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`Foto da ${escola.titulo}`} />
      
      {/* Twitter Card específico para app */}
      <meta name="twitter:app:name:iphone" content={DEFAULT_META_CONFIG.siteName} />
      <meta name="twitter:app:name:ipad" content={DEFAULT_META_CONFIG.siteName} />
      <meta name="twitter:app:name:googleplay" content={DEFAULT_META_CONFIG.siteName} />
    </Helmet>
  );
};

export default TwitterCardTags;