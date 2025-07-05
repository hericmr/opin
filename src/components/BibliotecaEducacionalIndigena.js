import React, { useState, useMemo } from 'react';
import { ReactComponent as OncaIcon } from '../../src/assets/onca.svg';
import { Search, BookOpen, MapPin, Users, Home, Heart, Star, Filter, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIAS_EDUCACAO_INDIGENA = {
  'linguas_indigenas': { 
    cor: 'green-700', 
    bgCor: 'bg-green-50', 
    borderCor: 'border-green-200', 
    icone: OncaIcon, 
    label: 'Línguas Indígenas',
    descricao: 'Ensino e preservação das línguas indígenas'
  },
  'historia_cultura': { 
    cor: 'red-600', 
    bgCor: 'bg-red-50', 
    borderCor: 'border-red-200', 
    icone: Users, 
    label: 'História e Cultura',
    descricao: 'História e cultura dos povos indígenas'
  },
  'territorio_ambiente': { 
    cor: 'blue-600', 
    bgCor: 'bg-blue-50', 
    borderCor: 'border-blue-200', 
    icone: MapPin, 
    label: 'Território e Ambiente',
    descricao: 'Conhecimentos sobre território e meio ambiente'
  },
  'artes_tradicionais': { 
    cor: 'purple-600', 
    bgCor: 'bg-purple-50', 
    borderCor: 'border-purple-200', 
    icone: Heart, 
    label: 'Artes',
    descricao: 'Artes, artesanato e expressões culturais'
  },
  'medicina_tradicional': { 
    cor: 'amber-600', 
    bgCor: 'bg-amber-50', 
    borderCor: 'border-amber-200', 
    icone: Star, 
    label: 'Medicina Tradicional',
    descricao: 'Conhecimentos medicinais tradicionais'
  },
  'matematica_indigena': { 
    cor: 'gray-600', 
    bgCor: 'bg-gray-50', 
    borderCor: 'border-gray-200', 
    icone: Home, 
    label: 'Matemática',
    descricao: 'Sistemas matemáticos e contagem '
  },
  'agricultura_tradicional': { 
    cor: 'emerald-600', 
    bgCor: 'bg-emerald-50', 
    borderCor: 'border-emerald-200', 
    icone: Heart, 
    label: 'Agricultura Tradicional',
    descricao: 'Práticas agrícolas e alimentação tradicional'
  },
  'rituais_cerimonias': { 
    cor: 'indigo-600', 
    bgCor: 'bg-indigo-50', 
    borderCor: 'border-indigo-200', 
    icone: Star, 
    label: 'Rituais e Cerimônias',
    descricao: 'Rituais, cerimônias e práticas espirituais'
  }
};

const BibliotecaEducacionalIndigena = ({ locations }) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  // Agrupa os locais por categoria educacional indígena
  const locaisPorCategoria = useMemo(() => {
    return locations.reduce((acc, local) => {
      // Mapeia categorias antigas para novas categorias educacionais indígenas
      let categoria = 'historia_cultura'; // categoria padrão
      
      if (local.tipo === 'educacao' || local.tipo === 'educação') {
        categoria = 'linguas_indigenas';
      } else if (local.tipo === 'comunidades') {
        categoria = 'historia_cultura';
      } else if (local.tipo === 'historico' || local.tipo === 'histórico') {
        categoria = 'historia_cultura';
      } else if (local.tipo === 'lazer') {
        categoria = 'artes_tradicionais';
      } else if (local.tipo === 'assistencia') {
        categoria = 'medicina_tradicional';
      } else if (local.tipo === 'bairro') {
        categoria = 'territorio_ambiente';
      } else if (local.tipo === 'religiao') {
        categoria = 'rituais_cerimonias';
      }
      
      // Distribuição adicional baseada no conteúdo
      if (local.titulo?.toLowerCase().includes('língua') || 
          local.titulo?.toLowerCase().includes('lingua') ||
          local.linguas_faladas) {
        categoria = 'linguas_indigenas';
      } else if (local.titulo?.toLowerCase().includes('arte') ||
                 local.titulo?.toLowerCase().includes('artesanato') ||
                 local.titulo?.toLowerCase().includes('dança') ||
                 local.titulo?.toLowerCase().includes('música')) {
        categoria = 'artes_tradicionais';
      } else if (local.titulo?.toLowerCase().includes('medicina') ||
                 local.titulo?.toLowerCase().includes('cura') ||
                 local.titulo?.toLowerCase().includes('planta')) {
        categoria = 'medicina_tradicional';
      } else if (local.titulo?.toLowerCase().includes('agricultura') ||
                 local.titulo?.toLowerCase().includes('roça') ||
                 local.titulo?.toLowerCase().includes('plantio')) {
        categoria = 'agricultura_tradicional';
      } else if (local.titulo?.toLowerCase().includes('ritual') ||
                 local.titulo?.toLowerCase().includes('cerimônia') ||
                 local.titulo?.toLowerCase().includes('festa')) {
        categoria = 'rituais_cerimonias';
      }
      
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(local);
      return acc;
    }, {});
  }, [locations]);

  // Filtra os locais baseado na busca
  const filtrarLocais = (locais) => {
    if (!termoBusca) return locais;
    const termo = termoBusca.toLowerCase();
    return locais.filter(local => 
      local.titulo?.toLowerCase().includes(termo) ||
      local.descricao_detalhada?.toLowerCase().includes(termo) ||
      local.municipio?.toLowerCase().includes(termo) ||
      local.povos_indigenas?.toLowerCase().includes(termo)
    );
  };

  const abrirLocal = (local) => {
    // Navegação mais suave usando React Router
    const slug = local.titulo?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    const basePath = window.location.pathname.includes('/escolasindigenas') ? '/escolasindigenas' : '';
    window.location.href = `${basePath}/?panel=${slug}`;
  };

  const totalLocais = Object.values(locaisPorCategoria).reduce((total, locais) => total + locais.length, 0);
  const locaisFiltrados = Object.values(locaisPorCategoria).flat().filter(local => 
    (categoriaSelecionada === 'todos' || local.tipo === categoriaSelecionada) &&
    (!termoBusca || local.titulo?.toLowerCase().includes(termoBusca.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 pt-16 sm:pt-20">
      {/* Cabeçalho com design indígena */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 font-[Caveat]">
              Matérias da Educação Escolar Indígena
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Conheça as disciplinas, conhecimentos tradicionais e práticas educacionais dos povos indígenas do Estado de São Paulo
            </p>
          </div>

          {/* Estatísticas */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalLocais}</div>
              <div className="text-sm text-green-200">Conhecimentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Object.keys(locaisPorCategoria).length}
              </div>
              <div className="text-sm text-green-200">Matérias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {locations.filter(l => l.povos_indigenas).length}
              </div>
              <div className="text-sm text-green-200">Povos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {locations.filter(l => l.municipio).length}
              </div>
              <div className="text-sm text-green-200">Escolas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar escolas indígenas, povos, territórios, culturas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                         focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>

            {/* Filtro de categoria */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white shadow-sm 
                         focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg appearance-none"
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
              >
                <option value="todos">Todas as Categorias</option>
                {Object.entries(CATEGORIAS_EDUCACAO_INDIGENA).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resultados da busca */}
          {termoBusca && (
            <div className="mt-4 text-sm text-gray-600">
              {locaisFiltrados.length} resultado{locaisFiltrados.length !== 1 ? 's' : ''} encontrado{locaisFiltrados.length !== 1 ? 's' : ''}
              {categoriaSelecionada !== 'todos' && ` em ${CATEGORIAS_EDUCACAO_INDIGENA[categoriaSelecionada]?.label}`}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {categoriaSelecionada === 'todos' ? (
            // Visualização por categorias
            <motion.div
              key="categorias"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {Object.entries(CATEGORIAS_EDUCACAO_INDIGENA).map(([categoria, info]) => {
                const locais = locaisPorCategoria[categoria] || [];
                const locaisFiltrados = filtrarLocais(locais);
                
                if (locaisFiltrados.length === 0) return null;

                const IconComponent = info.icone;

                return (
                  <motion.div
                    key={categoria}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${info.bgCor} rounded-xl shadow-lg p-6 border ${info.borderCor}`}
                  >
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                      <IconComponent className={`w-8 h-8 text-${info.cor} mr-3`} />
                      <div className="flex-1">
                        <h2 className={`text-2xl font-bold text-${info.cor}`}>
                          {info.label}
                        </h2>
                        <p className="text-gray-600 mt-1">{info.descricao}</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                        {locaisFiltrados.length} item{locaisFiltrados.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {locaisFiltrados.slice(0, 6).map((local) => (
                        <motion.div
                          key={local.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => abrirLocal(local)}
                          className="bg-white rounded-lg shadow-md p-5 cursor-pointer 
                                   hover:shadow-lg transition-all duration-200 border border-gray-100"
                        >
                          {local.imagens && local.imagens.length > 0 && (
                            <div className="mb-4">
                              <img
                                src={local.imagens[0]}
                                alt={local.titulo}
                                className="w-full h-40 object-cover rounded-lg shadow-sm"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {local.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                            {local.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {local.municipio}
                            </span>
                            <ArrowRight className="w-5 h-5 text-green-600" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {locaisFiltrados.length > 6 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setCategoriaSelecionada(categoria)}
                          className="text-green-700 hover:text-green-800 font-medium"
                        >
                          Ver todos os {locaisFiltrados.length} itens →
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            // Visualização de categoria específica
            <motion.div
              key="categoria-especifica"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button
                    onClick={() => setCategoriaSelecionada('todos')}
                    className="text-green-700 hover:text-green-800 font-medium mb-2"
                  >
                    ← Voltar para todas as categorias
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {CATEGORIAS_EDUCACAO_INDIGENA[categoriaSelecionada]?.label}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {CATEGORIAS_EDUCACAO_INDIGENA[categoriaSelecionada]?.descricao}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {locaisFiltrados.map((local) => (
                  <motion.div
                    key={local.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => abrirLocal(local)}
                    className="bg-white rounded-lg shadow-md p-5 cursor-pointer 
                             hover:shadow-lg transition-all duration-200 border border-gray-100"
                  >
                    {local.imagens && local.imagens.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={local.imagens[0]}
                          alt={local.titulo}
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {local.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {local.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {local.municipio}
                      </span>
                      <ArrowRight className="w-5 h-5 text-green-600" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensagem quando não há resultados */}
        {locaisFiltrados.length === 0 && termoBusca && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os termos de busca ou selecionar uma categoria diferente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibliotecaEducacionalIndigena; 