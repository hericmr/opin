/**
 * Utility functions for text formatting
 */

/**
 * Lista de siglas que devem permanecer em maiúsculas
 */
const SIGLAS_MAIUSCULAS = ['EE', 'EEI', 'CECI', 'EMIG'];
const PREPOSICOES_LIGACOES = ['de', 'do', 'da', 'dos', 'das', 'e', 'o', 'a', 'os', 'as', 'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'sob', 'sobre'];

/**
 * Capitalizes the first letter of each word in a string, keeping specific acronyms in uppercase
 * and keeping prepositions/conjunctions in lowercase (unless it's the first word).
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  // Primeiro, divide a string em palavras
  const words = str.split(/\s+/);
  
  // Processa cada palavra
  const processedWords = words.map((word, index) => {
    const wordUpper = word.toUpperCase();
    const wordLower = word.toLowerCase();

    // Verifica se a palavra é uma sigla que deve permanecer em maiúsculas
    if (SIGLAS_MAIUSCULAS.includes(wordUpper)) {
      return wordUpper;
    }
    
    // Verifica se é uma preposição/ligação (e não é a primeira palavra)
    if (index > 0 && PREPOSICOES_LIGACOES.includes(wordLower)) {
      return wordLower;
    }
    
    // Para outras palavras, aplica a capitalização normal
    const match = word.match(/^([^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]*)([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ])(.*)/);
    if (match) {
      return match[1] + match[2].toUpperCase() + match[3].toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
  
  // Junta as palavras de volta em uma string
  return processedWords.join(' ');
}; 

/**
 * Normalizes an address string by capitalizing words and handling common address abbreviations
 * @param {string} address - The address string to normalize
 * @returns {string} The normalized address string
 */
export const normalizeAddress = (address) => {
  if (!address || typeof address !== 'string') return '';

  // Lista de abreviações comuns em endereços
  const abbreviations = {
    'r.': 'Rua',
    'av.': 'Avenida',
    'al.': 'Alameda',
    'pr.': 'Praça',
    'tr.': 'Travessa',
    'rod.': 'Rodovia',
    'est.': 'Estrada',
    'n.': 'Número',
    'nº': 'Número',
    'apt.': 'Apartamento',
    'bl.': 'Bloco',
    'qd.': 'Quadra',
    'lt.': 'Lote',
    'km': 'KM',
    's/n': 'S/N'
  };

  // Primeiro, substitui as abreviações
  let normalized = address.toLowerCase();
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    normalized = normalized.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full);
  });

  // Depois aplica a capitalização de palavras
  return capitalizeWords(normalized);
};

/**
 * Formata o título da escola, garantindo que EEI e CECI sejam siglas maiúsculas
 * @param {string} titulo - O título original
 * @returns {string} O título formatado
 */
export const formatarTituloEscola = (titulo) => {
  if (!titulo) return '';
  
  // Normalizar variações de "EEI" no início do título
  const eeiPattern = /^([Ee]\.?[Ee]\.?[Ii]\.?)\s*/i;
  const matchEei = titulo.match(eeiPattern);
  
  if (matchEei) {
    const restoTitulo = titulo.replace(eeiPattern, '').trim();
    return `E.E.I. ${capitalizeWords(restoTitulo)}`;
  }

  // Normalizar variações de "CECI" no início do título
  const ceciPattern = /^([Cc]\.?[Ee]\.?[Cc]\.?[Ii]\.?)\s*/i;
  const matchCeci = titulo.match(ceciPattern);
  
  if (matchCeci) {
    const restoTitulo = titulo.replace(ceciPattern, '').trim();
    return `CECI ${capitalizeWords(restoTitulo)}`;
  }

  // Normalizar variações de "EMIG" no início do título
  const emigPattern = /^([Ee]\.?[Mm]\.?[Ii]\.?[Gg]\.?)\s*/i;
  const matchEmig = titulo.match(emigPattern);
  
  if (matchEmig) {
    const restoTitulo = titulo.replace(emigPattern, '').trim();
    return `EMIG ${capitalizeWords(restoTitulo)}`;
  }
  
  const emigExtensoPattern = /^escola\s+municipal\s+ind[ií]gena\s+(guarani\s+)?/i;
  const matchEmigExtenso = titulo.match(emigExtensoPattern);
  if (matchEmigExtenso) {
    const restoTitulo = titulo.replace(emigExtensoPattern, '').trim();
    return `EMIG ${capitalizeWords(restoTitulo)}`;
  }
  
  const tituloLower = titulo.toLowerCase();
  
  if (tituloLower.includes('escola estadual') && tituloLower.includes('aldeia')) {
    const partes = titulo.split(' ');
    const indiceAldeia = partes.findIndex(parte => parte.toLowerCase().includes('aldeia'));
    if (indiceAldeia !== -1 && indiceAldeia < partes.length - 1) {
      const nomeAldeia = partes.slice(indiceAldeia + 1).join(' ');
      return `E.E.I. ${capitalizeWords(nomeAldeia)}`;
    }
  }
  
  return capitalizeWords(titulo);
};
 