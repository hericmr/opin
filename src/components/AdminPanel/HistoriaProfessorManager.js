import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  getHistoriasProfessor, 
  createHistoriaProfessor, 
  updateHistoriaProfessor, 
  deleteHistoriaProfessor,
  uploadHistoriaProfessorImage,
  deleteHistoriaProfessorImage
} from '../../services/historiaProfessorService';

const HistoriaProfessorManager = ({ escolaId, escolaNome }) => {
  console.log('render historia manager', { escolaId, escolaNome });
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHistoria, setEditingHistoria] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    nome_professor: '',
    historia: '',
    ordem: 1,
    ativo: true
  });

  // Carregar histórias
  const carregarHistorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHistoriasProfessor(escolaId);
      setHistorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (escolaId) {
      carregarHistorias();
    }
  }, [escolaId]);

  // Reset form
  const resetForm = () => {
    setFormData({
      nome_professor: '',
      historia: '',
      ordem: 1,
      ativo: true
    });
    setEditingHistoria(null);
    setShowAddForm(false);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    console.log('🔍 SUBMIT CHAMADO - ID:', editingHistoria?.id);
    console.log('📝 Evento recebido:', e);
    console.log('📝 Evento type:', e.type);
    console.log('📝 Evento target:', e.target);
    
    e.preventDefault();
    console.log('✅ preventDefault executado');
    
    console.log('submit historia', editingHistoria);
    if (!formData.nome_professor.trim()) {
      setError('O nome do professor é obrigatório.');
      return;
    }
    if (!formData.historia.trim()) {
      setError('A história é obrigatória');
      return;
    }
    // Conversão de tipos e preparação do payload
    const payload = {
      escola_id: Number(escolaId),
      nome_professor: formData.nome_professor.trim(),
      historia: formData.historia.trim(),
      ordem: Number(formData.ordem) || 1,
      ativo: Boolean(formData.ativo),
    };
    if (editingHistoria) {
      console.log('Payload enviado para updateHistoriaProfessor:', payload);
    }
    console.log('Payload enviado para createHistoriaProfessor:', payload);
    try {
      setError('');
      setSuccess('');
      if (editingHistoria) {
        await updateHistoriaProfessor(editingHistoria.id, payload);
        setSuccess('História atualizada com sucesso!');
      } else {
        await createHistoriaProfessor(payload);
        setSuccess('História criada com sucesso!');
      }
      resetForm();
      carregarHistorias();
    } catch (err) {
      setError(err.message);
      console.log('ERRO AO CRIAR/EDITAR HISTÓRIA:', err);
    }
  };

  // Handle delete
  const handleDelete = async (historiaId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta história?')) return;

    try {
      await deleteHistoriaProfessor(historiaId);
      setSuccess('História excluída com sucesso!');
      carregarHistorias();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle image upload
  const handleImageUpload = async (historiaId, file) => {
    try {
      setUploadingImage(historiaId);
      setError('');
      
      await uploadHistoriaProfessorImage(file, escolaId, historiaId);
      setSuccess('Imagem carregada com sucesso!');
      carregarHistorias();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(null);
    }
  };

  // Handle image delete
  const handleImageDelete = async (historiaId) => {
    if (!window.confirm('Tem certeza que deseja remover a imagem desta história?')) return;

    try {
      await deleteHistoriaProfessorImage(historiaId);
      setSuccess('Imagem removida com sucesso!');
      carregarHistorias();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit
  const handleEdit = (historia) => {
    console.log('Entrou em handleEdit:', historia);
    setEditingHistoria(historia);
    setFormData({
      nome_professor: historia.nome_professor || '',
      historia: historia.historia,
      ordem: historia.ordem,
      ativo: historia.ativo
    });
    setShowAddForm(true);
  };

  // Handle reorder
  const handleReorder = async (historiaId, direction) => {
    const historiaIndex = historias.findIndex(h => h.id === historiaId);
    if (historiaIndex === -1) return;

    const newHistorias = [...historias];
    const targetIndex = direction === 'up' ? historiaIndex - 1 : historiaIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= newHistorias.length) return;

    // Trocar posições
    [newHistorias[historiaIndex], newHistorias[targetIndex]] = 
    [newHistorias[targetIndex], newHistorias[historiaIndex]];

    // Atualizar ordens
    const updates = newHistorias.map((historia, index) => ({
      id: historia.id,
      ordem: index + 1
    }));

    try {
      // Atualizar todas as histórias com novas ordens
      for (const update of updates) {
        await updateHistoriaProfessor(update.id, { ordem: update.ordem });
      }
      
      setSuccess('Ordem atualizada com sucesso!');
      carregarHistorias();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Carregando histórias do professor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Histórias do Professor - {escolaNome}
          </h3>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova História
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Lista de Histórias */}
      <div className="space-y-4">
        {historias.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma história do professor cadastrada.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar primeira história
            </button>
          </div>
        ) : (
          historias.map((historia, index) => {
            console.log('Renderizando história:', historia);
            return (
              <div
                key={historia.id}
                className={`p-6 bg-white rounded-lg border ${
                  !historia.ativo ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        #{historia.ordem}
                      </span>
                      {historia.nome_professor && (
                        <h4 className="font-medium text-gray-900">{historia.nome_professor}</h4>
                      )}
                      {!historia.ativo && (
                        <span className="flex items-center gap-1 text-orange-600 text-sm">
                          <EyeOff className="w-4 h-4" />
                          Inativa
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 line-clamp-3">
                      {historia.historia}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {/* Reorder buttons */}
                    <button
                      onClick={() => handleReorder(historia.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(historia.id, 'down')}
                      disabled={index === historias.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    {/* Action buttons */}
                    <button
                      onClick={() => { console.log('CLICOU NO BOTÃO EDITAR', historia); handleEdit(historia); }}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(historia.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="p-6 bg-gray-50 rounded-lg border">
          {editingHistoria
            ? console.log('Abrindo formulário de edição:', editingHistoria)
            : console.log('Abrindo formulário de criação')}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              {editingHistoria ? 'Editar História' : 'Nova História'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Professor *
                </label>
                <input
                  type="text"
                  value={formData.nome_professor}
                  onChange={(e) => setFormData({ ...formData, nome_professor: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nome do professor"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.ordem}
                  onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                História *
              </label>
              <textarea
                value={formData.historia}
                onChange={(e) => setFormData({ ...formData, historia: e.target.value })}
                rows={6}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Digite a história do professor..."
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Ativa</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingHistoria ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HistoriaProfessorManager; 