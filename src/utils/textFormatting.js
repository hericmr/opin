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