import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload, X, User, AlertCircle } from 'lucide-react';
import FotoProfessorService from '../../services/fotoProfessorService';

const HistoriaProfessorForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editing,
  loading,
  onImageChange,
  onRemoveImage,
  escolaId
}) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');

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
      const result = await FotoProfessorService.uploadFotoProfessor(
        file, 
        formData.nome_professor || 'professor', 
        escolaId
      );

      if (result.success) {
        // Atualizar formData com a URL da foto
        setFormData({ ...formData, foto_rosto: result.url });
        setPhotoSuccess('Foto carregada com sucesso!');
        
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
    setFormData({ ...formData, foto_rosto: '' });
    setPhotoError('');
    setPhotoSuccess('');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do(a) Professor(a)
          </label>
          <input
            type="text"
            value={formData.nome_professor}
            onChange={e => setFormData({ ...formData, nome_professor: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Nome do(a) professor(a)"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gênero
          </label>
          <select
            value={formData.genero}
            onChange={e => setFormData({ ...formData, genero: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            disabled={loading}
          >
            <option value="professor">Professor</option>
            <option value="professora">Professora</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título (opcional)
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Título da história"
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          História *
        </label>
        <textarea
          value={formData.historia}
          onChange={e => setFormData({ ...formData, historia: e.target.value })}
          rows={6}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Digite a história do professor..."
          required
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem
          </label>
          <input
            type="number"
            min="1"
            value={formData.ordem}
            onChange={e => setFormData({ ...formData, ordem: parseInt(e.target.value) || 1 })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-4 mt-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-700">Ativa</span>
          </label>
        </div>
      </div>
      {/* Upload de foto de rosto do professor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto de Rosto do(a) Professor(a) <span className="text-gray-500">(opcional)</span>
        </label>
        
        {/* Preview da foto atual */}
        {formData.foto_rosto && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-4">
              <img 
                src={formData.foto_rosto} 
                alt="Foto do professor(a)" 
                className="w-20 h-20 object-cover rounded-full border-2 border-green-200 shadow-sm" 
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Foto de rosto atual:</p>
                <p className="text-xs text-gray-500 break-all">{formData.foto_rosto}</p>
              </div>
              <button 
                type="button" 
                onClick={handleRemovePhoto} 
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                disabled={uploadingPhoto || loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mensagens de status */}
        {photoError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">{photoError}</span>
          </div>
        )}

        {photoSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">{photoSuccess}</span>
          </div>
        )}

        {/* Campo de upload */}
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          uploadingPhoto 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 hover:border-green-400'
        }`}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={loading || uploadingPhoto}
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
                  <span className="text-sm text-blue-600">Enviando foto...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formData.foto_rosto ? 'Alterar foto de rosto' : 'Adicionar foto de rosto'}
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
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {editing ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

HistoriaProfessorForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  loading: PropTypes.bool,
  onImageChange: PropTypes.func,
  onRemoveImage: PropTypes.func,
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default HistoriaProfessorForm; 