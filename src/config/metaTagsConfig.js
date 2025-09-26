/**
 * Configurações centralizadas para meta tags
 * Facilita customizações e manutenção
 */

export const META_TAGS_CONFIG = {
  // Configurações básicas do site
  site: {
    name: 'OPIN - Observatório dos Professores Indígenas',
    url: 'https://hericmr.github.io/opin',
    description: 'Portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil.',
    locale: 'pt_BR',
    country: 'BR',
    region: 'SP'
  },

  // Configurações de imagem
  images: {
    default: '/opin/onça.svg',
    width: 1200,
    height: 630,
    type: 'image/png'
  },

  // Configurações de redes sociais
  social: {
    twitter: {
      handle: '@OPIN_SP', // Adicione se existir
      site: '@OPIN_SP'
    },
    facebook: {
      appId: '', // Adicione se tiver app do Facebook
      admins: '' // Adicione IDs de administradores se necessário
    }
  },

  // Configurações de SEO
  seo: {
    robots: 'index, follow',
    googlebot: 'index, follow',
    keywords: [
      'escola indígena',
      'educação indígena',
      'São Paulo',
      'OPIN',
      'Observatório Professores Indígenas',
      'povos indígenas',
      'línguas indígenas',
      'educação diferenciada'
    ]
  },

  // Configurações de dados estruturados
  structuredData: {
    organization: {
      '@type': 'Organization',
      name: 'OPIN - Observatório dos Professores Indígenas',
      url: 'https://hericmr.github.io/opin',
      logo: 'https://hericmr.github.io/opin/onça.svg',
      description: 'Portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil.'
    },
    website: {
      '@type': 'WebSite',
      name: 'OPIN - Observatório dos Professores Indígenas',
      url: 'https://hericmr.github.io/opin',
      description: 'Portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil.',
      inLanguage: 'pt-BR'
    }
  },

  // Configurações de compartilhamento
  sharing: {
    // Limites de caracteres para diferentes redes sociais
    limits: {
      title: 60, // Twitter
      description: 160, // Facebook/WhatsApp
      descriptionLong: 300 // LinkedIn
    },
    
    // Templates de texto para compartilhamento
    templates: {
      title: '{nomeEscola} - Escola Indígena',
      description: 'Escola Indígena: {nomeEscola}{municipio}{povos}{linguas} | Observatório de Professores Indígenas'
    }
  },

  // Configurações de debug
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logMetaTags: true,
    showTestComponent: false
  }
};

// Função para obter configuração específica
export const getMetaConfig = (section, key = null) => {
  if (key) {
    return META_TAGS_CONFIG[section]?.[key];
  }
  return META_TAGS_CONFIG[section];
};

// Função para atualizar configuração
export const updateMetaConfig = (section, key, value) => {
  if (META_TAGS_CONFIG[section]) {
    META_TAGS_CONFIG[section][key] = value;
  }
};

export default META_TAGS_CONFIG;