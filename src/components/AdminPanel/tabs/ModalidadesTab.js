import React from 'react';
import { useModalidades } from '../hooks/useModalidades';
import { MODALIDADES_OPTIONS, MODALIDADES_CATEGORIAS } from '../utils/modalidadesOptions';

const ModalidadesTab = ({ 
  editingLocation, 
  setEditingLocation 
}) => {
  const {
    selectedModalidades,
    outroModalidade,
    handleModalidadeChange,
    handleOutroModalidadeChange,
    saveModalidades,
    getModalidadesPreview,
    hasSelectedModalidades,
  } = useModalidades();

  // Função para salvar modalidades no editingLocation
  const handleSaveModalidades = () => {
    const modalidadesText = saveModalidades();
    setEditingLocation(prev => ({
      ...prev,
      'Modalidade de Ensino/turnos de funcionamento': modalidadesText
    }));
  };

  return (
    <div className="space-y-6">
      {/* Modalidades de Ensino */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200 mb-4 text-base">
          Modalidades de Ensino
        </label>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {MODALIDADES_CATEGORIAS.map((categoria) => (
              <div key={categoria.id}>
                <h4 className="text-sm font-semibold text-green-400 mb-2 border-b border-gray-600 pb-1">
                  {categoria.titulo}
                </h4>
                <div className="space-y-2 ml-2">
                  {categoria.indices.map((index) => {
                    const modalidade = MODALIDADES_OPTIONS[index];
                    return (
                      <label key={index} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                          checked={selectedModalidades.includes(modalidade)}
                          onChange={() => handleModalidadeChange(modalidade)}
                        />
                        <span className="text-sm text-gray-200 leading-relaxed">{modalidade}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Opção "Outro" */}
            <div className="border-t border-gray-600 pt-3 mt-3">
              <label className="flex items-start space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  checked={selectedModalidades.some(m => m.startsWith('Outro:'))}
                  onChange={() => handleOutroModalidadeChange(outroModalidade)}
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-200">Outro (especificar):</span>
                  <input
                    type="text"
                    className="mt-1 w-full px-3 py-2 border border-gray-600 rounded text-sm bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Digite a modalidade específica..."
                    value={outroModalidade}
                    onChange={(e) => handleOutroModalidadeChange(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Número de Alunos */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Número de Alunos</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation['Numero de alunos'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Numero de alunos': e.target.value })}
        />
      </div>

      {/* Turnos de Funcionamento */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">Turnos de Funcionamento</label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation.turnos_funcionamento || ''}
          onChange={e => setEditingLocation({ ...editingLocation, turnos_funcionamento: e.target.value })}
          placeholder="Ex: Diurno, Noturno, Vespertino, etc."
        />
      </div>

      {/* Botão para salvar modalidades */}
      <div className="md:col-span-2">
        <button
          type="button"
          onClick={handleSaveModalidades}
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
        >
          Salvar Modalidades Selecionadas
        </button>
      </div>

      {/* Preview do texto final */}
      {hasSelectedModalidades() && (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
            Preview do Texto Final
          </label>
          <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-200 text-sm min-h-[60px]">
            {getModalidadesPreview()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalidadesTab; 