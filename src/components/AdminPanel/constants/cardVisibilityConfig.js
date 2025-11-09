// Configuração dos cards disponíveis para controle de visibilidade
export const CARD_VISIBILITY_CONFIG = [
  {
    id: 'basicInfo',
    label: 'Informações Básicas',
    description: 'Nome, município, endereço, terra indígena',
    defaultVisible: true,
    category: 'grid'
  },
  {
    id: 'modalidades',
    label: 'Modalidades de Ensino',
    description: 'Modalidades e turnos de funcionamento',
    defaultVisible: true,
    category: 'grid'
  },
  {
    id: 'infraestrutura',
    label: 'Infraestrutura',
    description: 'Estrutura física, água, internet, equipamentos',
    defaultVisible: true,
    category: 'grid'
  },
  {
    id: 'gestaoProfessores',
    label: 'Gestão e Professores',
    description: 'Direção, professores, formação profissional',
    defaultVisible: true,
    category: 'grid'
  },
  {
    id: 'projetosParcerias',
    label: 'Projetos e Parcerias',
    description: 'Projetos, parcerias, ONGs, desejos da comunidade',
    defaultVisible: true,
    category: 'grid'
  },
  {
    id: 'historiaEscola',
    label: 'História da Escola',
    description: 'História e contexto da escola',
    defaultVisible: true,
    category: 'standalone'
  },
  {
    id: 'imagensEscola',
    label: 'Imagens da Escola',
    description: 'Galeria de fotos da escola',
    defaultVisible: true,
    category: 'standalone'
  },
  {
    id: 'historiaProfessor',
    label: 'História dos Professores',
    description: 'Depoimentos e histórias dos professores',
    defaultVisible: true,
    category: 'standalone'
  },
  {
    id: 'documentos',
    label: 'Documentos',
    description: 'PDFs e documentos da escola',
    defaultVisible: true,
    category: 'standalone'
  },
  {
    id: 'videos',
    label: 'Vídeos',
    description: 'Vídeos e produções audiovisuais',
    defaultVisible: true,
    category: 'standalone'
  }
];

// Função helper para obter visibilidade padrão
export const getDefaultVisibility = () => {
  return CARD_VISIBILITY_CONFIG.reduce((acc, card) => {
    acc[card.id] = card.defaultVisible;
    return acc;
  }, {});
};

// Função helper para obter visibilidade de um card específico
// Considera primeiro a configuração individual da escola, depois a global
export const isCardVisible = (cardsVisibilidade, cardId, globalVisibility = null) => {
  // Se a escola tem configuração individual para este card, usa ela
  if (cardsVisibilidade && cardsVisibilidade.hasOwnProperty(cardId)) {
    return cardsVisibilidade[cardId] !== false;
  }
  
  // Se não tem configuração individual, usa a global
  if (globalVisibility && globalVisibility.hasOwnProperty(cardId)) {
    return globalVisibility[cardId] !== false;
  }
  
  // Default: visível
  return true;
};

