import { useMemo } from 'react';
import { fieldCategories } from '../constants/completenessConstants';

/**
 * Hook para cálculos de completude de dados
 * 
 * @param {Array} data - Dados das escolas
 * @returns {Object} Funções e utilitários para cálculos de completude
 */
export const useCompletenessCalculations = (data = []) => {
  // Função para calcular completude de um campo
  const calculateFieldCompleteness = (fieldName) => {
    if (!data || data.length === 0) return 0;
    
    const totalRecords = data.length;
    const filledRecords = data.filter(record => {
      const value = record[fieldName];
      return value !== null && value !== undefined && value !== '' && value !== 'null';
    }).length;
    
    return Math.round((filledRecords / totalRecords) * 100);
  };

  // Função para calcular completude de uma categoria
  const calculateCategoryCompleteness = (fields) => {
    if (!data || data.length === 0) return 0;
    
    const fieldCompleteness = fields.map(field => 
      calculateFieldCompleteness(field)
    );
    
    return Math.round(
      fieldCompleteness.reduce((sum, completeness) => sum + completeness, 0) / fields.length
    );
  };

  // Função para obter cor baseada na completude
  const getCompletenessColor = (percentage) => {
    if (percentage > 85) {
      return 'text-emerald-300 bg-emerald-500/10 border border-emerald-400/20';
    }
    if (percentage >= 60) {
      return 'text-amber-300 bg-amber-500/10 border border-amber-400/20';
    }
    return 'text-rose-300 bg-rose-500/10 border border-rose-400/20';
  };

  // Função para obter cor da barra de progresso
  const getProgressBarColor = (percentage) => {
    if (percentage > 85) {
      return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    }
    if (percentage >= 60) {
      return 'bg-gradient-to-r from-amber-500 to-amber-400';
    }
    return 'bg-gradient-to-r from-rose-500 to-rose-400';
  };

  // Função para obter cor da barra de progresso simples
  const getSimpleProgressBarColor = (percentage) => {
    if (percentage > 85) {
      return 'bg-emerald-500';
    }
    if (percentage >= 60) {
      return 'bg-amber-500';
    }
    return 'bg-rose-500';
  };

  // Função para encontrar escolas sem informação em uma categoria
  const findIncompleteSchools = (categoryFields) => {
    if (!data || data.length === 0) return [];
    
    return data.filter(school => {
      // Verifica se pelo menos um campo da categoria está vazio
      return categoryFields.some(field => {
        const value = school[field];
        return value === null || value === undefined || value === '' || value === 'null';
      });
    }).map(school => {
      // Identifica quais campos específicos estão vazios
      const missingFields = categoryFields.filter(field => {
        const value = school[field];
        return value === null || value === undefined || value === '' || value === 'null';
      });
      
      return {
        ...school,
        missingFields
      };
    });
  };

  // Calcular completude para todas as categorias
  const categoryCompleteness = useMemo(() => {
    if (!data || data.length === 0) {
      const result = {};
      Object.keys(fieldCategories).forEach(category => {
        result[category] = 0;
      });
      return result;
    }

    const result = {};
    Object.keys(fieldCategories).forEach(category => {
      const fields = fieldCategories[category];
      const fieldCompleteness = fields.map(field => {
        const totalRecords = data.length;
        const filledRecords = data.filter(record => {
          const value = record[field];
          return value !== null && value !== undefined && value !== '' && value !== 'null';
        }).length;
        return Math.round((filledRecords / totalRecords) * 100);
      });
      
      result[category] = Math.round(
        fieldCompleteness.reduce((sum, completeness) => sum + completeness, 0) / fields.length
      );
    });
    return result;
  }, [data]);

  // Calcular completude geral
  const overallCompleteness = useMemo(() => {
    if (!data || data.length === 0) return 0;
    
    const allFields = Object.values(fieldCategories).flat();
    const fieldCompleteness = allFields.map(field => {
      const totalRecords = data.length;
      const filledRecords = data.filter(record => {
        const value = record[field];
        return value !== null && value !== undefined && value !== '' && value !== 'null';
      }).length;
      return Math.round((filledRecords / totalRecords) * 100);
    });
    
    return Math.round(
      fieldCompleteness.reduce((sum, completeness) => sum + completeness, 0) / allFields.length
    );
  }, [data]);

  return {
    calculateFieldCompleteness,
    calculateCategoryCompleteness,
    getCompletenessColor,
    getProgressBarColor,
    getSimpleProgressBarColor,
    findIncompleteSchools,
    categoryCompleteness,
    overallCompleteness
  };
};

