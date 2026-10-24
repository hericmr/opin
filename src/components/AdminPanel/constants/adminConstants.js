import { BREAKPOINTS } from '../../../constants/breakpoints';

// Configuração das abas do painel de administração
export const ADMIN_TABS = [
  { id: 'dados-basicos', label: 'Dados Básicos', group: 'escola' },
  { id: 'povos-linguas', label: 'Povos', group: 'escola' },
  { id: 'modalidades', label: 'Modalidades', group: 'escola' },
  { id: 'infraestrutura', label: 'Infraestrutura', group: 'escola' },
  { id: 'coordenadas', label: 'Coordenadas', group: 'escola' },

  { id: 'gestao-professores', label: 'Equipe', group: 'pessoas' },
  { id: 'funcionarios', label: 'Funcionários', group: 'pessoas' },
  { id: 'historia-professores', label: 'História dos Professores', group: 'pessoas' },

  { id: 'material-pedagogico', label: 'Material Pedagógico', group: 'conteudo' },
  { id: 'projetos-parcerias', label: 'Projetos e Parcerias', group: 'conteudo' },
  { id: 'historias', label: 'Histórias', group: 'conteudo' },
  { id: 'jogos', label: 'Jogos', group: 'conteudo' },
  { id: 'redes-sociais', label: 'Redes Sociais', group: 'conteudo' },

  { id: 'video', label: 'Vídeo', group: 'midia' },
  { id: 'imagens-escola', label: 'Imagens da Escola', group: 'midia' },
  { id: 'imagens-professores', label: 'Imagens dos Professores', group: 'midia' },
  { id: 'documentos', label: 'Documentos', group: 'midia' }
];

// Grupos em que as abas aparecem na navegação do editor
export const ADMIN_TAB_GROUPS = [
  { id: 'escola', label: 'Escola' },
  { id: 'pessoas', label: 'Pessoas' },
  { id: 'conteudo', label: 'Conteúdo' },
  { id: 'midia', label: 'Mídia' }
];

// Configurações de UI
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: BREAKPOINTS.mobile,
  SIDEBAR_WIDTH: 'w-64',
  SIDEBAR_WIDTH_MOBILE: 'max-w-[80vw]',
  // Altura da navbar antes de ser medida (useNavbarHeight)
  NAVBAR_FALLBACK_HEIGHT: 72,
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