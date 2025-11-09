import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';
import logger from '../../../utils/logger';
import { fieldCategories } from '../constants/completenessConstants';
import { useCompletenessCalculations } from '../hooks/useCompletenessCalculations';
import CompletenessCard from './CompletenessCard';
import OverallProgressBar from './OverallProgressBar';
import IncompleteSchoolsModal from './IncompleteSchoolsModal';

const CompletenessDashboard = () => {
  const [completenessData, setCompletenessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [incompleteSchools, setIncompleteSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Hook para cálculos de completude
  const {
    getCompletenessColor,
    getCompletenessIcon,
    getProgressBarColor,
    getSimpleProgressBarColor,
    findIncompleteSchools,
    categoryCompleteness: calculatedCategoryCompleteness,
    overallCompleteness: calculatedOverallCompleteness
  } = useCompletenessCalculations(completenessData?.rawData || []);

  // Função para lidar com clique em uma categoria
  // Otimizada com useCallback para evitar recriação em cada render
  const handleCategoryClick = useCallback((category) => {
    const categoryFields = fieldCategories[category];
    const incomplete = findIncompleteSchools(categoryFields);
    
    setSelectedCategory(category);
    setIncompleteSchools(incomplete);
    setShowModal(true);
  }, [findIncompleteSchools]);

  // Buscar dados de completude
  const fetchCompletenessData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('escolas_completa')
        .select('*');

      if (error) throw error;

      setCompletenessData({
        totalRecords: data.length,
        rawData: data
      });

    } catch (err) {
      logger.error('Erro ao buscar dados de completude:', err);
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
      <OverallProgressBar
        overallCompleteness={calculatedOverallCompleteness}
        getCompletenessColor={getCompletenessColor}
        getProgressBarColor={getProgressBarColor}
      />

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(calculatedCategoryCompleteness).map(([category, percentage]) => {
          // Memoizar o handler para cada card para evitar recriação
          const handleClick = () => handleCategoryClick(category);
          return (
            <CompletenessCard
              key={category}
              category={category}
              percentage={percentage}
              fieldCount={fieldCategories[category].length}
              onClick={handleClick}
              getCompletenessColor={getCompletenessColor}
              getCompletenessIcon={getCompletenessIcon}
              getSimpleProgressBarColor={getSimpleProgressBarColor}
            />
          );
        })}
      </div>

      {/* Modal para mostrar escolas sem informação */}
      <IncompleteSchoolsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedCategory={selectedCategory}
        incompleteSchools={incompleteSchools}
      />
    </div>
  );
};

export default CompletenessDashboard;