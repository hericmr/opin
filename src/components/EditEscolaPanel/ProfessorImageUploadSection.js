import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Upload, X, User, Trash2, Check, AlertCircle, Save, RefreshCw, Settings, ChevronUp, GripVertical } from 'lucide-react';
import { 
  uploadProfessorImage, 
  getEscolaImages, 
  deleteImage, 
  replaceImage
} from '../../services/escolaImageService';
import { 
  getLegendaByImageUrl, 
  addLegendaFoto, 
  updateLegendaFoto,
  testLegendasTable,
  updateMultipleImageOrders
} from '../../services/legendasService';
import {
  addProfessorImageMeta,
  updateProfessorImageMeta,
  getProfessorImageMetaByUrl
} from '../../services/professorImageMetaService';
import { supabase } from '../../supabaseClient';
import BrazilianDateInput from '../AdminPanel/components/BrazilianDateInput';
import OptimizedImage from '../shared/OptimizedImage';
import FilePreview from '../shared/FilePreview';
import useImagePreloader from '../../hooks/useImagePreloader';

const ProfessorImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook de preload de imagens - React 19 best practice
  const { isImagePreloaded } = useImagePreloader(escolaId, true);

  // Helper function to get valid image URL - exactly like information panel
  const getImageUrl = useCallback((image) => {
    // Use publicURL (uppercase) first, exactly like information panel does
    if (image.publicURL) {
      return image.publicURL;
    }
    // Fallback to lowercase for compatibility
    if (image.publicUrl) {
      return image.publicUrl;
    }
    // If not available, construct it from the file path (same as info panel)
    if (image.url) {
      const { data: { publicUrl } } = supabase.storage
        .from('imagens-professores')
        .getPublicUrl(image.url);
      return publicUrl;
    }
    console.warn('Image missing URL:', image);
    return '';
  }, []);

  const [genero] = useState('professor');
  const [titulo] = useState('');
  
  // Estados para trocar imagem
  const [replacingImage, setReplacingImage] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  
  // Estados para drag and drop de reordenação
  const [draggedImage, setDraggedImage] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // Estado para controlar quais imagens têm campos detalhados expandidos
  const [expandedDetails, setExpandedDetails] = useState(new Set());
  
  // Toggle para expandir/colapsar campos detalhados
  const toggleDetails = (imageId) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  // Carregar ordem das imagens dos professores
  const loadImageOrder = useCallback(async (images) => {
    if (!escolaId || !images || images.length === 0) return images;
    
    try {
      // Buscar todas as legendas dos professores para obter a ordem
      const { data: legendas, error } = await supabase
        .from('legendas_fotos')
        .select('imagem_url, ordem')
        .eq('escola_id', escolaId)
        .eq('tipo_foto', 'professor')
        .eq('ativo', true);
      
      if (error) {
        console.warn('Erro ao buscar ordem das imagens dos professores:', error);
        return images;
      }
      
      if (!legendas || legendas.length === 0) {
        return images;
      }
      
      // Criar um mapa de URLs para ordem
      const orderMap = new Map();
      legendas.forEach(legenda => {
        if (legenda.ordem !== null && legenda.ordem !== undefined) {
          orderMap.set(legenda.imagem_url, legenda.ordem);
        }
      });
      
      // Ordenar imagens baseado na ordem do banco - PRESERVAR TODAS AS PROPRIEDADES
      const sortedImages = images.map(img => ({ ...img })).sort((a, b) => {
        const orderA = orderMap.get(a.url) ?? Infinity;
        const orderB = orderMap.get(b.url) ?? Infinity;
        return orderA - orderB;
      });
      
      // Verificar se publicURL foi preservado
      const missingUrls = sortedImages.filter(img => !img.publicURL);
      if (missingUrls.length > 0) {
        console.error('[ProfessorImageUploadSection] ⚠️ publicURL perdido após ordenação:', missingUrls);
        // Recriar publicURL se foi perdido
        missingUrls.forEach(img => {
          if (img.url) {
            const { data: { publicUrl } } = supabase.storage
              .from('imagens-professores')
              .getPublicUrl(img.url);
            img.publicURL = publicUrl;
          }
        });
      }
      
      return sortedImages;
    } catch (err) {
      console.warn('Erro ao carregar ordem das imagens dos professores:', err);
      return images;
    }
  }, [escolaId]);

  // Salvar ordem no banco de dados
  const saveImageOrder = useCallback(async (images) => {
    if (!escolaId || !images || images.length === 0) return;
    
    try {
      // Preparar array de ordens
      const imageOrders = images.map((img, index) => ({
        imageUrl: img.url,
        ordem: index + 1
      }));
      
      // Atualizar ordens no banco
      await updateMultipleImageOrders(imageOrders, escolaId);
    } catch (err) {
      console.error('Erro ao salvar ordem das imagens dos professores no banco:', err);
      setError('Erro ao salvar ordem das imagens. Tente novamente.');
    }
  }, [escolaId]);

  // Buscar imagens existentes dos professores - Using same logic as information panel
  const fetchExistingImages = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      
      // Use the same approach as information panel: list files directly from storage
      const { data: files, error } = await supabase.storage
        .from('imagens-professores')
        .list(`${escolaId}/`);

      if (error) {
        throw error;
      }

      if (!files || files.length === 0) {
        setExistingImages([]);
        setLoading(false);
        return;
      }

      // Process each file - Exatamente como painel de informações
      const images = files.map((file, index) => {
        const filePath = `${escolaId}/${file.name}`;
        const { data: { publicUrl } } = supabase.storage
          .from('imagens-professores')
          .getPublicUrl(filePath);

        console.log(`[ProfessorImageUploadSection] Image ${index + 1}:`, {
          filePath,
          publicUrl,
          fileName: file.name
        });

        return {
          id: `${escolaId}-${file.name}`,
          url: filePath,
          publicURL: publicUrl, // EXATAMENTE como painel de informações
          filePath: filePath,
          descricao: `Imagem`,
          created_at: file.created_at || new Date().toISOString()
        };
      });
      
      const orderedImages = await loadImageOrder(images);
      console.log('[ProfessorImageUploadSection] Images after ordering:', orderedImages.map(img => ({
        id: img.id,
        url: img.url,
        publicURL: img.publicURL || 'MISSING',
        hasPublicURL: !!img.publicURL
      })));
      setExistingImages(orderedImages);
    } catch (err) {
      console.error('Erro ao buscar imagens dos professores:', err);
      setError('Erro ao carregar imagens dos professores');
    } finally {
      setLoading(false);
    }
  }, [escolaId, loadImageOrder]);

  useEffect(() => {
    fetchExistingImages();
  }, [fetchExistingImages]);

  // Testar estrutura da tabela quando o componente for carregado
  useEffect(() => {
    if (escolaId) {
      testLegendasTable();
    }
  }, [escolaId]);

  // Buscar legendas para as imagens existentes
  useEffect(() => {
    const fetchLegendas = async () => {
      if (!existingImages.length || !escolaId) return;
      
      const legendasMap = {};
      
      try {
        for (const img of existingImages) {
          // Pular se já tiver legendaData carregado (evitar recarregamento desnecessário)
          if (img.legendaData && Object.keys(img.legendaData).length > 0 && img.legendaData.legenda !== undefined) {
            continue;
          }
          
          const legenda = await getLegendaByImageUrl(img.url, escolaId, 'professor');
          legendasMap[img.url] = legenda;
        }
        
        // Atualizar imagens com legendas - React 19: preserve all properties
        if (Object.keys(legendasMap).length > 0) {
          setExistingImages(prev => prev.map(img => {
            const legenda = legendasMap[img.url];
            
            // Se já tem legenda e não há nova, manter como está
            if (!legenda && img.legendaData) {
              return img;
            }
            
            // Extrair campos da legenda
            const legendaData = legenda ? {
              legenda: legenda.legenda || '',
              descricao_detalhada: legenda.descricao_detalhada || '',
              autor_foto: legenda.autor_foto || '',
              data_foto: legenda.data_foto || '',
              categoria: legenda.categoria || 'geral',
            } : (img.legendaData || {
              legenda: '',
              descricao_detalhada: '',
              autor_foto: '',
              data_foto: '',
              categoria: 'geral',
            });
            
            // React 19: preserve all properties using spread
            return {
              ...img,
              legendaData,
            };
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar legendas de professores:', error);
        setError('Erro ao carregar legendas: ' + error.message);
      }
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

    // Filtrar apenas imagens
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles]);
      setError('');
    }
  }, []);

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

        // Criar registro em imagens_professores
        await addProfessorImageMeta({
          escola_id: escolaId,
          imagem_url: uploadedImage.url,
          nome_arquivo: file.name,
          autor: '',
          ativo: true
        });
      }

      // Atualizar lista de imagens
      setExistingImages(prev => [...prev, ...uploadedImages]);
      setSelectedFiles([]);
      setUploadProgress(0);
      setSuccess(`${uploadedImages.length} imagem(ns) do(s) professor(es) carregada(s) com sucesso!`);



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
      
      // Recarregar lista a partir do storage para refletir estado real
      await fetchExistingImages();

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

  // Trocar imagem existente
  const handleReplaceImage = async (imageId, oldFilePath) => {
    if (!replacementFile) {
      setError('Selecione uma nova imagem para substituir');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Substituir a imagem
      const newImage = await replaceImage(
        replacementFile, 
        oldFilePath, 
        escolaId, 
        'imagens-professores',
        existingImages.find(img => img.id === imageId)?.descricao || ''
      );

      // Atualizar lista de imagens
      setExistingImages(prev => prev.map(img => 
        img.id === imageId ? newImage : img
      ));

      // Limpar estados
      setReplacingImage(null);
      setReplacementFile(null);
      setSuccess('Imagem do professor substituída com sucesso!');

      // Notificar componente pai
      if (onImagesUpdate) {
        onImagesUpdate();
      }

    } catch (err) {
      console.error('Erro ao substituir imagem:', err);
      setError(`Erro ao substituir imagem: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Iniciar processo de trocar imagem
  const startReplaceImage = (imageId) => {
    setReplacingImage(imageId);
    setReplacementFile(null);
  };

  // Cancelar troca de imagem
  const cancelReplaceImage = () => {
    setReplacingImage(null);
    setReplacementFile(null);
  };

  // Selecionar arquivo para substituição
  const handleReplacementFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReplacementFile(file);
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

  // Handlers para drag and drop de reordenação de imagens
  const handleImageDragStart = (e, index) => {
    setDraggedImage(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleImageDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = async (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedImage === null || draggedImage === dropIndex) {
      setDraggedImage(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...existingImages];
    const draggedItem = newImages[draggedImage];
    
    // Remover item da posição original
    newImages.splice(draggedImage, 1);
    
    // Inserir na nova posição
    newImages.splice(dropIndex, 0, draggedItem);
    
    setExistingImages(newImages);
    await saveImageOrder(newImages);
    setDraggedImage(null);
    setDragOverIndex(null);
    setSuccess('Ordem das imagens atualizada!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImageDragEnd = () => {
    setDraggedImage(null);
    setDragOverIndex(null);
  };

  const handleLegendaSave = async (image) => {
    const imagem_url_relativa = image.url;
    const legendaData = image.legendaData;
    
    // Validar e limpar dados da legenda
    const cleanLegendaData = { ...legendaData };
    
    // Tratar campo data_foto - remover se estiver vazio
    if (!cleanLegendaData.data_foto || cleanLegendaData.data_foto.trim() === '') {
      delete cleanLegendaData.data_foto;
    }
    
    // Tratar outros campos vazios que podem causar problemas
    Object.keys(cleanLegendaData).forEach(key => {
      if (cleanLegendaData[key] === '') {
        delete cleanLegendaData[key];
      }
    });
    
    try {
      let legenda = await getLegendaByImageUrl(imagem_url_relativa, escolaId, 'professor');
      
      if (legenda) {
        await updateLegendaFoto(legenda.id, {
          ...cleanLegendaData,
          updated_at: new Date().toISOString()
        });
      } else {
        await addLegendaFoto({
          escola_id: escolaId,
          imagem_url: imagem_url_relativa,
          ...cleanLegendaData,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tipo_foto: 'professor'
        });
      }
      
      // Atualizar imagens_professores
      const imagePublicUrl = image.publicURL || getImageUrl(image);
      let meta = await getProfessorImageMetaByUrl(imagePublicUrl, escolaId);
      if (meta) {
        await updateProfessorImageMeta(meta.id, {
          autor: cleanLegendaData.autor_foto,
          updated_at: new Date().toISOString()
        });
      }
      
      setSuccess('Legenda salva com sucesso!');
      
      // Atualizar o estado local imediatamente com os dados salvos
      setExistingImages(prev => prev.map(img => {
        if (img.id === image.id) {
          return {
            ...img,
            legendaData: {
              legenda: cleanLegendaData.legenda || '',
              descricao_detalhada: cleanLegendaData.descricao_detalhada || '',
              autor_foto: cleanLegendaData.autor_foto || '',
              data_foto: cleanLegendaData.data_foto || '',
              categoria: cleanLegendaData.categoria || 'geral',
            }
          };
        }
        return img;
      }));
      
      // Recarregar as imagens para garantir sincronização com o banco
      await fetchExistingImages();
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      setError('Erro ao salvar legenda: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <span className="ml-2 text-gray-400">Carregando imagens dos professores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ProfessorImageUploadSection">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-gray-100">Imagens dos Professores</h3>
        </div>
        <div className="text-sm text-gray-400">
          {existingImages.length} imagens
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/50 border-red-700/50 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-900/50 border-green-700/50 rounded-xl">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-green-300">{success}</span>
        </div>
      )}

      {/* Área de Upload */}
      <div className="space-y-4">
          {/* Drag & Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              uploading 
                ? 'border-gray-600 bg-gray-800/50' 
                : 'border-gray-600 bg-gray-800/50 hover:border-green-400 hover:bg-gray-700/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-300 mb-2">
              Arraste imagens dos professores aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-400 mb-4">
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
              <div className="flex justify-between text-sm text-gray-400">
                <span>Fazendo upload das imagens dos professores...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Arquivos Selecionados */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-100">Arquivos selecionados ({selectedFiles.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <FilePreview
                      file={file}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
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

      {/* Imagens Existentes */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-100">Imagens dos Professores ({existingImages.length})</h4>
            <p className="text-sm text-gray-400">Arraste as imagens para reordenar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingImages.map((image, index) => (
              <div 
                key={image.id} 
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`relative bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-sm transition-all cursor-move ${
                  draggedImage === index ? 'opacity-50 scale-95' : ''
                } ${
                  dragOverIndex === index ? 'ring-2 ring-green-500 scale-105' : ''
                }`}
              >
                {/* Imagem Container - EXATAMENTE como painel de informações */}
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  {/* Handle de arrastar */}
                  <div className="absolute top-2 left-2 z-10 bg-gray-900/80 p-1 rounded cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  {/* Renderizar imagem EXATAMENTE como no painel de informações */}
                  <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <OptimizedImage
                      src={image.publicURL}
                      alt={image.descricao || image.legendaData?.legenda || 'Imagem do professor'}
                      className="w-full h-full object-cover object-center"
                      isPreloaded={isImagePreloaded(image.publicURL)}
                      style={{ maxHeight: '350px' }}
                    />
                  </div>
                  
                  {/* Overlay de ações */}
                  <div className="absolute inset-0 z-10 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center pointer-events-none">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                    <button
                      onClick={() => startReplaceImage(image.id)}
                      className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-700"
                      title="Trocar imagem"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteImage(image.id, image.url)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
                      title="Excluir imagem"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    </div>
                  </div>
                </div>
                
                {/* Caption below thumbnail - Same as information panel */}
                {(image.legendaData?.legenda || image.descricao) && (
                  <div className="px-4 pb-2 pt-1">
                    <p className="text-sm font-medium text-gray-200 line-clamp-2">
                      {image.legendaData?.legenda || image.descricao}
                    </p>
                  </div>
                )}

                {/* Campos de legenda - Simplificados */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Legenda
                    </label>
                    <button
                      onClick={() => toggleDetails(image.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                      title={expandedDetails.has(image.id) ? 'Ocultar campos detalhados' : 'Mostrar campos detalhados'}
                      type="button"
                    >
                      {expandedDetails.has(image.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <Settings className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                    value={image.legendaData?.legenda || ''}
                    onChange={e => handleLegendaFieldChange(image.id, 'legenda', e.target.value)}
                    placeholder="Digite a legenda da imagem..."
                  />
                  
                  {/* Campos detalhados - Aparecem apenas quando expandido */}
                  {expandedDetails.has(image.id) && (
                    <div className="space-y-2 pt-2 border-t border-gray-600">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição Detalhada
                      </label>
                      <textarea
                        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                        value={image.legendaData?.descricao_detalhada || ''}
                        onChange={e => handleLegendaFieldChange(image.id, 'descricao_detalhada', e.target.value)}
                        placeholder="Descrição detalhada da imagem..."
                        rows={3}
                      />
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Autor da Foto
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                        value={image.legendaData?.autor_foto || ''}
                        onChange={e => handleLegendaFieldChange(image.id, 'autor_foto', e.target.value)}
                        placeholder="Nome do fotógrafo"
                      />
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Data da Foto
                      </label>
                      <BrazilianDateInput
                        value={image.legendaData?.data_foto || ''}
                        onChange={e => handleLegendaFieldChange(image.id, 'data_foto', e.target.value)}
                        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                        placeholder="DD/MM/AAAA"
                      />
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Categoria
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                        value={image.legendaData?.categoria || ''}
                        onChange={e => handleLegendaFieldChange(image.id, 'categoria', e.target.value)}
                        placeholder="Digite a categoria da imagem..."
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleLegendaSave(image)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      type="button"
                    >
                      <Save className="w-4 h-4" /> Salvar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Trocar Imagem */}
      {replacingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Trocar Imagem do Professor</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Selecione a nova imagem
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleReplacementFileSelect}
                  className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                />
              </div>
              
              {replacementFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pré-visualização
                  </label>
                  <FilePreview
                    file={replacementFile}
                    alt="Nova imagem"
                    className="w-full h-32 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelReplaceImage}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReplaceImage(replacingImage, existingImages.find(img => img.id === replacingImage)?.url)}
                disabled={!replacementFile || uploading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Trocando...' : 'Trocar Imagem'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem quando não há imagens */}
      {existingImages.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-500" />
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