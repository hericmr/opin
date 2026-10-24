import React, { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    searchTerm: '',
    coordinates: null,
    highlightSchool: null,
    isSearching: false
  });

  const setSearch = useCallback((searchTerm, coordinates = null, highlightSchool = null) => {
    setSearchState({
      searchTerm,
      coordinates,
      highlightSchool,
      isSearching: false
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      searchTerm: '',
      coordinates: null,
      highlightSchool: null,
      isSearching: false
    });
  }, []);

  const setSearching = useCallback((isSearching) => {
    setSearchState(prev => ({ ...prev, isSearching }));
  }, []);

  const value = {
    ...searchState,
    setSearch,
    clearSearch,
    setSearching
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 