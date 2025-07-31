// Lista de modalidades de ensino organizadas por categoria
export const MODALIDADES_OPTIONS = [
  // 1. Educação Infantil
  'Educação Infantil',
  'Educação Infantil (Idade 0 a 6 anos)',
  'Educação Infantil (Pré-escola I e II) – 1 sala multisseriada',
  'Educação Infantil (Pré-escola I) – 1 sala regular',
  'Educação Infantil + Ensino Fundamental – multisseriado',
  'Educação Infantil + Ensino Fundamental – regular e multisseriado',
  
  // 2. Educação Infantil + Ensino Fundamental
  'Educação Infantil + Ensino Fundamental',
  'Educação Infantil + Ensino Fundamental (Anos Iniciais e Anos Finais)',
  'Educação Infantil + Ensino Fundamental (Anos Iniciais multisseriado + Anos Finais multisseriado)',
  'Educação Infantil + Ensino Fundamental (1º ao 9º ano) – Salas multisseriadas',
  'Educação Infantil + Ensino Fundamental (Pré I + 1º ao 4º ano) – 1 sala multisseriada',
  'Educação Infantil + Ensino Fundamental com EJA – Multisseriado',
  
  // 3. Ensino Fundamental - Anos Iniciais
  'Ensino Fundamental Anos Iniciais (1º ao 3º)',
  'Ensino Fundamental Anos Iniciais (1º ao 5º ano) – 1 sala multisseriada',
  'Ensino Fundamental Anos Iniciais (4º e 5º ano) – 1 sala multisseriada',
  'Ensino Fundamental Anos Iniciais – EJA (1º ao 5º ano) – multisseriado',
  
  // 3. Ensino Fundamental - Anos Finais
  'Ensino Fundamental Anos Finais (6º ao 9º ano) – 1 sala multisseriada',
  'Ensino Fundamental Anos Finais – EJA (6º ao 9º ano) – multisseriado',
  
  // 3. Ensino Fundamental - Ambos
  'Ensino Fundamental (Anos Iniciais e Finais) – regular e multisseriado',
  'Ensino Fundamental – Atendimento temporário em escola não indígena',
  
  // 4. Ensino Médio
  'Ensino Médio (1º ao 3º ano) – regular',
  'Ensino Médio (1º ao 3º ano) – multisseriado',
  'Ensino Médio – EJA (1º ao 3º ano) – multisseriado',
  'Ensino Médio – Não há atendimento'
];

// Categorias para organização visual
export const MODALIDADES_CATEGORIAS = [
  {
    id: 'educacao-infantil',
    titulo: '1. Educação Infantil',
    indices: [0, 1, 2, 3, 4, 5]
  },
  {
    id: 'educacao-infantil-fundamental',
    titulo: '2. Educação Infantil + Ensino Fundamental',
    indices: [6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'ensino-fundamental',
    titulo: '3. Ensino Fundamental',
    indices: [13, 14, 15, 16, 17, 18, 19, 20]
  },
  {
    id: 'ensino-medio',
    titulo: '4. Ensino Médio',
    indices: [21, 22, 23, 24]
  }
];

// Função para obter modalidades por categoria
export const getModalidadesByCategoria = (categoriaId) => {
  const categoria = MODALIDADES_CATEGORIAS.find(cat => cat.id === categoriaId);
  if (!categoria) return [];
  
  return categoria.indices.map(index => MODALIDADES_OPTIONS[index]);
};

// Função para validar se uma modalidade existe na lista
export const isValidModalidade = (modalidade) => {
  return MODALIDADES_OPTIONS.includes(modalidade);
};

// Função para obter categoria de uma modalidade
export const getCategoriaByModalidade = (modalidade) => {
  const index = MODALIDADES_OPTIONS.indexOf(modalidade);
  if (index === -1) return null;
  
  return MODALIDADES_CATEGORIAS.find(cat => 
    cat.indices.includes(index)
  );
}; 