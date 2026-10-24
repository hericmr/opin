/**
 * Componente para Twitter Cards (Twitter/X)
 * Modular e expansível
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gerarUrlEscola, gerarTituloEscola, gerarDescricaoEscola, gerarImagemEscola } from '../../utils/metaTags';
import { META_TAGS_CONFIG } from '../../config/metaTagsConfig';

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
      <meta name="twitter:site" content={META_TAGS_CONFIG.social.twitter.handle} />
      <meta name="twitter:creator" content={META_TAGS_CONFIG.social.twitter.handle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      
      {/* Imagem Twitter Card */}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`Foto da ${escola.titulo}`} />
      
      {/* Twitter Card específico para app */}
      <meta name="twitter:app:name:iphone" content={META_TAGS_CONFIG.site.name} />
      <meta name="twitter:app:name:ipad" content={META_TAGS_CONFIG.site.name} />
      <meta name="twitter:app:name:googleplay" content={META_TAGS_CONFIG.site.name} />
    </Helmet>
  );
};

export default TwitterCardTags;