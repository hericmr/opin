import React from 'react';
import { Helmet } from 'react-helmet-async';

const StaticPageMetaTags = ({ title, description, urlPath, image, imageWidth = "1200", imageHeight = "630" }) => {
  const siteUrl = 'https://opin.unifesp.br';
  const fullUrl = urlPath ? `${siteUrl}${urlPath.startsWith('/') ? '' : '/'}${urlPath}` : siteUrl;
  const imageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`) : `${siteUrl}/opin.webp`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="OPIN - Saberes Indígenas" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default StaticPageMetaTags;
