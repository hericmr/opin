import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Upload, X, Image as ImageIcon, Trash2, Edit3, Check, AlertCircle, Save } from 'lucide-react';
import { 
  uploadEscolaImage, 
  getEscolaImages, 
  deleteImage, 
  updateImageDescription,
  checkImageLimit 
} from '../../services/escolaImageService';
import { 
  getLegendaByImageUrl, 
  addLegendaFoto, 
  updateLegendaFoto,
  testLegendasTable
} from '../../services/legendasService';

const ImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLimit, setImageLimit] = useState({ current: 0, limit: 10, canUpload: true });
  const [editingImage, setEditingImage] = useState(null);
  const [editingDescription, setEditingDescription] = useState('');

  // Buscar imagens existentes
  const fetchExistingImages = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      const images = await getEscolaImages(escolaId, 'imagens-das-escolas');
      setExistingImages(images);
      
      // Verificar limite
      const limit = await checkImageLimit(escolaId, 'imagens-das-escolas');
      setImageLimit(limit);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      setError('Erro ao carregar imagens existentes');
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  useEffect(() => {
    fetchExistingImages();
  }, [fetchExistingImages]);

  // Testar estrutura da tabela quando o componente for carregado
  useEffect(() => {
    if (escolaId) {
      console.log('Testando estrutura da tabela legendas_fotos...');
      testLegendasTable();
    }
  }, [escolaId]);

  // Buscar legendas para as imagens existentes
  useEffect(() => {
    const fetchLegendas = async () => {
      if (!existingImages.length) return;
      console.log('Buscando legendas para', existingImages.length, 'imagens');
      const legendasMap = {};
      for (const img of existingImages) {
        console.log('Buscando legenda para imagem:', img.url);
        const legenda = await getLegendaByImageUrl(img.url, escolaId, 'escola');
        console.log('Legenda encontrada:', legenda);
        legendasMap[img.url] = legenda;
      }
      setExistingImages(prev => prev.map(img => ({
        ...img,
        legendaData: legendasMap[img.url] || {
          legenda: '',
          descricao_detalhada: '',
          autor_foto: '',
          data_foto: '',
          categoria: 'geral',
        }
      })));
    };
    fetchLegendas();
    // eslint-disable-next-line
  }, [existingImages.length, escolaId]);

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
      setError(`Limite de ${imageLimit.limit} imagens atingido. Remova algumas imagens antes de adicionar novas.`);
      return;
    }

    // Verificar se não excederá o limite
    const totalImages = existingImages.length + selectedFiles.length + files.length;
    if (totalImages > imageLimit.limit) {
      setError(`Você pode adicionar no máximo ${imageLimit.limit - existingImages.length - selectedFiles.length} imagens.`);
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
      setError(`Limite de ${imageLimit.limit} imagens atingido. Remova algumas imagens antes de adicionar novas.`);
      return;
    }

    // Verificar se não excederá o limite
    const totalImages = existingImages.length + selectedFiles.length + files.length;
    if (totalImages > imageLimit.limit) {
      setError(`Você pode adicionar no máximo ${imageLimit.limit - existingImages.length - selectedFiles.length} imagens.`);
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

        const uploadedImage = await uploadEscolaImage(file, escolaId);
        uploadedImages.push(uploadedImage);
      }

      // Atualizar lista de imagens
      setExistingImages(prev => [...prev, ...uploadedImages]);
      setSelectedFiles([]);
      setUploadProgress(0);
      setSuccess(`${uploadedImages.length} imagem(ns) carregada(s) com sucesso!`);

      // Atualizar limite
      const newLimit = await checkImageLimit(escolaId, 'imagens-das-escolas');
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
    if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      await deleteImage(imageId, filePath, 'imagens-das-escolas');
      
      // Atualizar lista
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
      // Atualizar limite
      const newLimit = await checkImageLimit(escolaId, 'imagens-das-escolas');
      setImageLimit(newLimit);

      setSuccess('Imagem excluída com sucesso!');

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

  // Atualizar legenda inline
  const handleLegendaFieldChange = (imageId, field, value) => {
    setExistingImages(prev => prev.map(img =>
      img.id === imageId
        ? { ...img, legendaData: { ...img.legendaData, [field]: value } }
        : img
    ));
  };

  const handleLegendaSave = async (image) => {
    console.log('=== DEBUG: Salvando legenda ===');
    console.log('Imagem completa:', image);
    
    const imagem_url_relativa = image.url;
    const legendaData = image.legendaData;
    console.log('URL relativa:', imagem_url_relativa);
    console.log('Dados da legenda:', legendaData);
    console.log('Escola ID:', escolaId);
    
    try {
      console.log('Buscando legenda existente...');
      let legenda = await getLegendaByImageUrl(imagem_url_relativa, escolaId, 'escola');
      console.log('Legenda existente encontrada:', legenda);
      
      if (legenda) {
        console.log('Atualizando legenda existente...');
        const updateData = {
          ...legendaData,
          updated_at: new Date().toISOString()
        };
        console.log('Dados para atualização:', updateData);
        
        const resultado = await updateLegendaFoto(legenda.id, updateData);
        console.log('Legenda atualizada com sucesso:', resultado);
      } else {
        console.log('Criando nova legenda...');
        const novaLegendaData = {
          escola_id: escolaId,
          imagem_url: imagem_url_relativa,
          ...legendaData,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tipo_foto: 'escola'
        };
        console.log('Dados para nova legenda:', novaLegendaData);
        
        const novaLegenda = await addLegendaFoto(novaLegendaData);
        console.log('Nova legenda criada:', novaLegenda);
      }
      
      setSuccess('Legenda salva com sucesso!');
      if (onImagesUpdate) {
        console.log('Chamando onImagesUpdate...');
        onImagesUpdate();
      }
    } catch (err) {
      console.error('=== ERRO ao salvar legenda ===');
      console.error('Erro completo:', err);
      console.error('Mensagem de erro:', err.message);
      console.error('Stack trace:', err.stack);
      setError('Erro ao salvar legenda: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando imagens...</span>
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
          <h3 className="text-lg font-semibold text-gray-900">Imagens da Escola</h3>
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
          {/* Drag & Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              uploading 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              JPG, PNG, WEBP, GIF • Máximo 5MB por arquivo
            </p>
            
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
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
                <span>Fazendo upload...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
          <h4 className="font-medium text-gray-900">Imagens da Escola ({existingImages.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingImages.map((image) => (
              <div key={image.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                {/* Imagem */}
                <div className="relative group">
                <img
                  src={image.publicUrl}
                  alt={image.descricao || 'Imagem da escola'}
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
                      <Trash2 className="w-5 h-5" />
                    </button>
                    </div>
                  </div>
                </div>

                {/* Campos de legenda integrados com legendas_fotos */}
                <div className="p-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legenda
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image.legendaData?.legenda || ''}
                    onChange={e => handleLegendaFieldChange(image.id, 'legenda', e.target.value)}
                    placeholder="Digite a legenda da imagem..."
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image.legendaData?.descricao_detalhada || ''}
                    onChange={e => handleLegendaFieldChange(image.id, 'descricao_detalhada', e.target.value)}
                    placeholder="Descrição detalhada da imagem..."
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autor da Foto
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image.legendaData?.autor_foto || ''}
                    onChange={e => handleLegendaFieldChange(image.id, 'autor_foto', e.target.value)}
                    placeholder="Nome do fotógrafo"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Foto
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image.legendaData?.data_foto || ''}
                    onChange={e => handleLegendaFieldChange(image.id, 'data_foto', e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={image.legendaData?.categoria || ''}
                    onChange={e => handleLegendaFieldChange(image.id, 'categoria', e.target.value)}
                    placeholder="Digite a categoria da imagem..."
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleLegendaSave(image)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      type="button"
                    >
                      <Save className="w-5 h-5" /> Salvar Legenda
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há imagens */}
      {existingImages.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma imagem adicionada ainda.</p>
          <p className="text-sm">Adicione imagens para mostrar a escola.</p>
        </div>
      )}
    </div>
  );
};

ImageUploadSection.propTypes = {
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onImagesUpdate: PropTypes.func
};

export default ImageUploadSection; 