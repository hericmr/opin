/**
 * Utilitários para geração de meta tags dinâmicas
 * Sistema modular e expansível para compartilhamento social
 */

import { criarSlug } from './slug';
import { META_TAGS_CONFIG } from '../config/metaTagsConfig';

/**
 * Configurações padrão para meta tags (legado - usar META_TAGS_CONFIG)
 * @deprecated Use META_TAGS_CONFIG from '../config/metaTagsConfig'
 */
export const DEFAULT_META_CONFIG = {
  siteName: META_TAGS_CONFIG.site.name,
  siteUrl: META_TAGS_CONFIG.site.url,
  defaultImage: META_TAGS_CONFIG.images.default,
  defaultDescription: META_TAGS_CONFIG.site.description,
  twitterHandle: META_TAGS_CONFIG.social.twitter.handle,
  locale: META_TAGS_CONFIG.site.locale
};

/**
 * Gera URL completa para uma escola específica
 * @param {Object} escola - Dados da escola
 * @returns {string} URL completa
 */
export const gerarUrlEscola = (escola) => {
  if (!escola?.titulo) return DEFAULT_META_CONFIG.siteUrl;
  
  const slug = criarSlug(escola.titulo);
  return `${DEFAULT_META_CONFIG.siteUrl}/?panel=${slug}`;
};

/**
 * Gera título otimizado para compartilhamento
 * @param {Object} escola - Dados da escola
 * @returns {string} Título otimizado
 */
export const gerarTituloEscola = (escola) => {
  if (!escola?.titulo) return DEFAULT_META_CONFIG.siteName;
  
  return `${escola.titulo} - Escola Indígena`;
};

/**
 * Gera descrição otimizada para compartilhamento
 * @param {Object} escola - Dados da escola
 * @returns {string} Descrição otimizada
 */
export const gerarDescricaoEscola = (escola) => {
  if (!escola) return DEFAULT_META_CONFIG.defaultDescription;
  
  let descricao = `Escola Indígena: ${escola.titulo}`;
  
  // Adicionar informações relevantes se disponíveis
  if (escola['Município']) {
    descricao += ` - ${escola['Município']}`;
  }
  
  if (escola['Povos indigenas']) {
    descricao += ` | Povos: ${escola['Povos indigenas']}`;
  }
  
  if (escola['Linguas faladas']) {
    descricao += ` | Línguas: ${escola['Linguas faladas']}`;
  }
  
  if (escola['Modalidade de Ensino/turnos de funcionamento']) {
    descricao += ` | Modalidade: ${escola['Modalidade de Ensino/turnos de funcionamento']}`;
  }
  
  descricao += ' | Observatório de Professores Indígenas';
  
  // Limitar tamanho para redes sociais (ideal: 150-160 caracteres)
  if (descricao.length > 160) {
    descricao = descricao.substring(0, 157) + '...';
  }
  
  return descricao;
};

/**
 * Gera palavras-chave para SEO
 * @param {Object} escola - Dados da escola
 * @returns {string} Palavras-chave separadas por vírgula
 */
export const gerarKeywordsEscola = (escola) => {
  if (!escola) return 'escola indígena, educação indígena, São Paulo, OPIN';
  
  const keywords = [
    'escola indígena',
    'educação indígena',
    'São Paulo',
    'OPIN',
    'Observatório Professores Indígenas'
  ];
  
  if (escola.titulo) {
    keywords.push(escola.titulo.toLowerCase());
  }
  
  if (escola['Município']) {
    keywords.push(escola['Município'].toLowerCase());
  }
  
  if (escola['Povos indigenas']) {
    keywords.push(escola['Povos indigenas'].toLowerCase());
  }
  
  if (escola['Linguas faladas']) {
    keywords.push(escola['Linguas faladas'].toLowerCase());
  }
  
  return keywords.join(', ');
};

/**
 * Gera imagem otimizada para compartilhamento
 * @param {Object} escola - Dados da escola
 * @returns {string} URL da imagem
 */
export const gerarImagemEscola = (escola) => {
  // TODO: Implementar lógica para buscar imagem específica da escola
  // Por enquanto, usar imagem padrão
  return `${DEFAULT_META_CONFIG.siteUrl}${DEFAULT_META_CONFIG.defaultImage}`;
};

/**
 * Gera dados estruturados (JSON-LD) para SEO
 * @param {Object} escola - Dados da escola
 * @returns {Object} Dados estruturados
 */
export const gerarStructuredData = (escola) => {
  if (!escola) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": escola.titulo,
    "description": gerarDescricaoEscola(escola),
    "url": gerarUrlEscola(escola),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": escola['Município'] || '',
      "addressRegion": "São Paulo",
      "addressCountry": "BR"
    },
    "geo": escola.Latitude && escola.Longitude ? {
      "@type": "GeoCoordinates",
      "latitude": escola.Latitude,
      "longitude": escola.Longitude
    } : undefined,
    "educationalLevel": escola['Modalidade de Ensino/turnos de funcionamento'] || '',
    "numberOfStudents": escola['Numero de alunos'] || '',
    "provider": {
      "@type": "Organization",
      "name": DEFAULT_META_CONFIG.siteName,
      "url": DEFAULT_META_CONFIG.siteUrl
    }
  };
};