/**
 * Utility functions for date formatting
 */

/**
 * Converte uma data do formato ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
 * @param {string} isoDate - Data no formato ISO (YYYY-MM-DD)
 * @returns {string} Data no formato brasileiro (DD/MM/YYYY) ou string vazia se inválida
 */
export const formatDateToBrazilian = (isoDate) => {
  if (!isoDate || isoDate === '') return '';
  
  try {
    // Se já está no formato brasileiro, retorna como está
    if (isoDate.includes('/') && isoDate.length === 10) {
      return isoDate;
    }
    
    // Tenta parsear como ISO (YYYY-MM-DD)
    const date = new Date(isoDate + 'T00:00:00');
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (e) {
    return '';
  }
};

/**
 * Converte uma data do formato brasileiro (DD/MM/YYYY) para formato ISO (YYYY-MM-DD)
 * @param {string} brazilianDate - Data no formato brasileiro (DD/MM/YYYY)
 * @returns {string} Data no formato ISO (YYYY-MM-DD) ou string vazia se inválida
 */
export const formatDateToISO = (brazilianDate) => {
  if (!brazilianDate || brazilianDate === '') return '';
  
  // Se já está no formato ISO, retorna como está
  if (brazilianDate.includes('-') && brazilianDate.length === 10) {
    return brazilianDate;
  }
  
  // Remove caracteres não numéricos exceto barras
  const cleaned = brazilianDate.replace(/[^\d/]/g, '');
  
  // Se não tem barras, tenta formatar automaticamente
  if (!cleaned.includes('/')) {
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length === 8) {
      const day = digits.substring(0, 2);
      const month = digits.substring(2, 4);
      const year = digits.substring(4, 8);
      const formatted = `${day}/${month}/${year}`;
      return formatBrazilianToIso(formatted);
    }
    return '';
  }
  
  return formatBrazilianToIso(cleaned);
};

/**
 * Função auxiliar para converter formato brasileiro para ISO
 */
const formatBrazilianToIso = (brazilianDate) => {
  const parts = brazilianDate.split('/');
  if (parts.length !== 3) return '';
  
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];
  
  // Validação básica
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return '';
  if (parseInt(month) < 1 || parseInt(month) > 12) return '';
  if (parseInt(day) < 1 || parseInt(day) > 31) return '';
  
  // Validação de data válida
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  if (isNaN(date.getTime())) return '';
  if (date.getDate() !== parseInt(day) || date.getMonth() + 1 !== parseInt(month)) return '';
  
  return `${year}-${month}-${day}`;
};

/**
 * Formata uma data para exibição no formato brasileiro usando toLocaleDateString
 * @param {string|Date} date - Data em formato ISO ou objeto Date
 * @returns {string} Data formatada no formato brasileiro (DD/MM/YYYY)
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  try {
    // Se já é um objeto Date
    if (date instanceof Date) {
      return date.toLocaleDateString('pt-BR');
    }
    
    // Se é uma string ISO (YYYY-MM-DD)
    if (typeof date === 'string') {
      // Tenta parsear como ISO
      const dateObj = new Date(date + 'T00:00:00');
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('pt-BR');
      }
      
      // Se já está no formato brasileiro, retorna como está
      if (date.includes('/') && date.length === 10) {
        return date;
      }
    }
    
    return '';
  } catch (e) {
    return '';
  }
};

