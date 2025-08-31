import React, { useState, useEffect } from 'react';
import { getHistoriasProfessor, createHistoriaProfessor, updateHistoriaProfessor, deleteHistoriaProfessor } from '../../../services/historiaProfessorService';
import RichTextEditor from './RichTextEditor';

const HistoriaProfessoresTab = ({ editingLocation, setEditingLocation }) => {
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHistoria, setEditingHistoria] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Carregar histórias existentes
  useEffect(() => {
    if (editingLocation?.id) {
      loadHistorias();
    }
  }, [editingLocation?.id]);

  const loadHistorias = async () => {
    if (!editingLocation?.id) return;
    
    setLoading(true);
    try {
      const data = await getHistoriasProfessor(editingLocation.id);
      setHistorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHistoria = async (historiaData) => {
    if (!editingLocation?.id) return;

    try {
      if (editingHistoria?.id) {
        // Atualizar história existente
        await updateHistoriaProfessor(editingHistoria.id, historiaData);
      } else {
        // Criar nova história
        await createHistoriaProfessor({
          ...historiaData,
          escola_id: editingLocation.id
        });
      }
      
      // Recarregar histórias
      await loadHistorias();
      
      // Limpar estado de edição
      setEditingHistoria(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Erro ao salvar história:', error);
      alert('Erro ao salvar história: ' + error.message);
    }
  };

  const handleDeleteHistoria = async (historiaId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta história?')) return;

    try {
      await deleteHistoriaProfessor(historiaId);
      await loadHistorias();
    } catch (error) {
      console.error('Erro ao deletar história:', error);
      alert('Erro ao deletar história: ' + error.message);
    }
  };

  const handleEditHistoria = (historia) => {
    console.log('handleEditHistoria chamado com:', historia);
    console.log('Estado atual editingHistoria:', editingHistoria);
    console.log('Estado atual isCreating:', isCreating);
    
    setEditingHistoria(historia);
    setIsCreating(false);
    
    console.log('Após setState - editingHistoria será:', historia);
    console.log('Após setState - isCreating será: false');
  };

  const handleNewHistoria = () => {
    setEditingHistoria({
      nome_professor: '',
      historia: ''
    });
    setIsCreating(true);
  };

  const handleCancelEdit = () => {
    setEditingHistoria(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Carregando histórias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">Depoimentos dos Professores</h3>
        <button
          onClick={handleNewHistoria}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Nova História
        </button>
      </div>

      {/* Formulário de edição/criação */}
      {editingHistoria && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-200 mb-4">
            {isCreating ? 'Nova História do Professor' : 'Editar História do Professor'}
          </h4>
          
          <div className="space-y-4">
            {/* Nome do Professor */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nome do Professor
              </label>
              <input
                type="text"
                value={editingHistoria.nome_professor || ''}
                onChange={(e) => setEditingHistoria({
                  ...editingHistoria,
                  nome_professor: e.target.value
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nome do professor (opcional)"
              />
            </div>

            {/* História/Depoimento */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Depoimento/História
              </label>
              <RichTextEditor
                value={editingHistoria.historia || ''}
                onChange={(value) => setEditingHistoria({
                  ...editingHistoria,
                  historia: value
                })}
                placeholder="Digite o depoimento ou história do professor..."
              />
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => handleSaveHistoria(editingHistoria)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {isCreating ? 'Criar' : 'Salvar'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de histórias existentes */}
      {historias.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-200">Histórias Existentes</h4>
          {historias.map((historia) => (
            <div key={historia.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {historia.nome_professor && (
                    <h5 className="font-medium text-green-400 mb-2">
                      {historia.nome_professor}
                    </h5>
                  )}
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: historia.historia }}
                  />
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditHistoria(historia)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteHistoria(historia.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há histórias */}
      {historias.length === 0 && !editingHistoria && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma história de professor cadastrada ainda.</p>
          <p className="text-sm mt-2">Clique em "Nova História" para começar.</p>
        </div>
      )}
    </div>
  );
};

export default HistoriaProfessoresTab; 