import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, MapPin, BookOpen, Users, FileText, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSearch from '../../hooks/useSearch';
import { useSearch as useSearchContext } from '../../contexts/SearchContext';

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-green-900">{value}</div>
    <div className="text-sm md:text-base text-green-800/80">{label}</div>
  </div>
);

const Section = ({ title, children, className = "" }) => (
  <section className={`py-12 md:py-16 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 lg:px-16">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6 md:mb-8">{title}</h2>
      )}
      {children}
    </div>
  </section>
);

const HomepageSearch = ({ dataPoints }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setSearch } = useSearchContext();
  const { searchResults, isSearching, performSearch } = useSearch(dataPoints);

  // Fechar resultados quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar dados quando o termo mudar (busca em tempo real)
  useEffect(() => {
    if (localSearchTerm.length < 2) {
      setShowResults(false);
      return;
    }

    const searchData = async () => {
      try {
        await performSearch(localSearchTerm);
        setShowResults(true);
      } catch (error) {
        console.error('Erro na busca:', error);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const termToSearch = localSearchTerm.trim();
    if (termToSearch) {
      setSearch(termToSearch);
      navigate(`/search?q=${encodeURIComponent(termToSearch)}`);
    }
  };

  const handleResultClick = (result) => {
    // Se temos dados completos da escola, abrir o painel
    if (result.data && result.coordinates) {
      setSearch(result.title, result.coordinates, result.title);
      navigate('/mapa', { 
        state: { 
          searchTerm: result.title, 
          coordinates: result.coordinates,
          highlightSchool: result.title,
          schoolData: result.data // Passar os dados completos da escola
        } 
      });
    } else if (result.coordinates) {
      // Fallback: apenas coordenadas sem dados completos
      setSearch(result.title, result.coordinates, result.title);
      navigate('/mapa', { 
        state: { 
          searchTerm: result.title, 
          coordinates: result.coordinates,
          highlightSchool: result.title 
        } 
      });
    } else {
      // Busca simples sem coordenadas
      setSearch(result.title);
      navigate(`/search?q=${encodeURIComponent(result.title)}`);
    }
    setShowResults(false);
    setLocalSearchTerm('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setLocalSearchTerm('');
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
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="rounded-full bg-white/90 border border-green-200 px-4 py-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-green-700 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar escolas, territórios..."
            value={localSearchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (localSearchTerm.length >= 2 && searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            className="w-full bg-transparent outline-none text-green-900 placeholder:text-green-800/60"
          />
          {localSearchTerm && (
            <button
              type="button"
              onClick={() => {
                setLocalSearchTerm('');
                setShowResults(false);
              }}
              className="text-green-700 hover:text-green-900 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Resultados da busca */}
      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-green-200 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">Buscando...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.slice(0, 8).map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-3 text-left hover:bg-green-50 rounded-lg transition-colors flex items-center gap-3 group"
                    >
                      <div className="text-green-600 group-hover:text-green-700 transition-colors flex-shrink-0">
                        {getIconForType(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-900 text-sm truncate">
                          {highlightText(result.title, localSearchTerm)}
                        </p>
                        <p className="text-xs text-green-700 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      {result.coordinates && (
                        <Map className="w-4 h-4 text-green-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Homepage({ dataPoints = [] }) {
  const bgUrl = (process.env.PUBLIC_URL || '') + '/site_bg.png';
  return (
    <div className="flex-1 overflow-auto bg-white text-green-900">
      {/* Hero inspirado no native-land: fundo, título, busca/CTA */}
      <section className="relative min-h-screen h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${bgUrl}')` }}>
        <div className="absolute inset-0 bg-green-950/40" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-start lg:items-center h-full px-4 lg:px-12">
          <div className="pt-28 lg:pt-0 text-white">
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] leading-tight mt-2 font-papakilo">OPIN</h1>
            <p className="uppercase tracking-wide text-green-100 text-sm">Observatório dos Professores Indígenas do estado de São Paulo</p>
            <p className="mt-4 text-green-100/90 text-lg max-w-2xl">
              Um espaço de memória, território e educação. Histórias, escolas e experiências narradas pelos próprios professores e comunidades indígenas do Estado de São Paulo.
            </p>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-6 gap-3 w-full">
              <div className="col-span-1 lg:col-span-4">
                <HomepageSearch dataPoints={dataPoints} />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Link to="/mapa" className="block rounded-full bg-green-500 text-green-950 font-semibold px-4 py-2.5 text-center hover:bg-green-400 transition">
                  Explorar Mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      

      

      

      
      
    </div>
  );
}




