import { getPovoIndigenaLabel } from '../../../utils/povoIndigenaLabel';

// Utility functions for formatting escola data
export const formatters = {
  informacoesBasicas: (escola) => ({
    "Nome da Escola": escola.titulo,
    "Município": escola.municipio,
    "Endereço": escola.endereco,
    "Terra Indígena": escola.terra_indigena,
    "Parcerias com o Município": escola.parcerias_municipio,
    "Diretoria de Ensino": escola.diretoria_ensino,
    "Ano de Criação": escola.ano_criacao
  }),

  povosELinguas: (escola) => ({
    [getPovoIndigenaLabel(escola.povos_indigenas)]: escola.povos_indigenas,
    "Línguas Faladas": escola.linguas_faladas
  }),

  ensino: (escola) => ({
    "Modalidade de Ensino": escola.modalidade_ensino,
    "Número de Alunos": escola.numero_alunos,
    "Línguas Faladas": escola.linguas_faladas
  }),

  materiaisPedagogicos: (escola) => ({
    "Material Pedagógico Não Indígena": escola.material_nao_indigena,
    "Material Pedagógico Indígena": escola.material_indigena
  }),

  infraestrutura: (escola) => ({
    "Espaço Escolar e Estrutura": escola.espaco_escolar,
    "Acesso à Água": escola.acesso_agua,
    "Coleta de Lixo": escola.coleta_lixo,
    "Acesso à Internet": escola.acesso_internet,
    "Equipamentos Tecs": escola.equipamentos,
    "Modo de Acesso à Escola": escola.modo_acesso,
    "Merenda Diferenciada": escola.diferenciada
  }),

  gestaoEProfessores: (escola) => ({
    "Gestão/Nome": escola.gestao,
    "Outros Funcionários": escola.outros_funcionarios,
    "Professores Indígenas": escola.professores_indigenas,
    "Professores Não Indígenas": escola.professores_nao_indigenas,
    "Professores Falam a Língua Indígena": escola.professores_falam_lingua,
    "Formação dos Professores": escola.formacao_professores,
    "Formação Continuada": escola.formacao_continuada
  }),

  projetoPedagogico: (escola) => ({
    "PPP Elaborado com a Comunidade": escola.ppp_comunidade
  }),

  projetosEParcerias: (escola) => ({
    "Projetos em Andamento": escola.projetos_andamento,
    "Parcerias com Universidades": escola.parcerias_universidades,
    "Ações com ONGs ou Coletivos": escola.acoes_ongs,
    "Desejos da Comunidade": escola.desejos_comunidade
  }),

  redesSociaisEMidia: (escola) => ({
    "Utiliza Redes Sociais": escola.usa_redes_sociais,
    "Links das Redes Sociais": escola.links_redes_sociais,
    "História da Escola": escola.historia_escola
  }),

  midia: (escola) => ({
    "Imagens": escola.imagens,
    "Áudio": escola.audio,
    "Vídeo": escola.video
  }),

  links: (escola) => ({
    "Links": escola.links
  }),

  localizacao: (escola) => ({
    "Latitude": escola.Latitude,
    "Longitude": escola.Longitude
  })
};

// Helper function to format a section
export const formatSection = (title, data) => {
  const items = Object.entries(data).filter(([_, value]) => value);
  if (items.length === 0) return null;

  return {
    title,
    items
  };
};

// Get all sections for an escola
export const getEscolaSections = (escola) => [
  { title: "Informações Básicas", data: formatters.informacoesBasicas(escola) },
  { title: "Povos e Línguas", data: formatters.povosELinguas(escola) },
  { title: "Ensino", data: formatters.ensino(escola) },
  { title: "Materiais Pedagógicos", data: formatters.materiaisPedagogicos(escola) },
  { title: "Infraestrutura", data: formatters.infraestrutura(escola) },
  { title: "Equipe", data: formatters.gestaoEProfessores(escola) },
  { title: "Projeto Pedagógico", data: formatters.projetoPedagogico(escola) },
  { title: "Projetos e Parcerias", data: formatters.projetosEParcerias(escola) },
  { title: "Redes Sociais e Mídia", data: formatters.redesSociaisEMidia(escola) },
  { title: "Mídia", data: formatters.midia(escola) },
  { title: "Links", data: formatters.links(escola) },
  { title: "Localização", data: formatters.localizacao(escola) }
]; 