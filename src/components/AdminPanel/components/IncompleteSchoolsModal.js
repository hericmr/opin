import React from 'react';
import { X, MapPin, Users, AlertCircle } from 'lucide-react';

/**
 * Modal para mostrar escolas sem informação em uma categoria
 * 
 * @param {boolean} isOpen - Se o modal está aberto
 * @param {Function} onClose - Função para fechar o modal
 * @param {string} selectedCategory - Categoria selecionada
 * @param {Array} incompleteSchools - Lista de escolas com dados incompletos
 */
const IncompleteSchoolsModal = ({
  isOpen,
  onClose,
  selectedCategory,
  incompleteSchools = []
}) => {
  if (!isOpen) return null;

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
              onClick={onClose}
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
              onClick={onClose}
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

export default IncompleteSchoolsModal;

