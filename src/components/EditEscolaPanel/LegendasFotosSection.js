import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  Check,
  Calendar,
  User,
  Tag,
  School,
  GraduationCap
} from 'lucide-react';
import { 
  getLegendasFotos, 
  addLegendaFoto, 
  updateLegendaFoto, 
  deleteLegendaFoto,
  getLegendaByImageUrl 
} from '../../services/legendasService';

const LegendasFotosSection = ({ escolaId, onLegendasUpdate }) => {
  const [legendas, setLegendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLegenda, setEditingLegenda] = useState(null);
  const [tipoFoto, setTipoFoto] = useState('escola'); // 'escola' ou 'professor'
  const [formData, setFormData] = useState({
    imagem_url: '',
    legenda: '',
    descricao_detalhada: '',
    autor_foto: '',
    data_foto: '',
    categoria: 'geral',
    tipo_foto: 'escola'
  });

  // Categorias disponíveis
  const categorias = [
    { value: 'geral', label: 'Geral' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'atividades', label: 'Atividades' },
    { value: 'professores', label: 'Professores' },
    { value: 'alunos', label: 'Alunos' },
    { value: 'comunidade', label: 'Comunidade' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'outros', label: 'Outros' }
  ];

  // Buscar legendas existentes
  const fetchLegendas = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      const data = await getLegendasFotos(escolaId, tipoFoto);
      setLegendas(data);
    } catch (err) {
      console.error('Erro ao buscar legendas:', err);
      setError('Erro ao carregar legendas de fotos');
    } finally {
      setLoading(false);
    }
  }, [escolaId, tipoFoto]);

  useEffect(() => {
    fetchLegendas();
  }, [fetchLegendas]);

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Limpar formulário
  const clearForm = () => {
    setFormData({
      imagem_url: '',
      legenda: '',
      descricao_detalhada: '',
      autor_foto: '',
      data_foto: '',
      categoria: 'geral',
      tipo_foto: tipoFoto
    });
    setEditingLegenda(null);
    setShowForm(false);
  };

  // Abrir formulário para edição
  const handleEdit = (legenda) => {
    setEditingLegenda(legenda);
    setFormData({
      imagem_url: legenda.imagem_url,
      legenda: legenda.legenda,
      descricao_detalhada: legenda.descricao_detalhada || '',
      autor_foto: legenda.autor_foto || '',
      data_foto: legenda.data_foto || '',
      categoria: legenda.categoria || 'geral',
      tipo_foto: legenda.tipo_foto || tipoFoto
    });
    setShowForm(true);
  };

  // Salvar legenda
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.imagem_url.trim() || !formData.legenda.trim()) {
      setError('URL da imagem e legenda são obrigatórios');
      return;
    }

    try {
      if (editingLegenda) {
        // Atualizar legenda existente
        await updateLegendaFoto(editingLegenda.id, {
          ...formData,
          escola_id: escolaId
        });
        setSuccess('Legenda atualizada com sucesso!');
      } else {
        // Verificar se já existe legenda para esta imagem
        const legendaExistente = await getLegendaByImageUrl(formData.imagem_url, escolaId, tipoFoto);
        if (legendaExistente) {
          setError('Já existe uma legenda para esta imagem');
          return;
        }

        // Criar nova legenda
        await addLegendaFoto({
          ...formData,
          escola_id: escolaId,
          tipo_foto: tipoFoto
        });
        setSuccess('Legenda adicionada com sucesso!');
      }

      clearForm();
      fetchLegendas();
      
      if (onLegendasUpdate) {
        onLegendasUpdate();
      }

    } catch (err) {
      console.error('Erro ao salvar legenda:', err);
      setError(`Erro ao salvar legenda: ${err.message}`);
    }
  };

  // Deletar legenda
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta legenda?')) return;

    try {
      await deleteLegendaFoto(id);
      setSuccess('Legenda excluída com sucesso!');
      fetchLegendas();
      
      if (onLegendasUpdate) {
        onLegendasUpdate();
      }

    } catch (err) {
      console.error('Erro ao deletar legenda:', err);
      setError(`Erro ao excluir legenda: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando legendas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Legendas de Fotos</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Legenda
        </button>
      </div>

      {/* Seletor de tipo de foto */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Tipo de Foto:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setTipoFoto('escola')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tipoFoto === 'escola'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <School className="w-4 h-4" />
            Fotos da Escola
          </button>
          <button
            onClick={() => setTipoFoto('professor')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tipoFoto === 'professor'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Fotos dos Professores
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Formulário */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              {editingLegenda ? 'Editar Legenda' : 'Adicionar Legenda'}
            </h4>
            <button
              onClick={clearForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem *
                </label>
                <input
                  type="url"
                  value={formData.imagem_url}
                  onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={tipoFoto === 'escola' 
                    ? "https://exemplo.com/imagem-escola.jpg" 
                    : "https://exemplo.com/imagem-professor.jpg"
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legenda *
              </label>
              <input
                type="text"
                value={formData.legenda}
                onChange={(e) => setFormData({ ...formData, legenda: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Descrição curta da foto do ${tipoFoto}`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Detalhada
              </label>
              <textarea
                value={formData.descricao_detalhada}
                onChange={(e) => setFormData({ ...formData, descricao_detalhada: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder={`Descrição mais detalhada da foto do ${tipoFoto}...`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor da Foto
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.autor_foto}
                    onChange={(e) => setFormData({ ...formData, autor_foto: e.target.value })}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do fotógrafo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Foto
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.data_foto}
                    onChange={(e) => setFormData({ ...formData, data_foto: e.target.value })}
                    className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingLegenda ? 'Atualizar' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Legendas */}
      {legendas.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Legendas de {tipoFoto === 'escola' ? 'Fotos da Escola' : 'Fotos dos Professores'} ({legendas.length})
          </h4>
          <div className="grid gap-4">
            {legendas.map((legenda) => (
              <div key={legenda.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 capitalize">{legenda.categoria}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {legenda.tipo_foto === 'escola' ? 'Escola' : 'Professor'}
                      </span>
                    </div>
                    
                    <h5 className="font-medium text-gray-900 mb-1">{legenda.legenda}</h5>
                    
                    {legenda.descricao_detalhada && (
                      <p className="text-sm text-gray-600 mb-2">{legenda.descricao_detalhada}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {legenda.autor_foto && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {legenda.autor_foto}
                        </span>
                      )}
                      {legenda.data_foto && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(legenda.data_foto).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-blue-600 mt-2 truncate">{legenda.imagem_url}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(legenda)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar legenda"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(legenda.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir legenda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma legenda adicionada para {tipoFoto === 'escola' ? 'fotos da escola' : 'fotos dos professores'}.</p>
          <p className="text-sm">Adicione legendas para melhorar a descrição das fotos.</p>
        </div>
      )}
    </div>
  );
};

LegendasFotosSection.propTypes = {
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onLegendasUpdate: PropTypes.func
};

export default LegendasFotosSection; 
 