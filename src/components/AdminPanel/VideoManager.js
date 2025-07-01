import React, { useState, useEffect } from 'react';
import { getVideosEscola, createVideoEscola, updateVideoEscola, deleteVideoEscola } from '../../services/videoService';
import { Plus, Edit3, Trash2, Save } from 'lucide-react';

const VideoManager = ({ escolaId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    video_url: '',
    descricao: '',
    plataforma: 'youtube',
    categoria: 'geral',
    ativo: true
  });

  // Carregar vídeos
  const carregarVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVideosEscola(escolaId);
      setVideos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (escolaId) carregarVideos();
  }, [escolaId]);

  // Reset form
  const resetForm = () => {
    setFormData({
      titulo: '',
      video_url: '',
      descricao: '',
      plataforma: 'youtube',
      categoria: 'geral',
      ativo: true
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.video_url.trim()) {
      setError('Título e URL do vídeo são obrigatórios.');
      return;
    }
    const payload = {
      escola_id: Number(escolaId),
      ...formData,
      ativo: Boolean(formData.ativo)
    };
    try {
      setError('');
      setSuccess('');
      if (editingVideo) {
        await updateVideoEscola(editingVideo.id, payload);
        setSuccess('Vídeo atualizado com sucesso!');
      } else {
        await createVideoEscola(payload);
        setSuccess('Vídeo criado com sucesso!');
      }
      resetForm();
      carregarVideos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit
  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      titulo: video.titulo || '',
      video_url: video.video_url || '',
      descricao: video.descricao || '',
      plataforma: video.plataforma || 'youtube',
      categoria: video.categoria || 'geral',
      ativo: video.ativo
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo?')) return;
    try {
      await deleteVideoEscola(id);
      setSuccess('Vídeo excluído com sucesso!');
      carregarVideos();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando vídeos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vídeos da Escola</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Vídeo
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">{success}</div>}

      {/* Lista de vídeos */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum vídeo cadastrado.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Adicionar vídeo
            </button>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className={`p-6 bg-white rounded-lg border ${!video.ativo ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{video.titulo}</h4>
                    {!video.ativo && (
                      <span className="flex items-center gap-1 text-orange-600 text-sm">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{video.descricao}</p>
                  <div className="mb-2">
                    <iframe
                      src={video.video_url}
                      title={video.titulo}
                      className="w-full aspect-video rounded-lg border"
                      allowFullScreen
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Plataforma: {video.plataforma} | Categoria: {video.categoria}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulário de adicionar/editar vídeo */}
      {showForm && (
        <div className="p-6 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              {editingVideo ? 'Editar Vídeo' : 'Novo Vídeo'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Fechar</span>
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Título do vídeo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Vídeo *</label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="https://www.youtube.com/embed/..."
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Descrição do vídeo (opcional)"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                <input
                  type="text"
                  value={formData.plataforma}
                  onChange={e => setFormData({ ...formData, plataforma: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="youtube, vimeo..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="geral, institucional..."
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Ativo</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingVideo ? 'Atualizar' : 'Criar'}
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

export default VideoManager; 