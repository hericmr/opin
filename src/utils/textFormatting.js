/**
 * Utility functions for text formatting
 */

/**
 * Lista de siglas que devem permanecer em maiúsculas
 */
const SIGLAS_MAIUSCULAS = ['EE', 'EEI'];

/**
 * Capitalizes the first letter of each word in a string, keeping specific acronyms in uppercase
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  // Primeiro, divide a string em palavras
  const words = str.split(/\s+/);
  
  // Processa cada palavra
  const processedWords = words.map(word => {
    // Verifica se a palavra é uma sigla que deve permanecer em maiúsculas
    if (SIGLAS_MAIUSCULAS.includes(word.toUpperCase())) {
      return word.toUpperCase();
    }
    
    // Para outras palavras, aplica a capitalização normal
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