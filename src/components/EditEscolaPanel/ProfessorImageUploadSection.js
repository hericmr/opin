import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Upload, X, User, Trash2, Edit3, Check, AlertCircle, Save } from 'lucide-react';
import { 
  uploadProfessorImage, 
  getEscolaImages, 
  deleteImage, 
  updateImageDescription,
  checkImageLimit 
} from '../../services/escolaImageService';

const ProfessorImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLimit, setImageLimit] = useState({ current: 0, limit: 5, canUpload: true });
  const [editingImage, setEditingImage] = useState(null);
  const [editingDescription, setEditingDescription] = useState('');
  const [genero, setGenero] = useState('professor');
  const [titulo, setTitulo] = useState('');

  // Buscar imagens existentes dos professores
  const fetchExistingImages = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      const images = await getEscolaImages(escolaId, 'imagens-professores');
      setExistingImages(images);
      
      // Verificar limite
      const limit = await checkImageLimit(escolaId, 'imagens-professores');
      setImageLimit(limit);
    } catch (err) {
      console.error('Erro ao buscar imagens dos professores:', err);
      setError('Erro ao carregar imagens dos professores');
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  useEffect(() => {
    fetchExistingImages();
  }, [fetchExistingImages]);

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

  // Handler para seleção de arquivos
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Verificar se ainda pode fazer upload
    if (!imageLimit.canUpload) {
      setError(`Limite de ${imageLimit.limit} imagens dos professores atingido. Remova algumas imagens antes de adicionar novas.`);
      return;
    }

    // Verificar se não excederá o limite
    const totalImages = existingImages.length + selectedFiles.length + files.length;
    if (totalImages > imageLimit.limit) {
      setError(`Você pode adicionar no máximo ${imageLimit.limit - existingImages.length - selectedFiles.length} imagens dos professores.`);
      return;
    }

    // Validar arquivos
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        setError(`Arquivo "${file.name}" não é uma imagem válida. Use apenas JPG, PNG, WEBP ou GIF.`);
      }
      if (!isValidSize) {
        setError(`Arquivo "${file.name}" é muito grande. Tamanho máximo: 5MB.`);
      }
      
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setError('');
    }
  };

  // Handler para drag & drop
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length === 0) return;

    // Verificar se ainda pode fazer upload
    if (!imageLimit.canUpload) {
      setError(`Limite de ${imageLimit.limit} imagens dos professores atingido. Remova algumas imagens antes de adicionar novas.`);
      return;
    }

    // Verificar se não excederá o limite
    const totalImages = existingImages.length + selectedFiles.length + files.length;
    if (totalImages > imageLimit.limit) {
      setError(`Você pode adicionar no máximo ${imageLimit.limit - existingImages.length - selectedFiles.length} imagens dos professores.`);
      return;
    }

    // Filtrar apenas imagens
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles]);
      setError('');
    }
  }, [imageLimit, existingImages.length, selectedFiles.length]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Remover arquivo selecionado
  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload das imagens selecionadas
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const uploadedImages = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const progress = ((i + 1) / selectedFiles.length) * 100;
        setUploadProgress(progress);

        const uploadedImage = await uploadProfessorImage(file, escolaId, '', genero, titulo);
        uploadedImages.push(uploadedImage);
      }

      // Atualizar lista de imagens
      setExistingImages(prev => [...prev, ...uploadedImages]);
      setSelectedFiles([]);
      setUploadProgress(0);
      setSuccess(`${uploadedImages.length} imagem(ns) do(s) professor(es) carregada(s) com sucesso!`);

      // Atualizar limite
      const newLimit = await checkImageLimit(escolaId, 'imagens-professores');
      setImageLimit(newLimit);

      // Notificar componente pai
      if (onImagesUpdate) {
        onImagesUpdate();
      }

    } catch (err) {
      console.error('Erro no upload:', err);
      setError(`Erro ao fazer upload: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Deletar imagem existente
  const handleDeleteImage = async (imageId, filePath) => {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem do professor?')) return;

    try {
      await deleteImage(imageId, filePath, 'imagens-professores');
      
      // Atualizar lista
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
      // Atualizar limite
      const newLimit = await checkImageLimit(escolaId, 'imagens-professores');
      setImageLimit(newLimit);

      setSuccess('Imagem do professor excluída com sucesso!');

      // Notificar componente pai
      if (onImagesUpdate) {
        onImagesUpdate();
      }

    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      setError(`Erro ao excluir imagem: ${err.message}`);
    }
  };

  // Atualizar descrição da imagem
  const handleDescriptionChange = async (imageId, novaDescricao) => {
    if (!novaDescricao.trim()) return;

    try {
      await updateImageDescription(imageId, novaDescricao);
      
      // Atualizar lista
      setExistingImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, descricao: novaDescricao.trim() }
          : img
      ));

      setSuccess('Legenda atualizada com sucesso!');

      // Notificar componente pai
      if (onImagesUpdate) {
        onImagesUpdate();
      }

    } catch (err) {
      console.error('Erro ao atualizar descrição:', err);
      setError(`Erro ao atualizar legenda: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Carregando imagens dos professores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Imagens dos Professores</h3>
        </div>
        <div className="text-sm text-gray-500">
          {imageLimit.current}/{imageLimit.limit} imagens
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

      {/* Área de Upload */}
      {imageLimit.canUpload && (
        <div className="space-y-4">
          {/* Campo de seleção de gênero */}
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="genero-professor" className="text-sm font-medium text-gray-700">Gênero:</label>
            <select
              id="genero-professor"
              value={genero}
              onChange={e => setGenero(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              disabled={uploading}
            >
              <option value="professor">Professor</option>
              <option value="professora">Professora</option>
            </select>
          </div>
          {/* Campo de título da história */}
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="titulo-historia" className="text-sm font-medium text-gray-700">Título da história:</label>
            <input
              id="titulo-historia"
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
              placeholder="Ex: História da professora Mariza"
              disabled={uploading}
            />
          </div>
          {/* Drag & Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              uploading 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-green-300 bg-green-50 hover:border-green-400 hover:bg-green-100'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">
              Arraste imagens dos professores aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              JPG, PNG, WEBP, GIF • Máximo 5MB por arquivo • Máximo 5 imagens
            </p>
            
            <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              Selecionar Arquivos
            </label>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Fazendo upload das imagens dos professores...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Arquivos Selecionados */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Arquivos selecionados ({selectedFiles.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Fazendo Upload...' : 'Fazer Upload'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Imagens Existentes */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Imagens dos Professores ({existingImages.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingImages.map((image) => (
              <div key={image.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                {/* Imagem */}
                <div className="relative group">
                  <img
                    src={image.publicUrl}
                    alt={image.descricao || 'Imagem do professor'}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Overlay de ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        title="Excluir imagem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campo de legenda */}
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legenda da Imagem
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={image.descricao || ''}
                      onChange={(e) => {
                        // Atualizar localmente primeiro para feedback imediato
                        setExistingImages(prev => prev.map(img => 
                          img.id === image.id 
                            ? { ...img, descricao: e.target.value }
                            : img
                        ));
                      }}
                      onBlur={(e) => {
                        // Salvar quando sair do campo
                        if (e.target.value !== (image.descricao || '')) {
                          handleDescriptionChange(image.id, e.target.value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // Salvar ao pressionar Enter
                        if (e.key === 'Enter') {
                          e.target.blur();
                        }
                      }}
                      placeholder="Digite a legenda da imagem..."
                    />
                    <button
                      onClick={() => handleDescriptionChange(image.id, image.descricao || '')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Salvar legenda"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pressione Enter ou clique no ícone para salvar
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há imagens */}
      {existingImages.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma imagem dos professores adicionada ainda.</p>
          <p className="text-sm">Adicione imagens para mostrar os professores da escola.</p>
        </div>
      )}
    </div>
  );
};

ProfessorImageUploadSection.propTypes = {
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onImagesUpdate: PropTypes.func
};

export default ProfessorImageUploadSection; 