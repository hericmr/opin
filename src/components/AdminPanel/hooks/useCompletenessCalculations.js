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
    if (percentage >= 80) return 'text-green-400 bg-green-400/10';
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-400/10';
    if (percentage >= 40) return 'text-orange-400 bg-orange-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  // Função para obter ícone baseado na completude
  const getCompletenessIcon = (percentage) => {
    if (percentage >= 80) return '✅';
    if (percentage >= 60) return '⚠️';
    if (percentage >= 40) return '🔶';
    return '❌';
  };

  // Função para obter cor da barra de progresso
  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    if (percentage >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  // Função para obter cor da barra de progresso simples
  const getSimpleProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
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
    getCompletenessIcon,
    getProgressBarColor,
    getSimpleProgressBarColor,
    findIncompleteSchools,
    categoryCompleteness,
    overallCompleteness
  };
};

