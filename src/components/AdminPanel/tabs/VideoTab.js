import React from 'react';
import VideoManager from '../VideoManager';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const VideoTab = ({ editingLocation, setEditingLocation }) => {
  // Extrair o ID da escola do editingLocation
  const escolaId = editingLocation?.id || editingLocation?.escola_id;

  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="videos"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Vídeos"
      />
      
      {/* Informações sobre Vídeos */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2">
          Gerenciamento de Vídeos
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Aqui você pode adicionar, editar e gerenciar vídeos relacionados à escola. 
          Os vídeos podem ser do YouTube, Vimeo ou outras plataformas.
        </p>
      </div>

      {/* VideoManager Component */}
      {escolaId ? (
        <div className="bg-white rounded-lg shadow-sm">
          <VideoManager escolaId={escolaId} />
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-300">
            Selecione uma escola para gerenciar os vídeos.
          </p>
        </div>
      )}

      {/* Instruções de Uso */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2">
          Como Adicionar Vídeos
        </h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong className="text-amber-400">YouTube:</strong>
            <p>Use o formato: https://www.youtube.com/embed/VIDEO_ID</p>
            <p className="text-xs text-gray-400">Exemplo: https://www.youtube.com/embed/dQw4w9WgXcQ</p>
          </div>
          
          <div>
            <strong className="text-amber-400">Vimeo:</strong>
            <p>Use o formato: https://player.vimeo.com/video/VIDEO_ID</p>
            <p className="text-xs text-gray-400">Exemplo: https://player.vimeo.com/video/123456789</p>
          </div>
          
          <div>
            <strong className="text-amber-400">Outras plataformas:</strong>
            <p>Use o URL de embed fornecido pela plataforma</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTab; 