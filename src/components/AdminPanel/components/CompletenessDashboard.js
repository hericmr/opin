import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';
import { X, MapPin, Users, AlertCircle } from 'lucide-react';

const CompletenessDashboard = () => {
  const [completenessData, setCompletenessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [incompleteSchools, setIncompleteSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Definição das categorias de campos para o dashboard
  const fieldCategories = {
    'Dados Básicos': [
      'Escola',
      'Município',
      'Endereço',
      'Terra Indigena (TI)',
      'Escola Estadual ou Municipal',
      'Parcerias com o município',
      'Diretoria de Ensino',
      'Ano de criação da escola'
    ],
    'Povos e Línguas': [
      'Povos indigenas',
      'Linguas faladas'
    ],
    'Modalidades e Alunos': [
      'Modalidade de Ensino/turnos de funcionamento',
      'Numero de alunos',
      'turnos_funcionamento'
    ],
    'Infraestrutura': [
      'Espaço escolar e estrutura',
      'Acesso à água',
      'Tem coleta de lixo?',
      'Acesso à internet',
      'Equipamentos Tecs',
      'Modo de acesso à escola',
      'Cozinha',
      'Merenda_escolar',
      'diferenciada'
    ],
    'Gestão e Professores': [
      'Gestão/Nome',
      'Outros funcionários',
      'Quantidade de professores indígenas',
      'Quantidade de professores não indígenas',
      'Professores falam a língua indígena?',
      'Formação dos professores',
      'Formação continuada oferecida'
    ],
    'Material Pedagógico': [
      'A escola possui PPP próprio?',
      'PPP elaborado com a comunidade?',
      'Material pedagógico não indígena',
      'Material pedagógico indígena',
      'Práticas pedagógicas indígenas',
      'Formas de avaliação'
    ],
    'Projetos e Parcerias': [
      'Projetos em andamento',
      'Parcerias com universidades?',
      'Ações com ONGs ou coletivos?',
      'Desejos da comunidade para a escola'
    ],
    'Redes Sociais e Mídia': [
      'Escola utiliza redes sociais?',
      'Links das redes sociais',
      'link_para_videos'
    ],
    'Histórias': [
      'historia_da_escola'
    ],
    'Localização': [
      'Latitude',
      'Longitude',
      'logradouro',
      'numero',
      'complemento',
      'bairro',
      'cep',
      'estado'
    ],
    'Mídia': [
      'imagem_header'
    ]
  };

  // Função para calcular completude de um campo
  const calculateFieldCompleteness = (data, fieldName) => {
    if (!data || data.length === 0) return 0;
    
    const totalRecords = data.length;
    const filledRecords = data.filter(record => {
      const value = record[fieldName];
      return value !== null && value !== undefined && value !== '' && value !== 'null';
    }).length;
    
    return Math.round((filledRecords / totalRecords) * 100);
  };

  // Função para calcular completude de uma categoria
  const calculateCategoryCompleteness = (data, fields) => {
    if (!data || data.length === 0) return 0;
    
    const fieldCompleteness = fields.map(field => 
      calculateFieldCompleteness(data, field)
    );
    
    return Math.round(
      fieldCompleteness.reduce((sum, completeness) => sum + completeness, 0) / fields.length
    );
  };

  // Função para obter cor baseada na completude
  const getCompletenessColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400 bg-green-400/10';
    if (percentage >= 60) return 'text-yellow-400 bg-yellow-400/10';
    if (percentage >= 40) return 'text-orange-400 bg-orange-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  // Função para obter ícone baseado na completude
  const getCompletenessIcon = (percentage) => {
    if (percentage >= 80) return '✅';
    if (percentage >= 60) return '⚠️';
    if (percentage >= 40) return '🔶';
    return '❌';
  };

  // Função para encontrar escolas sem informação em uma categoria
  const findIncompleteSchools = (data, categoryFields) => {
    if (!data || data.length === 0) return [];
    
    return data.filter(school => {
      // Verifica se pelo menos um campo da categoria está vazio
      return categoryFields.some(field => {
        const value = school[field];
        return value === null || value === undefined || value === '' || value === 'null';
      });
    }).map(school => {
      // Identifica quais campos específicos estão vazios
      const missingFields = categoryFields.filter(field => {
        const value = school[field];
        return value === null || value === undefined || value === '' || value === 'null';
      });
      
      return {
        ...school,
        missingFields
      };
    });
  };

  // Função para lidar com clique em uma categoria
  const handleCategoryClick = (category) => {
    const categoryFields = fieldCategories[category];
    const incomplete = findIncompleteSchools(completenessData.rawData, categoryFields);
    
    setSelectedCategory(category);
    setIncompleteSchools(incomplete);
    setShowModal(true);
  };

  // Buscar dados de completude
  const fetchCompletenessData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('escolas_completa')
        .select('*');

      if (error) throw error;

      // Calcular completude para cada categoria
      const categoryCompleteness = {};
      Object.keys(fieldCategories).forEach(category => {
        categoryCompleteness[category] = calculateCategoryCompleteness(data, fieldCategories[category]);
      });

      // Calcular completude geral
      const allFields = Object.values(fieldCategories).flat();
      const overallCompleteness = calculateCategoryCompleteness(data, allFields);

      setCompletenessData({
        totalRecords: data.length,
        overallCompleteness,
        categoryCompleteness,
        rawData: data
      });

    } catch (err) {
      console.error('Erro ao buscar dados de completude:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCompletenessData();
  }, [fetchCompletenessData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-gray-400 text-lg">Carregando dashboard de completude...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold">Erro ao carregar dashboard</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!completenessData) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhum dado encontrado para análise de completude.
      </div>
    );
  }

  const { overallCompleteness, categoryCompleteness } = completenessData;

  // Componente Modal para mostrar escolas sem informação
  const IncompleteSchoolsModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* Header do Modal */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-100">
                  Escolas sem informação - {selectedCategory}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {incompleteSchools.length} escola(s) com dados incompletos nesta categoria
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {incompleteSchools.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-green-400 text-4xl mb-4">✅</div>
                <p className="text-gray-300 text-lg">Todas as escolas têm informações completas nesta categoria!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incompleteSchools.map((school, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-100 mb-1">
                          {school.Escola || 'Nome não informado'}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {school.Município && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {school.Município}
                            </div>
                          )}
                          {school['Terra Indigena (TI)'] && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {school['Terra Indigena (TI)']}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                          {school.missingFields.length} campo(s) faltando
                        </span>
                      </div>
                    </div>

                    {/* Campos faltando */}
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium text-gray-300">Campos sem informação:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {school.missingFields.map((field, fieldIndex) => (
                          <span
                            key={fieldIndex}
                            className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer do Modal */}
          <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Clique em uma escola para editar suas informações
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas gerais */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Dashboard de Completude
            </h2>
            <p className="text-gray-400 mt-1">
              Análise do preenchimento dos dados da tabela escolas_completa
            </p>
          </div>
          <button
            onClick={fetchCompletenessData}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
        </div>

      </div>

      {/* Barra de progresso geral */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-200">Progresso Geral</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompletenessColor(overallCompleteness)}`}>
            {overallCompleteness}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              overallCompleteness >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
              overallCompleteness >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
              overallCompleteness >= 40 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${overallCompleteness}%` }}
          ></div>
        </div>
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(categoryCompleteness).map(([category, percentage]) => (
          <div 
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:bg-gray-800/70 hover:border-gray-600/50 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-200">{category}</h4>
              <span className="text-2xl">{getCompletenessIcon(percentage)}</span>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">Completude</span>
                <span className={`text-sm font-medium ${getCompletenessColor(percentage)}`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    percentage >= 80 ? 'bg-green-500' :
                    percentage >= 60 ? 'bg-yellow-500' :
                    percentage >= 40 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              <p>{fieldCategories[category].length} campos nesta categoria</p>
              <p className="text-gray-500 group-hover:text-gray-400 transition-colors">
                Clique para ver escolas sem informação
              </p>
            </div>
          </div>
        ))}
      </div>


      {/* Modal para mostrar escolas sem informação */}
      <IncompleteSchoolsModal />
    </div>
  );
};

export default CompletenessDashboard;