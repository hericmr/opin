import { useMemo } from 'react';

/**
 * Hook para gerenciar filtros e busca de escolas no AdminPanel
 * 
 * @param {Array} escolas - Lista de escolas para filtrar
 * @param {string} searchTerm - Termo de busca
 * @param {string} selectedType - Tipo selecionado para filtro (ex: 'todos', 'estadual', 'municipal')
 * @returns {Object} Objeto com escolas filtradas e funções auxiliares
 */
export const useAdminFilters = (escolas = [], searchTerm = '', selectedType = 'todos') => {
  // Filtrar escolas baseado no termo de busca e tipo selecionado
  const filteredEscolas = useMemo(() => {
    if (!escolas || escolas.length === 0) {
      return [];
    }

    let filtered = [...escolas];

    // Aplicar filtro de busca por nome da escola
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(escola => 
        escola.Escola?.toLowerCase().includes(searchLower) ||
        escola['Município']?.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar filtro por tipo (se implementado no futuro)
    if (selectedType && selectedType !== 'todos') {
      // Por enquanto, selectedType não está sendo usado no filtro
      // Mas a estrutura está pronta para expansão futura
      // Exemplo: filtrar por 'Escola Estadual ou Municipal'
      // filtered = filtered.filter(escola => 
      //   escola['Escola Estadual ou Municipal'] === selectedType
      // );
    }

    return filtered;
  }, [escolas, searchTerm, selectedType]);

  // Contar total de escolas
  const totalEscolas = useMemo(() => escolas.length, [escolas]);

  // Contar escolas filtradas
  const totalFiltered = useMemo(() => filteredEscolas.length, [filteredEscolas]);

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return searchTerm.trim() !== '' || (selectedType && selectedType !== 'todos');
  }, [searchTerm, selectedType]);

  return {
    filteredEscolas,
    totalEscolas,
    totalFiltered,
    hasActiveFilters,
  };
};

