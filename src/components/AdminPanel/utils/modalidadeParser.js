/**
 * Utilitário centralizado para parsing de modalidades
 * Garante consistência entre AdminPanel e PainelInformacoes
 */

/**
 * Parseia texto de modalidades para uma lista de itens
 * Suporta múltiplos delimitadores: \n, –, ;
 * @param {string} text - Texto a ser parseado
 * @returns {string[]} Array de modalidades
 */
export const parseModalidades = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  let items = [];
  
  // Normalizar: dividir por múltiplos delimitadores
  // Prioridade: quebra de linha > traço longo > ponto e vírgula
  if (text.includes('\n')) {
    items = text
      .split('\n')
      .flatMap(line => {
        line = line.trim();
        if (!line) return [];
        // Se a linha contém traço longo, divide também
        if (line.includes('–')) {
          return line.split('–').map(item => item.trim()).filter(Boolean);
        }
        // Se a linha contém ponto e vírgula, divide também
        if (line.includes(';')) {
          return line.split(';').map(item => item.trim()).filter(Boolean);
        }
        return [line];
      });
  } else if (text.includes('–')) {
    items = text
      .split('–')
      .map(item => item.trim())
      .filter(Boolean);
  } else if (text.includes(';')) {
    items = text
      .split(';')
      .map(item => item.trim())
      .filter(Boolean);
  } else {
    items = text.trim() ? [text.trim()] : [];
  }
  
  return items.filter(Boolean);
};

/**
 * Valida se uma modalidade está na lista de opções
 * @param {string} modalidade - Modalidade a validar
 * @param {string[]} MODALIDADES_OPTIONS - Lista de opções válidas
 * @returns {boolean}
 */
export const isValidModalidade = (modalidade, MODALIDADES_OPTIONS) => {
  return MODALIDADES_OPTIONS && MODALIDADES_OPTIONS.includes(modalidade);
};

/**
 * Formata array de modalidades para texto salvo
 * Usa `;` como delimitador padrão (compatível com novo sistema)
 * @param {string[]} modalidades - Array de modalidades
 * @returns {string} Texto formatado
 */
export const formatModalidades = (modalidades) => {
  if (!Array.isArray(modalidades)) return '';
  return modalidades.filter(Boolean).join('; ').trim();
};

export default {
  parseModalidades,
  isValidModalidade,
  formatModalidades
};
