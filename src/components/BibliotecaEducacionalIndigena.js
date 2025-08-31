import React, { useState, useMemo } from 'react';
import { Search, BookOpen, MapPin, Users, Home, Heart, Star, Filter, ArrowRight, ChevronRight, Grid, List, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIAS_EDUCACAO_INDIGENA = {
  'linguas_indigenas': { 
    cor: 'green-700', 
    bgCor: 'bg-green-50', 
    borderCor: 'border-green-200', 
    icone: 'onca',
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showQuickNav, setShowQuickNav] = useState(false);

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

  // Breadcrumbs para navegação
  const breadcrumbs = [
    { label: 'Início', path: '/', active: false },
    { label: 'Biblioteca Educacional', path: '/conteudo', active: true }
  ];

  if (categoriaSelecionada !== 'todos') {
    breadcrumbs.push({
      label: CATEGORIAS_EDUCACAO_INDIGENA[categoriaSelecionada]?.label || 'Categoria',
      path: null,
      active: true
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 pt-16 sm:pt-20">
      {/* Breadcrumbs de Navegação */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                {crumb.path ? (
                  <button
                    onClick={() => window.location.href = crumb.path}
                    className="text-gray-600 hover:text-green-700 transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={`font-medium ${crumb.active ? 'text-green-700' : 'text-gray-900'}`}>
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

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

      {/* Navegação por Abas */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            {/* Abas de Categorias */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoriaSelecionada('todos')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  categoriaSelecionada === 'todos'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas as Categorias
              </button>
              {Object.entries(CATEGORIAS_EDUCACAO_INDIGENA).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setCategoriaSelecionada(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    categoriaSelecionada === key
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>

            {/* Controles de Visualização */}
            <div className="flex items-center gap-3">
              {/* Botão de Navegação Rápida */}
              <button
                onClick={() => setShowQuickNav(!showQuickNav)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Navegação Rápida"
              >
                <Grid className="w-5 h-5 text-gray-600" />
              </button>

              {/* Alternar Modo de Visualização */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                  }`}
                  title="Visualização em Grid"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                  }`}
                  title="Visualização em Lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Rápida */}
      <AnimatePresence>
        {showQuickNav && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white shadow-md border-b"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Navegação Rápida</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(CATEGORIAS_EDUCACAO_INDIGENA).map(([key, value]) => {
                  const locais = locaisPorCategoria[key] || [];
                  const IconComponent = value.icone;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setCategoriaSelecionada(key);
                        setShowQuickNav(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      {IconComponent === 'onca' ? (
                        <img 
                          src={`${process.env.PUBLIC_URL}/onca.svg`} 
                          alt="Ícone de onça" 
                          className="w-6 h-6" 
                        />
                      ) : (
                        <IconComponent className={`w-6 h-6 text-${value.cor}`} />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{value.label}</div>
                        <div className="text-sm text-gray-500">{locais.length} itens</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      {IconComponent === 'onca' ? (
                        <span className="bg-green-300 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
                          <img 
                            src={`${process.env.PUBLIC_URL}/onca.svg`} 
                            alt="Ícone de onça" 
                            className="w-8 h-8 sm:w-16 sm:h-16" 
                            aria-hidden="true"
                          />
                        </span>
                      ) : (
                        <IconComponent className={`w-8 h-8 text-${info.cor} mr-3`} />
                      )}
                      <div className="flex-1">
                        <h2 className={`text-2xl font-bold text-${info.cor}`}>
                          {info.label}
                        </h2>
                        <p className="text-gray-600 mt-1">{info.descricao}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                          {locaisFiltrados.length} item{locaisFiltrados.length !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => setCategoriaSelecionada(categoria)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Ver Todos
                        </button>
                      </div>
                    </div>
                    
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {locaisFiltrados.slice(0, viewMode === 'grid' ? 6 : 3).map((local) => (
                        <motion.div
                          key={local.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => abrirLocal(local)}
                          className={`bg-white rounded-lg shadow-md p-5 cursor-pointer 
                                   hover:shadow-lg transition-all duration-200 border border-gray-100
                                   ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}
                        >
                          {local.imagens && local.imagens.length > 0 && (
                            <div className={`${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'mb-4'}`}>
                              <img
                                src={local.imagens[0]}
                                alt={local.titulo}
                                className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-40'} object-cover rounded-lg shadow-sm`}
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {local.titulo}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                              {local.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, viewMode === 'list' ? 200 : 150)}...
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {local.municipio}
                              </span>
                              <ArrowRight className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {locaisFiltrados.length > (viewMode === 'grid' ? 6 : 3) && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setCategoriaSelecionada(categoria)}
                          className="text-green-700 hover:text-green-800 font-medium px-6 py-2 border border-green-700 rounded-lg hover:bg-green-50 transition-colors"
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
                    className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para todas as categorias
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {CATEGORIAS_EDUCACAO_INDIGENA[categoriaSelecionada]?.label}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {CATEGORIAS_EDUCACAO_INDIGENA[categoriaSelecionada]?.descricao}
                  </p>
                </div>
              </div>

              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {locaisFiltrados.map((local) => (
                  <motion.div
                    key={local.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => abrirLocal(local)}
                    className={`bg-white rounded-lg shadow-md p-5 cursor-pointer 
                             hover:shadow-lg transition-all duration-200 border border-gray-100
                             ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}
                  >
                    {local.imagens && local.imagens.length > 0 && (
                      <div className={`${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'mb-4'}`}>
                        <img
                          src={local.imagens[0]}
                          alt={local.titulo}
                          className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'} object-cover rounded-lg shadow-sm`}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {local.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {local.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, viewMode === 'list' ? 200 : 120)}...
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {local.municipio}
                        </span>
                        <ArrowRight className="w-5 h-5 text-green-600" />
                      </div>
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