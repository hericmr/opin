/**
 * Componente para meta tags Open Graph (Facebook, WhatsApp, LinkedIn, Telegram, Discord)
 * Modular e expansível
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gerarUrlEscola, gerarTituloEscola, gerarDescricaoEscola, gerarImagemEscola, DEFAULT_META_CONFIG } from '../../utils/metaTags';

const OpenGraphTags = ({ escola }) => {
  if (!escola) return null;

  const url = gerarUrlEscola(escola);
  const title = gerarTituloEscola(escola);
  const description = gerarDescricaoEscola(escola);
  const image = gerarImagemEscola(escola);

  return (
    <Helmet>
      {/* Open Graph básico */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={DEFAULT_META_CONFIG.siteName} />
      <meta property="og:locale" content={DEFAULT_META_CONFIG.locale} />
      
      {/* Imagem Open Graph */}
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`Foto da ${escola.titulo}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      
      {/* Open Graph específico para artigos/conteúdo */}
      <meta property="article:author" content={DEFAULT_META_CONFIG.siteName} />
      <meta property="article:section" content="Educação Indígena" />
      <meta property="article:tag" content="escola indígena" />
      <meta property="article:tag" content="educação indígena" />
      <meta property="article:tag" content="São Paulo" />
      
      {/* Open Graph específico para WhatsApp */}
      <meta property="og:image:secure_url" content={image} />
      
      {/* Open Graph específico para LinkedIn */}
      <meta property="og:image:url" content={image} />
    </Helmet>
  );
};

export default OpenGraphTags;