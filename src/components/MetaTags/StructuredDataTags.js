/**
 * Componente para dados estruturados (JSON-LD) para SEO
 * Modular e expansível
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gerarStructuredData } from '../../utils/metaTags';

const StructuredDataTags = ({ escola }) => {
  if (!escola) return null;

  const structuredData = gerarStructuredData(escola);

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredDataTags;