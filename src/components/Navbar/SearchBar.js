import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, BookOpen, Users, FileText, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSearch from '../../hooks/useSearch';

const SearchBar = ({ onSearch, onResultClick, isMobile, isMobileLandscape, dataPoints }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(''); // Termo local para busca em tempo real
  const searchRef = useRef(null);
  
  const { searchResults, isSearching, performSearch, getSearchSuggestions } = useSearch(dataPoints);

  // Fechar busca quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setLocalSearchTerm(''); // Limpar busca local ao fechar
        setSearchTerm(''); // Limpar searchTerm ao fechar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar dados quando o termo local mudar (busca em tempo real)
  useEffect(() => {
    if (localSearchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const searchData = async () => {
      try {
        await performSearch(localSearchTerm);
        const newSuggestions = getSearchSuggestions(localSearchTerm);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm, performSearch, getSearchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    const termToSearch = localSearchTerm.trim();
    if (termToSearch) {
      // Usar onSearch para busca simples (quando o usuário pressiona Enter)
      onSearch(termToSearch);
      setIsOpen(false);
      setLocalSearchTerm(''); // Limpar busca local
      setSearchTerm(''); // Limpar searchTerm
    }
  };

  const handleResultClick = (result) => {
    // Usar a função onResultClick se disponível, senão usar onSearch como fallback
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Fallback para compatibilidade
      if (result.coordinates) {
        onSearch(result.title, result.coordinates);
      } else {
        onSearch(result.title);
      }
    }
    setIsOpen(false);
    setLocalSearchTerm(''); // Limpar busca local
    setSearchTerm(''); // Limpar searchTerm
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalSearchTerm(suggestion);
    setSearchTerm(''); // Limpar searchTerm para evitar conflitos
    // Não executar busca imediatamente, deixar o usuário decidir
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(''); // Limpar searchTerm para evitar conflitos
    setLocalSearchTerm(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const termToSearch = localSearchTerm.trim();
      if (termToSearch) {
        // Usar onSearch para busca simples (quando o usuário pressiona Enter)
        onSearch(termToSearch);
        setIsOpen(false);
        setLocalSearchTerm('');
        setSearchTerm(''); // Limpar searchTerm
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setLocalSearchTerm('');
      setSearchTerm(''); // Limpar searchTerm
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'school': return <MapPin className="w-4 h-4" />;
      case 'land': return <BookOpen className="w-4 h-4" />;
      case 'teacher': return <Users className="w-4 h-4" />;
      case 'history': return <FileText className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'educação': return 'text-blue-600';
      case 'comunidades': return 'text-red-600';
      case 'histórico': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Botão de busca */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchTerm(''); // Limpar searchTerm ao abrir
          }
        }}
        className={`p-2 rounded-full hover:bg-amber-800/50 transition-all duration-200 
                   focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95
                   ${isMobileLandscape ? 'p-1.5' : ''}`}
        aria-label="Buscar"
      >
        <Search className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
      </button>

      {/* Modal de busca */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 
                       ${isMobile ? 'left-0 right-0 mx-2' : 'right-0 w-96'} z-50`}
          >
            {/* Header da busca */}
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar escolas, terras indígenas, professores..."
                    value={localSearchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-green-500 focus:border-green-500
                             text-sm text-black"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setLocalSearchTerm('');
                    setSearchTerm(''); // Limpar searchTerm ao fechar
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Resultados da busca */}
            <div className="max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-2 text-sm">Buscando...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {/* Sugestões rápidas */}
                  {suggestions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2 px-2">Sugestões:</p>
                      <div className="flex flex-wrap gap-1 px-2">
                        {suggestions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 
                                     rounded-full transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Resultados */}
                  <div className="space-y-1">
                    {searchResults.slice(0, 8).map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors
                                 flex items-center gap-3 group"
                      >
                        <div className="text-gray-400 group-hover:text-green-600 transition-colors">
                          {getIconForType(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {highlightText(result.title, localSearchTerm)}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                          <p className={`text-xs ${getCategoryColor(result.category)}`}>
                            {result.matches.join(', ')}
                          </p>
                        </div>
                        {result.coordinates && (
                          <Map className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {searchResults.length > 8 && (
                    <div className="p-2 text-center text-xs text-gray-500 border-t">
                      +{searchResults.length - 8} resultados encontrados
                    </div>
                  )}
                </div>
              ) : localSearchTerm.length >= 2 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">Nenhum resultado encontrado</p>
                  <p className="text-xs mt-1">Tente outros termos de busca</p>
                </div>
              ) : localSearchTerm.length > 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">Digite pelo menos 2 caracteres</p>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">Digite para buscar</p>
                  <p className="text-xs mt-1">Escolas, terras indígenas, professores...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 