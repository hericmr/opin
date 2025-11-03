import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, BookOpen, Users, FileText, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSearch from '../../hooks/useSearch';

const SearchBar = ({ onSearch, onResultClick, isMobile, isMobileLandscape, dataPoints }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // const [searchTerm, setSearchTerm] = useState(''); // Removido - não utilizado
  // const [suggestions, setSuggestions] = useState([]); // Removido - não utilizado
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  const { searchResults, isSearching, performSearch, getSearchSuggestions } = useSearch(dataPoints);

  // Fechar busca quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setLocalSearchTerm('');
        // setSearchTerm(''); // Removido - não utilizado
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focar no input quando expandir
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Buscar dados quando o termo local mudar (busca em tempo real)
  useEffect(() => {
    if (localSearchTerm.length < 2) {
      // setSuggestions([]); // Removido - não utilizado
      return;
    }

    const searchData = async () => {
      try {
        await performSearch(localSearchTerm);
        // const newSuggestions = getSearchSuggestions(localSearchTerm); // Removido - não utilizado
        // setSuggestions(newSuggestions); // Removido - não utilizado
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
      onSearch(termToSearch);
      setIsExpanded(false);
      setLocalSearchTerm('');
      // setSearchTerm(''); // Removido - não utilizado
    }
  };

  const handleResultClick = (result) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      if (result.coordinates) {
        onSearch(result.title, result.coordinates);
      } else {
        onSearch(result.title);
      }
    }
    setIsExpanded(false);
    setLocalSearchTerm('');
    // setSearchTerm(''); // Removido - não utilizado
  };

  // const handleSuggestionClick = (suggestion) => {
  //   setLocalSearchTerm(suggestion);
  //   setSearchTerm('');
  // }; // Removido - não utilizado

  const handleInputChange = (e) => {
    const value = e.target.value;
    // setSearchTerm(''); // Removido - não utilizado
    setLocalSearchTerm(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const termToSearch = localSearchTerm.trim();
      if (termToSearch) {
        onSearch(termToSearch);
        setIsExpanded(false);
        setLocalSearchTerm('');
        // setSearchTerm(''); // Removido - não utilizado
      }
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setLocalSearchTerm('');
      // setSearchTerm(''); // Removido - não utilizado
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

  // const getCategoryColor = (category) => {
  //   switch (category) {
  //     case 'educação': return 'text-blue-600';
  //     case 'comunidades': return 'text-red-600';
  //     case 'histórico': return 'text-yellow-600';
  //     default: return 'text-gray-600';
  //   }
  // }; // Removido - não utilizado

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
      <AnimatePresence>
        {!isExpanded ? (
          // Botão de busca (estado fechado)
          <motion.button
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className={`p-2 rounded hover:bg-[#215A36] transition-colors 
                     focus:outline-none
                     ${isMobileLandscape ? 'p-1.5' : ''}`}
            aria-label="Buscar (Ctrl+K ou Cmd+K)"
            title="Buscar (Ctrl+K ou Cmd+K)"
          >
            <Search className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
          </motion.button>
        ) : (
          // Campo de busca expandido (estado aberto)
          <motion.div
            initial={{ opacity: 0, scale: 0.8, width: 0 }}
            animate={{ opacity: 1, scale: 1, width: "auto" }}
            exit={{ opacity: 0, scale: 0.8, width: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 }
            }}
            className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar escolas, povos, línguas..."
                  value={localSearchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-64 pl-10 pr-12 py-2 border-0 rounded-l-lg 
                           focus:outline-none focus:ring-2 focus:ring-[#215A36]
                           text-sm text-black"
                />
              </div>
              <motion.button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setLocalSearchTerm('');
                  // setSearchTerm(''); // Removido - não utilizado
                }}
                className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados da busca */}
      <AnimatePresence>
        {isExpanded && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.25, 
              ease: "easeOut",
              delay: 0.1
            }}
            className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-2 max-h-64 overflow-y-auto">
              {isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-gray-500"
                >
                  <p className="mt-2 text-xs">Buscando...</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-1"
                >
                  {searchResults.slice(0, 8).map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-2 text-left hover:bg-gray-50 rounded transition-colors
                               flex items-center gap-2 group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="text-gray-400 group-hover:text-[#215A36] transition-colors flex-shrink-0">
                        {getIconForType(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {highlightText(result.title, localSearchTerm)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      {result.coordinates && (
                        <Map className="w-4 h-4 text-gray-300 group-hover:text-[#215A36] transition-colors flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 