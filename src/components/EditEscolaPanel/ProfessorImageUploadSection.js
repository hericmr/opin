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

const ProfessorImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);

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
      
      // Ordenar imagens baseado na ordem do banco
      const sortedImages = [...images].sort((a, b) => {
        const orderA = orderMap.has(a.url) ? orderMap.get(a.url) : Infinity;
        const orderB = orderMap.has(b.url) ? orderMap.get(b.url) : Infinity;
        return orderA - orderB;
      });
      
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

  // Buscar imagens existentes dos professores
  const fetchExistingImages = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      const images = await getEscolaImages(escolaId, 'imagens-professores');
      const orderedImages = await loadImageOrder(images);
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
      console.log('Testando estrutura da tabela legendas_fotos (professores)...');
      testLegendasTable();
    }
  }, [escolaId]);

  // Buscar legendas para as imagens existentes
  useEffect(() => {
    const fetchLegendas = async () => {
      if (!existingImages.length || !escolaId) return;
      
      console.log('Buscando legendas para', existingImages.length, 'imagens de professores');
      const legendasMap = {};
      
      try {
        for (const img of existingImages) {
          // Pular se já tiver legendaData carregado (evitar recarregamento desnecessário)
          if (img.legendaData && Object.keys(img.legendaData).length > 0 && img.legendaData.legenda !== undefined) {
            continue;
          }
          
          console.log('Buscando legenda para imagem de professor:', img.url);
          const legenda = await getLegendaByImageUrl(img.url, escolaId, 'professor');
          console.log('Legenda encontrada para professor:', legenda);
          legendasMap[img.url] = legenda;
        }
        
        // Só atualizar se houver legendas novas para carregar
        if (Object.keys(legendasMap).length > 0) {
          setExistingImages(prev => prev.map(img => {
            const legenda = legendasMap[img.url];
            // Se não há legenda no map, manter os dados existentes
            if (!legenda && img.legendaData) {
              return img;
            }
            
            return {
              ...img,
              legendaData: legenda ? {
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
              })
            };
          }));
        }
        
        console.log('Legendas de professores carregadas com sucesso');
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
    console.log('=== DEBUG: Salvando legenda de professor ===');
    console.log('Imagem completa:', image);
    
    const imagem_url_relativa = image.url;
    const legendaData = image.legendaData;
    console.log('URL relativa:', imagem_url_relativa);
    console.log('Dados da legenda:', legendaData);
    console.log('Escola ID:', escolaId);
    
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
    
    console.log('Dados limpos da legenda:', cleanLegendaData);
    
    try {
      console.log('Buscando legenda existente...');
      let legenda = await getLegendaByImageUrl(imagem_url_relativa, escolaId, 'professor');
      console.log('Legenda existente encontrada:', legenda);
      
      if (legenda) {
        console.log('Atualizando legenda existente...');
        const updateData = {
          ...cleanLegendaData,
          updated_at: new Date().toISOString()
        };
        console.log('Dados para atualização:', updateData);
        
        const resultado = await updateLegendaFoto(legenda.id, updateData);
        console.log('Legenda de professor atualizada com sucesso:', resultado);
      } else {
        console.log('Criando nova legenda...');
        const novaLegendaData = {
          escola_id: escolaId,
          imagem_url: imagem_url_relativa,
          ...cleanLegendaData,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tipo_foto: 'professor'
        };
        console.log('Dados para nova legenda:', novaLegendaData);
        
        const novaLegenda = await addLegendaFoto(novaLegendaData);
        console.log('Nova legenda de professor criada:', novaLegenda);
      }
      
      // Atualizar imagens_professores
      console.log('Atualizando metadados da imagem...');
      let meta = await getProfessorImageMetaByUrl(image.publicUrl, escolaId);
      if (meta) {
        console.log('Metadados encontrados:', meta);
        await updateProfessorImageMeta(meta.id, {
          autor: cleanLegendaData.autor_foto,
          updated_at: new Date().toISOString()
        });
        console.log('Metadados atualizados com sucesso');
      } else {
        console.log('Nenhum metadado encontrado para atualizar');
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
      // Isso também recarrega as legendas através do useEffect
      await fetchExistingImages();
      
      if (onImagesUpdate) {
        console.log('Chamando onImagesUpdate...');
        onImagesUpdate();
      }
    } catch (err) {
      console.error('=== ERRO ao salvar legenda de professor ===');
      console.error('Erro completo:', err);
      console.error('Mensagem de erro:', err.message);
      console.error('Stack trace:', err.stack);
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
    <div className="space-y-6">
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
                    <img
                      src={URL.createObjectURL(file)}
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
      )}

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
                className={`bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-sm transition-all cursor-move ${
                  draggedImage === index ? 'opacity-50 scale-95' : ''
                } ${
                  dragOverIndex === index ? 'ring-2 ring-green-500 scale-105' : ''
                }`}
              >
                {/* Imagem */}
                <div className="relative group">
                  {/* Handle de arrastar */}
                  <div className="absolute top-2 left-2 z-10 bg-gray-900/80 p-1 rounded cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                <img
                  src={image.publicUrl}
                  alt={image.descricao || 'Imagem do professor'}
                    className="w-full h-48 object-cover"
                />
                
                {/* Overlay de ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <input
                        type="date"
                        className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-100"
                        value={image.legendaData?.data_foto || ''}
                        onChange={e => handleLegendaFieldChange(image.id, 'data_foto', e.target.value)}
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
                  <img
                    src={URL.createObjectURL(replacementFile)}
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