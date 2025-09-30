import React, { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscolasData } from '../../hooks/useEscolasData';
import MaterialCard from './components/MaterialCard';
import PageHeader from '../PageHeader';

const MateriaisDidáticos = ({ locations }) => {
  const { dataPoints, loading, error } = useEscolasData();
  
  // Estados de filtros
  const [termoBusca, setTermoBusca] = useState('');

  // Função para determinar o tipo de material baseado no conteúdo da escola
  const determinarTipoMaterial = (escola) => {
    const titulo = escola.titulo?.toLowerCase() || '';
    const descricao = escola.descricao_detalhada?.toLowerCase() || '';
    const materialIndigena = escola.material_indigena?.toLowerCase() || '';
    const praticasPedagogicas = escola.praticas_pedagogicas?.toLowerCase() || '';

    const textoCompleto = `${titulo} ${descricao} ${materialIndigena} ${praticasPedagogicas}`;

    if (textoCompleto.includes('língua') || textoCompleto.includes('lingua') || textoCompleto.includes('letramento')) {
      return 'linguas_letramento';
    } else if (textoCompleto.includes('história') || textoCompleto.includes('historia') || textoCompleto.includes('contação')) {
      return 'historias';
    } else if (textoCompleto.includes('planta') || textoCompleto.includes('medicina') || textoCompleto.includes('cura')) {
      return 'plantas_medicinais';
    } else if (textoCompleto.includes('canto') || textoCompleto.includes('música') || textoCompleto.includes('musica')) {
      return 'cantos';
    } else if (textoCompleto.includes('jogo') || textoCompleto.includes('brincadeira')) {
      return 'jogos';
    } else if (textoCompleto.includes('ambiente') || textoCompleto.includes('mata') || textoCompleto.includes('plantio')) {
      return 'meio_ambiente';
    } else {
      return 'saberes_ancestrais';
    }
  };

  // Adicionar tipo de material aos dados
  const materiaisComTipo = useMemo(() => {
    const materiais = dataPoints || locations || [];
    return materiais.map(material => ({
      ...material,
      tipo: determinarTipoMaterial(material)
    }));
  }, [dataPoints, locations]);

  // Filtrar materiais baseado apenas na busca por texto
  const materiaisFiltrados = useMemo(() => {
    if (!termoBusca) return materiaisComTipo;

    const termo = termoBusca.toLowerCase();
    return materiaisComTipo.filter(material => 
      material.titulo?.toLowerCase().includes(termo) ||
      material.descricao_detalhada?.toLowerCase().includes(termo) ||
      material.municipio?.toLowerCase().includes(termo) ||
      material.povos_indigenas?.toLowerCase().includes(termo) ||
      material.gestao?.toLowerCase().includes(termo) ||
      material.material_indigena?.toLowerCase().includes(termo) ||
      material.praticas_pedagogicas?.toLowerCase().includes(termo)
    );
  }, [materiaisComTipo, termoBusca]);

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Início', path: '/', active: false },
    { label: 'Materiais Didáticos', path: '/conteudo', active: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 pt-16 sm:pt-20">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-800">Carregando materiais didáticos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 pt-16 sm:pt-20">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar materiais: {error}</p>
          </div>
        </div>
      </div>
    );
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
      <PageHeader
        title="Materiais Didaticos"
        titleSize="text-3xl md:text-4xl lg:text-5xl"
        descriptionSize="text-base md:text-lg"
        description="Conteúdos produzidos por professores indígenas sobre línguas, histórias, plantas medicinais, cantos, jogos, meio ambiente e saberes ancestrais"
      />

      {/* Ferramenta simples de busca */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar materiais didáticos indígenas..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                         focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
              />
            </div>
            
            {/* Resultados da busca */}
            {termoBusca && (
              <div className="mt-3 text-sm text-gray-600 text-center">
                {materiaisFiltrados.length} resultado{materiaisFiltrados.length !== 1 ? 's' : ''} encontrado{materiaisFiltrados.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={termoBusca}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {materiaisFiltrados.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                />
              ))}
            </div>

            {/* Mensagem quando não há resultados */}
            {materiaisFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum material encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os termos de busca.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MateriaisDidáticos;
