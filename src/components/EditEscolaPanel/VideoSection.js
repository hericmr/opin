import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Video, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  Check,
  Clock,
  Tag,
  Play,
  Link
} from 'lucide-react';
import { 
  getTitulosVideos, 
  addTituloVideo, 
  updateTituloVideo, 
  deleteTituloVideo,
  getTituloByVideoUrl 
} from '../../services/legendasService';

const VideoSection = ({ escolaId, videoUrl, onVideoUrlChange, onTitulosUpdate }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ url: '', titulo: '' });

  // Buscar vídeos existentes
  const fetchVideos = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      const data = await getTitulosVideos(escolaId);
      
      // Organizar vídeos por URL
      const videosOrganizados = data.map(item => ({
        id: item.id,
        url: item.video_url,
        titulo: item.titulo,
        plataforma: item.plataforma,
        categoria: item.categoria
      }));
      
      setVideos(videosOrganizados);
    } catch (err) {
      console.error('Erro ao buscar vídeos:', err);
      setError('Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

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

  // Detectar plataforma automaticamente
  const detectPlataforma = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    } else if (url.includes('facebook.com')) {
      return 'facebook';
    } else if (url.includes('instagram.com')) {
      return 'instagram';
    }
    return 'outro';
  };

  // Adicionar novo vídeo
  const handleAddVideo = async (e) => {
    e.preventDefault();
    
    if (!newVideo.url.trim() || !newVideo.titulo.trim()) {
      setError('URL e título são obrigatórios');
      return;
    }

    try {
      // Verificar se já existe vídeo com esta URL
      const videoExistente = videos.find(v => v.url === newVideo.url);
      if (videoExistente) {
        setError('Este vídeo já foi adicionado');
        return;
      }

      // Criar novo vídeo
      await addTituloVideo({
        video_url: newVideo.url,
        titulo: newVideo.titulo,
        plataforma: detectPlataforma(newVideo.url),
        categoria: 'geral',
        escola_id: escolaId
      });
      
      setSuccess('Vídeo adicionado com sucesso!');
      setNewVideo({ url: '', titulo: '' });
      setShowAddVideo(false);
      fetchVideos();
      
      if (onTitulosUpdate) {
        onTitulosUpdate();
      }
    } catch (err) {
      console.error('Erro ao adicionar vídeo:', err);
      setError('Erro ao adicionar vídeo');
    }
  };

  // Atualizar título de um vídeo
  const handleTituloChange = async (videoId, novoTitulo) => {
    if (!novoTitulo.trim()) return;

    try {
      await updateTituloVideo(videoId, {
        titulo: novoTitulo,
        escola_id: escolaId
      });
      
      fetchVideos();
      if (onTitulosUpdate) {
        onTitulosUpdate();
      }
    } catch (err) {
      console.error('Erro ao atualizar título:', err);
      setError('Erro ao atualizar título');
    }
  };

  // Remover vídeo
  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm('Tem certeza que deseja remover este vídeo?')) return;

    try {
      await deleteTituloVideo(videoId);
      setSuccess('Vídeo removido com sucesso!');
      fetchVideos();
      
      if (onTitulosUpdate) {
        onTitulosUpdate();
      }
    } catch (err) {
      console.error('Erro ao remover vídeo:', err);
      setError('Erro ao remover vídeo');
    }
  };

  // Obter URL de embed para qualquer plataforma
  const getVideoEmbedUrl = (url) => {
    if (!url) return '';
    // YouTube
    const ytMatch = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    // Outros: retorna o próprio link
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Vídeo Principal (campo original) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Vídeo Principal</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL do Vídeo
          </label>
          <input
            type="url"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={videoUrl || ''}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="Cole aqui o link do vídeo (YouTube, Vimeo, etc)"
          />
          <p className="text-xs text-gray-500 mt-1">Exemplo: https://www.youtube.com/watch?v=...</p>
        </div>

        {/* Título do vídeo principal */}
        {videoUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Vídeo
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={videos.find(v => v.url === videoUrl)?.titulo || ''}
              onChange={(e) => {
                const video = videos.find(v => v.url === videoUrl);
                if (video) {
                  handleTituloChange(video.id, e.target.value);
                }
              }}
              placeholder="Das crianças da Aldeia Uru'ity para o mundo"
            />
            <p className="text-xs text-gray-500 mt-1">Exemplo: "Das crianças da Aldeia Uru'ity para o mundo"</p>
          </div>
        )}

        {/* Pré-visualização do vídeo principal */}
        {videoUrl && getVideoEmbedUrl(videoUrl) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pré-visualização</label>
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
              <iframe
                src={getVideoEmbedUrl(videoUrl)}
                title="Pré-visualização do vídeo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Outros Vídeos */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Outros Vídeos</h3>
          </div>
          <button
            onClick={() => setShowAddVideo(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Outro Vídeo
          </button>
        </div>

        {/* Lista de outros vídeos */}
        {videos.filter(v => v.url !== videoUrl).length > 0 && (
          <div className="space-y-4">
            {videos.filter(v => v.url !== videoUrl).map((video) => (
              <div key={video.id} className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título do Vídeo
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={video.titulo}
                      onChange={(e) => handleTituloChange(video.id, e.target.value)}
                      placeholder="Digite o título do vídeo"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveVideo(video.id)}
                    className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover vídeo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL do Vídeo
                  </label>
                  <input
                    type="url"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                    value={video.url}
                    disabled
                  />
                </div>

                {/* Pré-visualização do vídeo */}
                {getVideoEmbedUrl(video.url) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pré-visualização</label>
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={getVideoEmbedUrl(video.url)}
                        title={video.titulo}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mensagem quando não há outros vídeos */}
        {videos.filter(v => v.url !== videoUrl).length === 0 && !showAddVideo && (
          <div className="text-center py-8 text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhum vídeo adicional adicionado.</p>
            <p className="text-sm">Clique em "Adicionar Outro Vídeo" para incluir mais vídeos.</p>
          </div>
        )}

        {/* Formulário para adicionar novo vídeo */}
        {showAddVideo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-blue-800">Adicionar Novo Vídeo</h4>
              <button
                onClick={() => {
                  setShowAddVideo(false);
                  setNewVideo({ url: '', titulo: '' });
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Vídeo *
                </label>
                <input
                  type="url"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newVideo.titulo}
                  onChange={(e) => setNewVideo({ ...newVideo, titulo: e.target.value })}
                  placeholder="Digite o título do vídeo"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Adicionar Vídeo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVideo(false);
                    setNewVideo({ url: '', titulo: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
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
    </div>
  );
};

VideoSection.propTypes = {
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  videoUrl: PropTypes.string,
  onVideoUrlChange: PropTypes.func.isRequired,
  onTitulosUpdate: PropTypes.func
};

export default VideoSection; 
 