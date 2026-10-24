import professoresData from '../data/professores.json';
import { historiasSeres, locaisSeres } from '../data/historiasSeres';
import { criarSlug } from './slug';

// Grafias usadas no livro que diferem do cadastro do Lindiflix
const ALIASES_LINDIFLIX = {
  'Kerexu Mirim da Silva': ['Kerexu Mirin da Silva'],
  'Leonardo Edileno Wera Tupã Macena': ['Leonardo Macena Wera Tupã']
};

const normalizeNome = (str = '') =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Vincula nomes mencionados nos créditos com os professores do Lindiflix
export const getProfessoresLindiflix = (textoNomes = '') => {
  if (!textoNomes) return [];
  const textoNorm = normalizeNome(textoNomes);
  return professoresData.filter((prof) => {
    const nomeProf = prof.nome || prof.professor || prof.professora;
    if (!nomeProf) return false;
    const nomes = [nomeProf, ...(ALIASES_LINDIFLIX[nomeProf] || [])];
    return nomes.some((nome) => textoNorm.includes(normalizeNome(nome)));
  });
};

export const getProfessoresDaHistoria = (historia) =>
  getProfessoresLindiflix(
    `${historia?.narradores || ''} ${historia?.escritora || ''} ${historia?.escritor || ''}`
  );

export const historiaSlug = (historia) => criarSlug(historia.subtitulo || historia.titulo || String(historia.id));

export const findHistoriaBySlug = (slug) =>
  historiasSeres.find((h) => historiaSlug(h) === slug) || null;

export const localDaHistoria = (historia) =>
  locaisSeres.find((local) => local.historias.includes(historia?.id)) || null;

// Mistura uma cor hexadecimal com preto (fator < 1) para obter um tom legível sobre fundo claro
export const escurecerCor = (hex, fator = 0.55) => {
  const valor = hex.replace('#', '');
  const canais = [0, 2, 4].map((i) => Math.round(parseInt(valor.slice(i, i + 2), 16) * fator));
  return `#${canais.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

// Mistura uma cor hexadecimal com branco; quanto = 0 devolve branco, 1 devolve a própria cor
export const clarearCor = (hex, quanto = 0.3) => {
  const valor = hex.replace('#', '');
  const canais = [0, 2, 4].map((i) => {
    const canal = parseInt(valor.slice(i, i + 2), 16);
    return Math.round(255 - (255 - canal) * quanto);
  });
  return `#${canais.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

export const corComAlpha = (hex, alpha) => {
  const valor = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(valor.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
