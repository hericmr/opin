import { supabase } from '../dbClient';
import { mapEscolaData } from '../utils/escolaMapper';

// Campos leves para listagem no mapa e busca.
// Dados detalhados (história, projetos, mídia) são carregados on-demand.
const CAMPOS_LISTAGEM = [
  'id',
  'Escola',
  'Município',
  'Endereço',
  'Latitude',
  'Longitude',
  'Terra Indigena (TI)',
  'Povos indigenas',
  'Diretoria de Ensino',
  'Modalidade de Ensino/turnos de funcionamento',
  'Numero de alunos',
  'imagem_header',
  'cards_visibilidade',
].map(f => `"${f}"`).join(', ');

/**
 * Converte as linhas de escolas_completa para o formato do front.
 * Descarta linhas sem nome de escola; mantém as sem coordenadas
 * (a busca funciona sem elas; o mapa simplesmente não as plota).
 * @param {Array} linhas
 * @returns {Array}
 */
export const formatarEscolasListagem = (linhas) => {
  if (!Array.isArray(linhas)) return [];
  return linhas
    .filter(e => e && typeof e === 'object' && !Array.isArray(e) && e.Escola)
    .map(mapEscolaData)
    .filter(ponto => ponto !== null);
};

/**
 * Lista todas as escolas com os campos de listagem, já formatadas.
 * @returns {Promise<Array>}
 */
export const getEscolasListagem = async () => {
  const { data, error } = await supabase
    .from('escolas_completa')
    .select(CAMPOS_LISTAGEM);
  if (error) throw error;
  return formatarEscolasListagem(data || []);
};
