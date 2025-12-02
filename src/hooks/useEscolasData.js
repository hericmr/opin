import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../dbClient';

export function useEscolasData() {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataPoints = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('escolas_completa')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw err;
    }
  }, []);

  const formatData = useCallback((dataPoints) => {
    if (!Array.isArray(dataPoints)) return [];
    const escolasSemCoordenadas = {
      vazias: [],
      invalidas: [],
      foraDosLimites: []
    };
    const formattedData = dataPoints
      .filter(e => e && typeof e === 'object' && !Array.isArray(e) && e.Escola)
      .map((e) => {
        const infoEscola = {
          id: e.id,
          nome: e.Escola,
          municipio: e["Município"],
          endereco: e["Endereço"],
          diretoria: e["Diretoria de Ensino"],
          terra_indigena: e["Terra Indigena (TI)"],
          povos: e["Povos indigenas"],
          linguas: e["Linguas faladas"],
          latitude_original: e.Latitude,
          longitude_original: e.Longitude
        };
        if (e.Latitude === null || e.Latitude === undefined || 
            e.Longitude === null || e.Longitude === undefined) {
          escolasSemCoordenadas.vazias.push({ ...infoEscola, problema: "Coordenadas vazias (null/undefined)", detalhes: { latitude: e.Latitude, longitude: e.Longitude } });
          return null;
        }
        const latitude = parseFloat(e.Latitude);
        const longitude = parseFloat(e.Longitude);
        if (isNaN(latitude) || isNaN(longitude)) {
          escolasSemCoordenadas.invalidas.push({ ...infoEscola, problema: "Coordenadas não são números válidos", detalhes: { latitude: e.Latitude, longitude: e.Longitude, tipo_latitude: typeof e.Latitude, tipo_longitude: typeof e.Longitude } });
          return null;
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          escolasSemCoordenadas.foraDosLimites.push({ ...infoEscola, problema: "Coordenadas fora dos limites válidos", detalhes: { latitude, longitude, limites: { latMin: -90, latMax: 90, lngMin: -180, lngMax: 180 } } });
          return null;
        }
        let diferenciada = e.diferenciada ?? null;
        if (diferenciada === null && e["Cozinha/Merenda escolar/diferenciada"]) {
          const partes = e["Cozinha/Merenda escolar/diferenciada"].split("/");
          diferenciada = diferenciada ?? partes[2]?.trim();
          diferenciada = diferenciada?.toLowerCase().startsWith("sim") ? true : diferenciada?.toLowerCase().startsWith("não") ? false : diferenciada;
        }
        return {
          titulo: e.Escola,
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
          id: e.id,
          links: e.links,
          imagens: e.imagens,
          audio: e.audio,
          video: e.video,
          link_para_documentos: e.link_para_documentos,
          link_para_videos: e.link_para_videos,
          imagem_header: e.imagem_header,
          tipo: 'educacao',
          pontuacao: 100,
          pontuacaoPercentual: 100
        };
      })
      .filter(ponto => ponto !== null);
    return formattedData;
  }, []);

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      setError(null);
      try {
        let data = await fetchDataPoints();
        data = formatData(data);
        setDataPoints(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [fetchDataPoints, formatData]);

  return { dataPoints, loading, error };
} 