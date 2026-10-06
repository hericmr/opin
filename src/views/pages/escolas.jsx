import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Search } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { useEscolasData } from '../../hooks/useEscolasData';
import { getStorageUrl, getSecureImageUrl } from '../../utils/imageUtils';
import { escolaUrlSlug } from '../../utils/slug';

const EscolasList = () => {
  const { dataPoints, loading } = useEscolasData();
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Escolas', path: '/escolas', active: true },
  ], []);

  const filteredEscolas = useMemo(() => {
    if (!dataPoints) return [];
    return dataPoints
      .filter((escola) => {
        const term = searchTerm.toLowerCase();
        const nome = (escola.nome || escola.titulo || escola.Escola || '').toLowerCase();
        const municipio = (escola.municipio || '').toLowerCase();
        const terra = (escola.terra_indigena || '').toLowerCase();
        const povos = (escola.povos_indigenas || '').toLowerCase();
        
        return nome.includes(term) || municipio.includes(term) || terra.includes(term) || povos.includes(term);
      })
      .sort((a, b) => (a.nome || a.Escola || '').localeCompare(b.nome || b.Escola || ''));
  }, [dataPoints, searchTerm]);

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50 flex flex-col">
      <Helmet>
        <title>Escolas Indígenas – OPIN</title>
        <meta name="description" content="Conheça as escolas indígenas do estado de São Paulo." />
      </Helmet>

      <PageHeader
        title="Escolas Indígenas"
        showNavbar={true}
        overlayColor="rgba(255, 160, 0, 0.75)"
        blendMode="normal"
        titlePosition="center"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-10 relative z-10">
          <div className="relative max-w-lg mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#215A36] focus:border-[#215A36] sm:text-sm transition-all"
              placeholder="Buscar por escola, município, terra indígena ou povo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#215A36]"></div>
          </div>
        ) : filteredEscolas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma escola encontrada para a sua busca.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-[#215A36] font-medium hover:underline"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEscolas.map((escola) => {
              const slug = escolaUrlSlug(escola.id, escola.nome || escola.Escola);
              const headerImg = escola.imagem_header 
                ? getSecureImageUrl(getStorageUrl(escola.imagem_header)) 
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
