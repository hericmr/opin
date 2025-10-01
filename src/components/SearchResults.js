import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, Users, FileText, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import useSearch from '../hooks/useSearch';

const SearchResults = ({ dataPoints }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { performSearch } = useSearch(dataPoints);

  useEffect(() => {
    if (searchTerm) {
      const searchData = async () => {
        setIsLoading(true);
        try {
          const searchResults = await performSearch(searchTerm);
          setResults(searchResults);
        } catch (error) {
          console.error('Erro na busca:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      };

      searchData();
    }
  }, [searchTerm, performSearch]);

  const handleResultClick = (result) => {
    if (result.coordinates) {
      navigate('/', { 
        state: { 
          searchTerm: result.title, 
          coordinates: result.coordinates,
          highlightSchool: result.title 
        } 
      });
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'school': return <MapPin className="w-5 h-5" />;
      case 'land': return <BookOpen className="w-5 h-5" />;
      case 'teacher': return <Users className="w-5 h-5" />;
      case 'history': return <FileText className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'educação': return 'text-blue-600 bg-blue-50';
      case 'comunidades': return 'text-red-600 bg-red-50';
      case 'histórico': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="mt-4 text-lg text-gray-600">Buscando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao mapa
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">
              Resultados da busca
            </h1>
          </div>
          
          <p className="text-gray-600">
            {results.length > 0 
              ? `${results.length} resultado${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''} para "${searchTerm}"`
              : `Nenhum resultado encontrado para "${searchTerm}"`
            }
          </p>
        </div>

        {/* Resultados */}
        {results.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleResultClick(result)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
                         cursor-pointer border border-gray-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-green-600 group-hover:text-green-700 transition-colors">
                      {getIconForType(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {highlightText(result.title, searchTerm)}
                      </h3>
                      {result.subtitle && (
                        <p className="text-sm text-gray-500 mb-2">
                          {result.subtitle}
                        </p>
                      )}
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </span>
                    </div>
                  </div>
                  
                  {result.matches && result.matches.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Encontrado em:</p>
                      <div className="flex flex-wrap gap-1">
                        {result.matches.map((match, matchIndex) => (
                          <span
                            key={matchIndex}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {match}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.coordinates && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                      <MapPin className="w-3 h-3" />
                      <span>Ver no mapa</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente usar termos diferentes ou verificar a ortografia.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Voltar ao mapa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 