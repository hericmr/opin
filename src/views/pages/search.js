import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Users, Search, X, ArrowRight, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { escolaUrlSlug } from '../../utils/slug';
import Footer from '../../components/Footer';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import useSearch from '../../hooks/useSearch';

const SearchResults = ({ dataPoints }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(searchTerm);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { performSearch } = useSearch(dataPoints);

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Buscar Escola', path: '/search', active: true },
  ], []);

  useEffect(() => {
    setInputValue(searchTerm);
    if (!searchTerm) { setResults([]); return; }
    setIsLoading(true);
    performSearch(searchTerm)
      .then(r => setResults(r))
      .finally(() => setIsLoading(false));
  }, [searchTerm, performSearch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) setSearchParams({ q: inputValue.trim() });
  }, [inputValue, setSearchParams]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearchParams({});
  }, [setSearchParams]);

  const handleResultClick = useCallback((result) => {
    navigate('/mapa', {
      state: {
        searchTerm: result.title,
        coordinates: result.coordinates,
        highlightSchool: result.title,
        openPainel: result.id,
      }
    });
  }, [navigate]);

  const highlight = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <Helmet>
        <title>Buscar Escola – OPIN</title>
        <meta name="description" content="Pesquise escolas indígenas do Estado de São Paulo por nome, município, povo ou terra indígena." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hericmr.github.io/opin/search" />
        <meta property="og:title" content="Buscar Escola – OPIN" />
        <meta property="og:description" content="Pesquise escolas indígenas do Estado de São Paulo por nome, município, povo ou terra indígena." />
        <meta property="og:image" content="https://hericmr.github.io/opin/hero_grayscale.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Buscar Escola – OPIN" />
        <meta name="twitter:description" content="Pesquise escolas indígenas do Estado de São Paulo por nome, município, povo ou terra indígena." />
        <meta name="twitter:image" content="https://hericmr.github.io/opin/hero_grayscale.webp" />
      </Helmet>
      {/* Hero */}
      <PageHeader
        title="Buscar Escola"
        showNavbar={true}
        dataPoints={dataPoints || []}
        overlayColor="rgba(255, 128, 90, 1)"
        blendMode="color"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      {/* Campo de busca centralizado abaixo do hero */}
      <div className="max-w-2xl mx-auto px-4 mt-10 relative z-10 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-2 bg-white rounded-2xl border border-gray-200 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-700 pointer-events-none" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escola, município, povo, terra indígena..."
              autoFocus
              className="w-full pl-11 pr-10 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-green-300 transition"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex-shrink-0"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">

        {/* Sem query */}
        {!searchTerm && (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-base font-medium text-gray-500">Digite algo para buscar escolas</p>
            <p className="text-sm mt-1">Nome, município, povo, terra indígena...</p>
          </div>
        )}

        {/* Carregando */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Buscando...</p>
          </div>
        )}

        {/* Resultados */}
        {!isLoading && searchTerm && (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {results.length > 0
                ? <><span className="font-semibold text-gray-800">{results.length}</span> resultado{results.length !== 1 ? 's' : ''} para <span className="font-semibold text-gray-800">"{searchTerm}"</span></>
                : <>Nenhum resultado para <span className="font-semibold text-gray-800">"{searchTerm}"</span></>
              }
            </p>

            {results.length > 0 ? (
              <div className="flex flex-col gap-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => handleResultClick(result)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <h2 className="font-semibold text-gray-900 text-base leading-snug mb-1.5">
                          {highlight(result.title, searchTerm)}
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          {result.subtitle && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                              {highlight(result.subtitle, searchTerm)}
                            </span>
                          )}
                          {result.data?.terra_indigena && (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                              TI {highlight(result.data.terra_indigena, searchTerm)}
                            </span>
                          )}
                          {result.data?.povos_indigenas && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                              {highlight(result.data.povos_indigenas, searchTerm)}
                            </span>
                          )}
                          {result.data?.numero_alunos && (
                            <span className="text-gray-400">{result.data.numero_alunos} alunos</span>
                          )}
                        </div>
                        {result.matches?.filter(m => !['nome','município','terra indígena','povos'].includes(m)).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {result.matches
                              .filter(m => !['nome','município','terra indígena','povos'].includes(m))
                              .slice(0, 4)
                              .map((match, i) => (
                                <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                                  {match}
                                </span>
                              ))}
                          </div>
                        )}
                      </button>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button type="button" onClick={() => handleResultClick(result)}>
                          <ArrowRight className="w-4 h-4 text-gray-300 hover:text-green-600 transition-colors mt-1" />
                        </button>
                        {result.id && (
                          <Link
                            to={`/escola/${escolaUrlSlug(result.id, result.title)}`}
                            className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 font-medium"
                            title="Ver página da escola"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Ver página
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Nenhuma escola encontrada.</p>
                <p className="text-sm text-gray-400 mb-6">Tente outros termos ou verifique a ortografia.</p>
                <Link
                  to="/mapa"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  Explorar o mapa
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
