/**
 * Verifica se um valor tem conteúdo real (não é null, undefined ou string vazia).
 * @param {*} value
 * @returns {boolean}
 */
export const hasContent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};
