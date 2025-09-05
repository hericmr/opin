import React, { useState, useEffect } from 'react';
import { getHistoriasProfessor, createHistoriaProfessor, updateHistoriaProfessor, deleteHistoriaProfessor } from '../../../services/historiaProfessorService';
import FotoProfessorService from '../../../services/fotoProfessorService';
import RichTextEditor from './RichTextEditor';
import { Upload, X, User, AlertCircle } from 'lucide-react';

const HistoriaProfessoresTab = ({ editingLocation, setEditingLocation }) => {
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHistoria, setEditingHistoria] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');

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
    setEditingHistoria(historia);
    setIsCreating(false);
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
    setPhotoError('');
    setPhotoSuccess('');
  };

  // Função para lidar com upload da foto de rosto
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar arquivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      setPhotoError('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
    if (file.size > tamanhoMaximo) {
      setPhotoError('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError('');
      setPhotoSuccess('');

      // Fazer upload da foto
      console.log('=== HistoriaProfessoresTab.handlePhotoUpload ===');
      console.log('Arquivo:', file.name);
      console.log('Nome Professor:', editingHistoria?.nome_professor || 'professor');
      console.log('Escola ID:', editingLocation.id);
      
      const result = await FotoProfessorService.uploadFotoProfessor(
        file, 
        editingHistoria?.nome_professor || 'professor', 
        editingLocation.id
      );

      console.log('Resultado do upload:', result);
      
      if (result.success) {
        console.log('Atualizando editingHistoria com URL:', result.url);
        console.log('Estado atual editingHistoria:', editingHistoria);
        
        const novoEstado = { ...editingHistoria, foto_rosto: result.url };
        console.log('Novo estado que será definido:', novoEstado);
        
        // Atualizar editingHistoria com a URL da foto
        setEditingHistoria(novoEstado);
        setPhotoSuccess('Foto carregada com sucesso!');
        
        // Verificar se o estado foi atualizado
        setTimeout(() => {
          console.log('Estado após atualização (deve mostrar foto_rosto):', editingHistoria);
        }, 100);
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setPhotoSuccess(''), 3000);
      } else {
        setPhotoError(result.error || 'Erro ao fazer upload da foto');
      }
    } catch (error) {
      console.error('Erro no upload da foto:', error);
      setPhotoError('Erro inesperado ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Função para remover foto
  const handleRemovePhoto = () => {
    setEditingHistoria({ ...editingHistoria, foto_rosto: '' });
    setPhotoError('');
    setPhotoSuccess('');
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

            {/* Upload de foto de rosto do professor */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Foto de Rosto do Professor <span className="text-gray-400">(opcional)</span>
              </label>
              
              {/* Preview da foto atual */}
              {editingHistoria.foto_rosto && (
                <div className="mb-4 p-4 border border-gray-600 rounded-lg bg-gray-700">
                  <div className="flex items-center gap-4">
                    <img 
                      src={editingHistoria.foto_rosto} 
                      alt="Foto do professor" 
                      className="w-20 h-20 object-cover rounded-full border-2 border-green-400 shadow-sm" 
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-1">Foto de rosto atual:</p>
                      <p className="text-xs text-gray-400 break-all">{editingHistoria.foto_rosto}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemovePhoto} 
                      className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                      disabled={uploadingPhoto}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagens de status */}
              {photoError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">{photoError}</span>
                </div>
              )}

              {photoSuccess && (
                <div className="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{photoSuccess}</span>
                </div>
              )}

              {/* Campo de upload */}
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                uploadingPhoto 
                  ? 'border-blue-400 bg-blue-900/20' 
                  : 'border-gray-600 hover:border-green-400'
              }`}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                  id="foto-rosto-input"
                />
                <label 
                  htmlFor="foto-rosto-input" 
                  className={`cursor-pointer block ${uploadingPhoto ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {uploadingPhoto ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                        <span className="text-sm text-blue-400">Enviando foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {editingHistoria.foto_rosto ? 'Alterar foto de rosto' : 'Adicionar foto de rosto'}
                        </span>
                        <span className="text-xs text-gray-500">
                          JPEG, PNG ou WebP (máx. 5MB)
                        </span>
                      </>
                    )}
                  </div>
                </label>
              </div>
              
              {/* Informações sobre o upload */}
              <div className="mt-2 text-xs text-gray-500">
                <p>• A foto de rosto será exibida junto com o depoimento do professor</p>
                <p>• Recomendado: foto quadrada ou retrato, boa qualidade</p>
                <p>• A foto será salva no bucket 'avatar' e vinculada ao depoimento</p>
              </div>
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