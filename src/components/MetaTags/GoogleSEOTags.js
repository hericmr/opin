/**
 * Componente para meta tags de SEO do Google
 * Modular e expansível
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gerarUrlEscola, gerarTituloEscola, gerarDescricaoEscola, gerarKeywordsEscola } from '../../utils/metaTags';
import { META_TAGS_CONFIG } from '../../config/metaTagsConfig';

const GoogleSEOTags = ({ escola }) => {
  if (!escola) return null;

  const url = gerarUrlEscola(escola);
  const title = gerarTituloEscola(escola);
  const description = gerarDescricaoEscola(escola);
  const keywords = gerarKeywordsEscola(escola);

  return (
    <Helmet>
      {/* Meta tags básicas para SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={META_TAGS_CONFIG.site.name} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Meta tags específicas para Google */}
      <meta name="google-site-verification" content="" /> {/* Adicione o código de verificação se tiver */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content={escola['Município'] || 'São Paulo'} />
      
      {/* Coordenadas geográficas */}
      {escola.Latitude && escola.Longitude && (
        <>
          <meta name="geo.position" content={`${escola.Latitude};${escola.Longitude}`} />
          <meta name="ICBM" content={`${escola.Latitude}, ${escola.Longitude}`} />
        </>
      )}
      
      {/* Meta tags para dispositivos móveis */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={title} />
      
      {/* Meta tags para idioma */}
      <meta httpEquiv="content-language" content="pt-BR" />
      <meta name="language" content="Portuguese" />
      
      {/* Meta tags para redes sociais adicionais */}
      <meta property="fb:app_id" content="" /> {/* Adicione o App ID do Facebook se tiver */}
      <meta name="pinterest-rich-pin" content="true" />
    </Helmet>
  );
};

export default GoogleSEOTags;