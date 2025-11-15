/**
 * Utilitário para comparar dados e identificar campos alterados
 */

/**
 * Normaliza valores para comparação (remove espaços, trata null/undefined)
 */
const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  return String(value);
};

/**
 * Compara dois objetos e retorna lista de campos que foram alterados
 * @param {Object} dadosAntigos - Dados originais da escola
 * @param {Object} dadosNovos - Dados novos da escola
 * @returns {Array} Array de objetos { campo, valorAntigo, valorNovo }
 */
export const identificarCamposAlterados = (dadosAntigos, dadosNovos) => {
  if (!dadosAntigos || !dadosNovos) return [];

  const camposAlterados = [];
  const todosCampos = new Set([
    ...Object.keys(dadosAntigos),
    ...Object.keys(dadosNovos)
  ]);

  // Campos a ignorar na comparação
  const camposIgnorar = [
    'id',
    'created_at',
    'updated_at',
    'activeTab',
    'imagem_header' // Pode ser alterado separadamente
  ];

  todosCampos.forEach(campo => {
    // Ignorar campos especiais
    if (camposIgnorar.includes(campo)) return;

    const valorAntigo = normalizeValue(dadosAntigos[campo]);
    const valorNovo = normalizeValue(dadosNovos[campo]);

    // Se os valores são diferentes, o campo foi alterado
    if (valorAntigo !== valorNovo) {
      camposAlterados.push({
        campo,
        valorAntigo: dadosAntigos[campo] || '',
        valorNovo: dadosNovos[campo] || '',
        label: obterLabelCampo(campo)
      });
    }
  });

  return camposAlterados;
};

/**
 * Obtém um label legível para o campo
 */
const obterLabelCampo = (campo) => {
  const labels = {
    'Escola': 'Nome da Escola',
    'Município': 'Município',
    'Endereço': 'Endereço',
    'Terra Indigena (TI)': 'Terra Indígena',
    'Escola Estadual ou Municipal': 'Tipo de Escola',
    'Parcerias com o município': 'Parcerias com Município',
    'Diretoria de Ensino': 'Diretoria de Ensino',
    'Ano de criação da escola': 'Ano de Criação',
    'Povos indigenas': 'Povos Indígenas',
    'Linguas faladas': 'Línguas Faladas',
    'Modalidade de Ensino/turnos de funcionamento': 'Modalidade de Ensino',
    'Numero de alunos': 'Número de Alunos',
    'turnos_funcionamento': 'Turnos de Funcionamento',
    'Espaço escolar e estrutura': 'Espaço Escolar',
    'Acesso à água': 'Acesso à Água',
    'Tem coleta de lixo?': 'Coleta de Lixo',
    'Acesso à internet': 'Acesso à Internet',
    'Equipamentos Tecs': 'Equipamentos Técnicos',
    'Modo de acesso à escola': 'Modo de Acesso',
    'Gestão/Nome': 'Gestão',
    'Outros funcionários': 'Outros Funcionários',
    'Quantidade de professores indígenas': 'Professores Indígenas',
    'Quantidade de professores não indígenas': 'Professores Não Indígenas',
    'Professores falam a língua indígena?': 'Professores Falam Língua Indígena',
    'Formação dos professores': 'Formação dos Professores',
    'Formação continuada oferecida': 'Formação Continuada',
    'PPP elaborado com a comunidade?': 'PPP com Comunidade',
    'Material pedagógico não indígena': 'Material Não Indígena',
    'Material pedagógico indígena': 'Material Indígena',
    'Práticas pedagógicas indígenas': 'Práticas Pedagógicas Indígenas',
    'Formas de avaliação': 'Formas de Avaliação',
    'Projetos em andamento': 'Projetos em Andamento',
    'Parcerias com universidades?': 'Parcerias com Universidades',
    'Ações com ONGs ou coletivos?': 'Ações com ONGs',
    'Desejos da comunidade para a escola': 'Desejos da Comunidade',
    'Escola utiliza redes sociais?': 'Uso de Redes Sociais',
    'Links das redes sociais': 'Links Redes Sociais',
    'historia_da_escola': 'História da Escola',
    'Latitude': 'Latitude',
    'Longitude': 'Longitude',
    'link_para_videos': 'Links de Vídeos',
    'logradouro': 'Logradouro',
    'numero': 'Número',
    'complemento': 'Complemento',
    'bairro': 'Bairro',
    'cep': 'CEP',
    'estado': 'Estado',
    'diferenciada': 'Diferenciada'
  };

  return labels[campo] || campo;
};

