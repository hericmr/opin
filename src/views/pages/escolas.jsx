import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StaticPageMetaTags from '../../components/StaticPageMetaTags';
import { MapPin, Search, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { useEscolasData } from '../../hooks/useEscolasData';
import { getStorageUrl } from '../../utils/imageUtils';
import { escolaUrlSlug } from '../../utils/slug';
import GlobalSpinner from '../../components/GlobalSpinner';

const EscolasList = () => {
  const { dataPoints, loading } = useEscolasData();
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Escolas', path: '/escolas', active: true },
  ], []);

  const sortedEscolas = useMemo(() => {
    if (!dataPoints) return [];
    
    let filtered = dataPoints;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = dataPoints.filter((escola) => {
        const nome = (escola.nome || escola.Escola || '').toLowerCase();
        const municipio = (escola.municipio || '').toLowerCase();
        return nome.includes(lowerTerm) || municipio.includes(lowerTerm);
      });
    }

    return [...filtered].sort((a, b) => (a.nome || a.Escola || '').localeCompare(b.nome || b.Escola || ''));
  }, [dataPoints, searchTerm]);

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50 flex flex-col">
      <StaticPageMetaTags 
        title="Escolas Indígenas – OPIN"
        description="Conheça as escolas indígenas do estado de São Paulo."
        urlPath="/escolas"
      />

      <PageHeader
        title="Escolas Indígenas"
        showNavbar={true}
        overlayColor="rgba(255, 160, 0, 0.85)"
        blendMode="multiply"
        titlePosition="center"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
        <div className="max-w-2xl mx-auto relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar escolas ou municípios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 sm:text-base shadow-sm transition-all duration-200"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <GlobalSpinner />
          </div>
        ) : sortedEscolas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma escola encontrada no banco de dados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEscolas.map((escola) => {
              const slug = escolaUrlSlug(escola.id, escola.nome || escola.Escola);
              const headerImg = escola.imagem_header 
                ? getStorageUrl(escola.imagem_header) 
                : `${import.meta.env.BASE_URL}hero_grayscale.webp`;
              const nome = escola.nome || escola.titulo || escola.Escola || `Escola ${escola.id}`;
              
              return (
                <Link 
                  key={escola.id} 
                  to={`/escola/${slug}`}
                  className="bg-white rounded-lg overflow-hidden flex flex-col h-full border border-gray-100 group hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    <img 
                      src={headerImg} 
                      alt={`Imagem de ${nome}`}
                      className="w-full h-full object-cover block"
                      onError={(e) => { e.target.src = `${import.meta.env.BASE_URL}hero_grayscale.webp`; }}
                    />
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                      {nome}
                    </h3>
                    
                    {escola.municipio && (
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-[#215A36] mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{escola.municipio}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default EscolasList;
