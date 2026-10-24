// Colunas da edição em tabela. A mesma lista alimenta a tabela e o CSV exportado,
// para que o arquivo traga exatamente o que se vê na tela.
//
// width: largura da coluna em px
// type: 'text' (uma linha), 'long' (texto longo, editado em caixa maior) ou 'number'

export const COLUMN_GROUPS = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'ensino', label: 'Ensino' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'material', label: 'Material' },
  { id: 'links', label: 'Links' },
];

// Coluna fixa à esquerda, sempre visível
export const NAME_COLUMN = { key: 'Escola', label: 'Escola', width: 240, type: 'text' };

export const TABLE_COLUMNS = [
  { key: 'Município', label: 'Município', width: 150, type: 'text', group: 'identificacao' },
  { key: 'Terra Indigena (TI)', label: 'Terra Indígena', width: 160, type: 'text', group: 'identificacao' },
  { key: 'Diretoria de Ensino', label: 'Diretoria', width: 150, type: 'text', group: 'identificacao' },
  { key: 'Ano de criação da escola', label: 'Ano de criação', width: 110, type: 'text', group: 'identificacao' },
  { key: 'Parcerias com o município', label: 'Parcerias', width: 240, type: 'long', group: 'identificacao' },

  { key: 'Endereço', label: 'Endereço', width: 260, type: 'long', group: 'endereco' },
  { key: 'logradouro', label: 'Logradouro', width: 200, type: 'text', group: 'endereco' },
  { key: 'numero', label: 'Número', width: 90, type: 'text', group: 'endereco' },
  { key: 'complemento', label: 'Complemento', width: 140, type: 'text', group: 'endereco' },
  { key: 'bairro', label: 'Bairro', width: 150, type: 'text', group: 'endereco' },
  { key: 'cep', label: 'CEP', width: 110, type: 'text', group: 'endereco' },
  { key: 'estado', label: 'Estado', width: 80, type: 'text', group: 'endereco' },
  { key: 'Latitude', label: 'Latitude', width: 120, type: 'text', group: 'endereco' },
  { key: 'Longitude', label: 'Longitude', width: 120, type: 'text', group: 'endereco' },

  { key: 'Modalidade de Ensino/turnos de funcionamento', label: 'Modalidade', width: 260, type: 'long', group: 'ensino' },
  { key: 'Numero de alunos', label: 'Alunos', width: 90, type: 'number', group: 'ensino' },
  { key: 'turnos_funcionamento', label: 'Turnos', width: 170, type: 'text', group: 'ensino' },
  { key: 'PPP elaborado com a comunidade?', label: 'PPP com a comunidade', width: 180, type: 'text', group: 'ensino' },

  { key: 'Espaço escolar e estrutura', label: 'Estrutura', width: 280, type: 'long', group: 'estrutura' },
  { key: 'Acesso à internet', label: 'Internet', width: 100, type: 'text', group: 'estrutura' },
  { key: 'Equipamentos Tecs', label: 'Equipamentos', width: 240, type: 'long', group: 'estrutura' },

  { key: 'Gestão/Nome', label: 'Gestão', width: 200, type: 'long', group: 'equipe' },
  { key: 'Outros funcionários', label: 'Funcionários', width: 220, type: 'long', group: 'equipe' },
  { key: 'Quantidade de professores indígenas', label: 'Prof. indígenas', width: 130, type: 'text', group: 'equipe' },
  { key: 'Quantidade de professores não indígenas', label: 'Prof. não indígenas', width: 150, type: 'text', group: 'equipe' },
  { key: 'Formação dos professores', label: 'Formação', width: 240, type: 'long', group: 'equipe' },
  { key: 'nome_professor', label: 'Nome do professor', width: 180, type: 'text', group: 'equipe' },
  { key: 'professores_indigenas', label: 'Prof. indígenas (detalhe)', width: 240, type: 'long', group: 'equipe' },
  { key: 'professores_nao_indigenas', label: 'Prof. não indígenas (detalhe)', width: 240, type: 'long', group: 'equipe' },
  { key: 'formacao_professores', label: 'Formação (detalhe)', width: 240, type: 'long', group: 'equipe' },
  { key: 'outros_funcionarios', label: 'Outros funcionários (detalhe)', width: 240, type: 'long', group: 'equipe' },
  { key: 'gestao', label: 'Gestão (detalhe)', width: 240, type: 'long', group: 'equipe' },

  { key: 'Material pedagógico não indígena', label: 'Material não indígena', width: 240, type: 'long', group: 'material' },
  { key: 'Material pedagógico indígena', label: 'Material indígena', width: 240, type: 'long', group: 'material' },

  { key: 'links', label: 'Links', width: 240, type: 'long', group: 'links' },
  { key: 'link_para_videos', label: 'Vídeos', width: 240, type: 'long', group: 'links' },
];
