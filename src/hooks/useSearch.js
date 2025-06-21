import { useState, useCallback, useRef } from 'react';

const useSearch = (dataPoints) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const lastSearchTerm = useRef('');

  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      lastSearchTerm.current = '';
      return [];
    }

    // Evitar busca duplicada
    if (lastSearchTerm.current === searchTerm) {
      return searchResults;
    }

    lastSearchTerm.current = searchTerm;
    setIsSearching(true);
    
    try {
      // Simular delay de busca apenas se necessário
      const startTime = Date.now();
      
      const term = searchTerm.toLowerCase();
      const results = [];

      // Buscar nas escolas
      if (dataPoints && dataPoints.length > 0) {
        dataPoints.forEach(school => {
          const matches = [];
          
          // Buscar no nome da escola
          if (school.titulo && school.titulo.toLowerCase().includes(term)) {
            matches.push('nome');
          }
          
          // Buscar no município
          if (school.municipio && school.municipio.toLowerCase().includes(term)) {
            matches.push('município');
          }
          
          // Buscar na terra indígena
          if (school.terra_indigena && school.terra_indigena.toLowerCase().includes(term)) {
            matches.push('terra indígena');
          }
          
          // Buscar nos povos indígenas
          if (school.povos_indigenas && school.povos_indigenas.toLowerCase().includes(term)) {
            matches.push('povos');
          }
          
          // Buscar nas línguas faladas
          if (school.linguas_faladas && school.linguas_faladas.toLowerCase().includes(term)) {
            matches.push('línguas');
          }
          
          // Buscar na diretoria de ensino
          if (school.diretoria_ensino && school.diretoria_ensino.toLowerCase().includes(term)) {
            matches.push('diretoria');
          }

          if (matches.length > 0) {
            results.push({
              id: school.id,
              title: school.titulo,
              type: 'school',
              category: 'educação',
              matches: matches,
              data: school,
              subtitle: school.municipio,
              coordinates: {
                lat: school.latitude,
                lng: school.longitude
              }
            });
          }
        });
      }

      // Ordenar resultados por relevância
      const sortedResults = results.sort((a, b) => {
        // Priorizar matches no nome
        const aNameMatch = a.matches.includes('nome') ? 1 : 0;
        const bNameMatch = b.matches.includes('nome') ? 1 : 0;
        
        if (aNameMatch !== bNameMatch) {
          return bNameMatch - aNameMatch;
        }
        
        // Depois por número de matches
        return b.matches.length - a.matches.length;
      });

      // Adicionar delay mínimo apenas se a busca foi muito rápida
      const elapsed = Date.now() - startTime;
      if (elapsed < 200) {
        await new Promise(resolve => setTimeout(resolve, 200 - elapsed));
      }

      setSearchResults(sortedResults);
      return sortedResults;
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [dataPoints, searchResults]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    lastSearchTerm.current = '';
  }, []);

  const getSearchSuggestions = useCallback((term) => {
    if (!term || term.length < 2) return [];
    
    const suggestions = new Set();
    const searchTerm = term.toLowerCase();

    if (dataPoints && dataPoints.length > 0) {
      dataPoints.forEach(school => {
        // Sugestões de municípios
        if (school.municipio && school.municipio.toLowerCase().includes(searchTerm)) {
          suggestions.add(school.municipio);
        }
        
        // Sugestões de terras indígenas
        if (school.terra_indigena && school.terra_indigena.toLowerCase().includes(searchTerm)) {
          suggestions.add(school.terra_indigena);
        }
        
        // Sugestões de povos
        if (school.povos_indigenas && school.povos_indigenas.toLowerCase().includes(searchTerm)) {
          const povos = school.povos_indigenas.split(',').map(p => p.trim());
          povos.forEach(povo => {
            if (povo.toLowerCase().includes(searchTerm)) {
              suggestions.add(povo);
            }
          });
        }
      });
    }

    return Array.from(suggestions).slice(0, 5);
  }, [dataPoints]);

  return {
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    getSearchSuggestions
  };
};

export default useSearch; 