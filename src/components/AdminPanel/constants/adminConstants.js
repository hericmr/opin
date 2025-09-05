// Configuração das abas do painel de administração
export const ADMIN_TABS = [
  { id: 'dados-basicos', label: 'Dados Básicos' },
  { id: 'povos-linguas', label: 'Povos' },
  { id: 'modalidades', label: 'Modalidades' },
  { id: 'infraestrutura', label: 'Infraestrutura' },
  { id: 'gestao-professores', label: 'Gestores' },
  { id: 'material-pedagogico', label: 'Material Pedagógico' },
  { id: 'projetos-parcerias', label: 'Projetos e Parcerias' },
  { id: 'redes-sociais', label: 'Redes Sociais' },
  { id: 'video', label: 'Vídeo' },
  { id: 'historias', label: 'Histórias' },
  { id: 'historia-professores', label: 'História dos Professores' },
  { id: 'test-foto-rosto', label: '🧪 Teste Foto Rosto' },
  { id: 'coordenadas', label: 'Coordenadas' },
  { id: 'imagens-escola', label: 'Imagens da Escola' },
  { id: 'imagens-professores', label: 'Imagens dos Professores' },
  { id: 'documentos', label: 'Documentos' }
];

// Configurações de UI
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  SIDEBAR_WIDTH: 'w-64',
  SIDEBAR_WIDTH_MOBILE: 'max-w-[80vw]',
  SIDEBAR_TOP_OFFSET: 72,
};

// Estados de salvamento
export const SAVE_STATES = {
  IDLE: 'idle',
  SAVING: 'saving',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Configurações de formulário
export const FORM_CONFIG = {
  DEFAULT_ACTIVE_TAB: 'dados-basicos',
  VALIDATION_RULES: {
    REQUIRED_FIELDS: ['Escola'],
  },
};

// Configurações de busca
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
}; 