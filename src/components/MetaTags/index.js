/**
 * Índice dos componentes de meta tags
 * Facilita importações e mantém organização modular
 */

// Componentes principais
export { default as MetaTagsManager } from './MetaTagsManager';
export { default as MetaTagsDetector } from './MetaTagsDetector';
export { default as OpenGraphTags } from './OpenGraphTags';
export { default as TwitterCardTags } from './TwitterCardTags';
export { default as GoogleSEOTags } from './GoogleSEOTags';
export { default as StructuredDataTags } from './StructuredDataTags';

// Re-exportar utilitários para conveniência
export * from '../../utils/metaTags';

// Re-exportar configurações
export { META_TAGS_CONFIG, getMetaConfig, updateMetaConfig } from '../../config/metaTagsConfig';

// Re-exportar hooks
export { useMetaTags, useShareUrl, useShareData } from '../../hooks/useMetaTags';