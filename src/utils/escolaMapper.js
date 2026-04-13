/**
 * Utilitário para mapear os dados brutos do banco de dados (escolas_completa)
 * para o formato esperado pelo frontend.
 */

export const mapEscolaData = (e) => {
  if (!e || typeof e !== 'object') return null;

  // Cálculo da merenda diferenciada (lógica restaurada)
  let diferenciada = e.diferenciada ?? null;
  if (diferenciada === null && e["Cozinha/Merenda escolar/diferenciada"]) {
    const partes = e["Cozinha/Merenda escolar/diferenciada"].split("/");
    diferenciada = diferenciada ?? partes[2]?.trim();
    diferenciada = diferenciada?.toLowerCase().startsWith("sim") ? true : diferenciada?.toLowerCase().startsWith("não") ? false : diferenciada;
  }

  // Coordenadas
  const latitude = e.Latitude ? parseFloat(e.Latitude) : null;
  const longitude = e.Longitude ? parseFloat(e.Longitude) : null;

  return {
    ...e,
    id: e.id,
    titulo: e.Escola,
    nome: e.Escola,
    municipio: e["Município"],
    endereco: e["Endereço"],
    logradouro: e.logradouro,
    numero: e.numero,
    complemento: e.complemento,
    bairro: e.bairro,
    cep: e.cep,
    estado: e.estado,
    terra_indigena: e["Terra Indigena (TI)"],
    parcerias_municipio: e["Parcerias com o município"],
    diretoria_ensino: e["Diretoria de Ensino"],
    povos_indigenas: e["Povos indigenas"],
    linguas_faladas: e["Linguas faladas"],
    ano_criacao: e["Ano de criação da escola"],
    modalidade_ensino: e["Modalidade de Ensino/turnos de funcionamento"],
    numero_alunos: e["Numero de alunos"],
    turnos_funcionamento: e["turnos_funcionamento"],
    espaco_escolar: e["Espaço escolar e estrutura"],
    acesso_agua: e["Acesso à água"],
    coleta_lixo: e["Tem coleta de lixo?"],
    acesso_internet: e["Acesso à internet"],
    equipamentos: e["Equipamentos Tecs"],
    modo_acesso: e["Modo de acesso à escola"],
    diferenciada,
    gestao: e["Gestão/Nome"],
    outros_funcionarios: e["Outros funcionários"],
    professores_indigenas: e["Quantidade de professores indígenas"],
    professores_nao_indigenas: e["Quantidade de professores não indígenas"],
    professores_falam_lingua: e["Professores falam a língua indígena?"],
    formacao_professores: e["Formação dos professores"],
    formacao_continuada: e["Formação continuada oferecida"],
    ppp_comunidade: e["PPP elaborado com a comunidade?"],
    material_nao_indigena: e["Material pedagógico não indígena"],
    material_indigena: e["Material pedagógico indígena"],
    projetos_andamento: e["Projetos em andamento"],
    parcerias_universidades: e["Parcerias com universidades?"],
    acoes_ongs: e["Ações com ONGs ou coletivos?"],
    desejos_comunidade: e["Desejos da comunidade para a escola"],
    usa_redes_sociais: e["Escola utiliza redes sociais?"],
    links_redes_sociais: e["Links das redes sociais"],
    historia_da_escola: e["historia_da_escola"],
    latitude,
    longitude,
    links: e.links,
    imagens: e.imagens,
    audio: e.audio,
    video: e.video,
    link_para_documentos: e.link_para_documentos,
    link_para_videos: e.link_para_videos,
    imagem_header: e.imagem_header,
    cards_visibilidade: e.cards_visibilidade,
    tipo: 'educacao',
    pontuacao: 100,
    pontuacaoPercentual: 100
  };
};

export default mapEscolaData;
