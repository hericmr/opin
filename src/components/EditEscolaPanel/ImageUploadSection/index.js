import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { testLegendasTable } from '../../../services/legendasService';

// Hooks
import { useImageUpload } from './hooks/useImageUpload';
import { useImageManagement } from './hooks/useImageManagement';
import { useImageDragDrop } from './hooks/useImageDragDrop';
import { useImageLegends } from './hooks/useImageLegends';
import { useHeaderImage } from './hooks/useHeaderImage';
import { useDrawingsImage } from './hooks/useDrawingsImage';
import { useImageReplace } from './hooks/useImageReplace';

// Components
import UploadArea from './components/UploadArea';
import UploadProgress from './components/UploadProgress';
import SelectedFilesPreview from './components/SelectedFilesPreview';
import ImagesGrid from './components/ImagesGrid';
import ReplaceImageModal from './components/ReplaceImageModal';
import EmptyState from './components/EmptyState';

/**
 * Main ImageUploadSection component - Refactored and modularized
 * @param {Object} props
 * @param {string|number} props.escolaId - School ID
 * @param {Function} [props.onImagesUpdate] - Callback when images are updated
 */
const ImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  // State for selected files
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // State for messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hooks
  const imageUpload = useImageUpload(escolaId);
  const imageManagement = useImageManagement(escolaId, 'imagens-das-escolas', 'escola');
  const headerImage = useHeaderImage(escolaId);
  const drawingsImage = useDrawingsImage(escolaId);
  const imageReplace = useImageReplace(escolaId, 'imagens-das-escolas');
  const { saveLegend } = useImageLegends(escolaId, 'escola');
  
  // Drag & drop hook
  const dragDrop = useImageDragDrop();

  // Test table structure on mount
  useEffect(() => {
    if (escolaId) {
      testLegendasTable();
    }
  }, [escolaId]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    setSelectedFiles(prev => [...prev, ...files]);
    setError('');
  }, []);

  // Handle file drop
  const handleFileDrop = useCallback((files) => {
    setSelectedFiles(prev => [...prev, ...files]);
    setError('');
  }, []);

  // Remove selected file
  const removeSelectedFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      const uploadedImages = await imageUpload.uploadFiles(selectedFiles);
      
      if (uploadedImages.length > 0) {
        // Add images to management
        await imageManagement.addImages(uploadedImages);
        
        setSelectedFiles([]);
        setSuccess(`${uploadedImages.length} imagem(ns) carregada(s) com sucesso!`);
        
        if (onImagesUpdate) {
          onImagesUpdate();
        }
      } else if (imageUpload.error) {
        setError(imageUpload.error);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao fazer upload');
    }
  }, [selectedFiles, imageUpload, imageManagement, onImagesUpdate]);

  // Handle delete image
  const handleDeleteImage = useCallback(async (imageId, filePath) => {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      // If deleted image was header, remove header reference
      const deletedImage = imageManagement.images.find(img => img.id === imageId);
      if (deletedImage) {
        if (deletedImage.publicURL === headerImage.headerImageUrl) {
          try {
            await headerImage.removeHeaderImage();
          } catch (_) {
            // Ignore if already removed
          }
        }
        // If deleted image was a drawing, remove from drawings
        if (drawingsImage.isDrawingImage(deletedImage.publicURL)) {
          try {
            await drawingsImage.removeDrawingImage(deletedImage.publicURL);
          } catch (_) {
            // Ignore if already removed
          }
        }
      }

      await imageManagement.deleteImage(imageId, filePath);
      setSuccess('Imagem excluída com sucesso!');

      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      setError(err.message || 'Erro ao excluir imagem');
    }
  }, [imageManagement, headerImage, drawingsImage, onImagesUpdate]);

  // Handle replace image (called when file is selected in modal)
  const handleReplaceImage = useCallback(async (file) => {
    if (!imageReplace.replacingImageId) return;
    
    const image = imageManagement.images.find(img => img.id === imageReplace.replacingImageId);
    if (!image) return;

    try {
      // Preserve legend data before replacement
      const oldLegendData = image.legendaData || {};
      const oldUrl = image.url;

      const newImage = await imageReplace.replaceImage(
        imageReplace.replacingImageId,
        image.url,
        image.descricao || ''
      );

      // Update local state immediately with new image, preserving legend
      imageManagement.updateImageLocal(imageReplace.replacingImageId, (img) => ({
        ...img,
        url: newImage.url,
        publicURL: newImage.publicUrl,
        publicUrl: newImage.publicUrl,
        // Preserve legend data locally until refresh confirms it
        legendaData: oldLegendData
      }));

      // Refresh images in background (without showing loading) to sync with database
      imageManagement.refresh(false).catch(err => {
        console.warn('Erro ao atualizar lista de imagens (não crítico):', err);
      });
      
      setSuccess('Imagem substituída com sucesso! A legenda foi preservada.');

      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao substituir imagem:', err);
      setError(err.message || 'Erro ao substituir imagem');
    }
  }, [imageManagement, imageReplace, onImagesUpdate]);

  // Handle set header image
  const handleSetHeaderImage = useCallback(async (imageUrl) => {
    try {
      await headerImage.setHeaderImage(imageUrl);
      setSuccess('Imagem definida como header com sucesso!');
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao definir imagem do header:', err);
      setError(err.message || 'Erro ao definir imagem do header');
    }
  }, [headerImage, onImagesUpdate]);

  // Handle remove header image
  const handleRemoveHeaderImage = useCallback(async () => {
    try {
      await headerImage.removeHeaderImage();
      setSuccess('Imagem removida do header com sucesso!');
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao remover imagem do header:', err);
      setError(err.message || 'Erro ao remover imagem do header');
    }
  }, [headerImage, onImagesUpdate]);

  // Handle add drawing image
  const handleAddDrawingImage = useCallback(async (imageUrl) => {
    try {
      await drawingsImage.addDrawingImage(imageUrl);
      setSuccess('Imagem adicionada aos Desenhos com sucesso!');
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao adicionar imagem aos desenhos:', err);
      setError(err.message || 'Erro ao adicionar imagem aos desenhos');
    }
  }, [drawingsImage, onImagesUpdate]);

  // Handle remove drawing image
  const handleRemoveDrawingImage = useCallback(async (imageUrl) => {
    try {
      await drawingsImage.removeDrawingImage(imageUrl);
      setSuccess('Imagem removida dos Desenhos com sucesso!');
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao remover imagem dos desenhos:', err);
      setError(err.message || 'Erro ao remover imagem dos desenhos');
    }
  }, [drawingsImage, onImagesUpdate]);

  // Handle image reorder
  const handleImageReorder = useCallback(async (newOrder) => {
    try {
      await imageManagement.updateImages(newOrder);
      setSuccess('Ordem das imagens atualizada!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao reordenar imagens:', err);
      setError('Erro ao salvar ordem das imagens');
    }
  }, [imageManagement]);

  // Wrap drag drop handlers to pass images
  const dragDropHandlers = {
    ...dragDrop,
    handleDrop: (e, dropIndex) => {
      if (dragDrop.draggedIndex === null || dragDrop.draggedIndex === dropIndex) {
        dragDrop.handleDragEnd();
        return;
      }
      
      const newImages = [...imageManagement.images];
      const draggedItem = newImages[dragDrop.draggedIndex];
      newImages.splice(dragDrop.draggedIndex, 1);
      newImages.splice(dropIndex, 0, draggedItem);
      
      dragDrop.handleDragEnd();
      handleImageReorder(newImages);
    },
  };

  // Handle legend change (local state update only, no DB save)
  const handleLegendChange = useCallback((imageId, field, value) => {
    // Update local state immediately for responsive UI
    imageManagement.updateImageLocal(imageId, (img) => ({
      ...img,
      legendaData: {
        ...(img.legendaData || {}),
        [field]: value
      }
    }));
  }, [imageManagement]);

  // Handle legend save
  const handleLegendSave = useCallback(async (image) => {
    try {
      await saveLegend(image.url, image.legendaData);
      
      setSuccess('Legenda salva com sucesso!');
      
      // Refresh in background (without showing loading) to ensure sync with database
      imageManagement.refresh(false).catch(err => {
        console.warn('Erro ao atualizar lista de imagens (não crítico):', err);
      });
      
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (err) {
      console.error('Erro ao salvar legenda:', err);
      setError(err.message || 'Erro ao salvar legenda');
    }
  }, [saveLegend, imageManagement, onImagesUpdate]);


  // Get current image for replace modal
  const currentReplaceImage = imageReplace.replacingImageId
    ? imageManagement.images.find(img => img.id === imageReplace.replacingImageId)
    : null;

  if (imageManagement.loading) {
    return (
      <div className="p-6 bg-gray-800/30 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <span className="ml-2 text-gray-400">Carregando imagens...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ImageUploadSection">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-100">Imagens da Escola</h3>
        </div>
        <div className="text-sm text-gray-400">
          {imageManagement.images.length} imagens
        </div>
      </div>

      {/* Messages */}
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

      {/* Upload Area */}
      <div className="space-y-4">
        <UploadArea
          onFilesSelected={handleFileSelect}
          onDrop={handleFileDrop}
          disabled={imageUpload.uploading}
        />

        <UploadProgress
          progress={imageUpload.progress}
          uploading={imageUpload.uploading}
        />

        <SelectedFilesPreview
          files={selectedFiles}
          onRemove={removeSelectedFile}
          onUpload={handleUpload}
          uploading={imageUpload.uploading}
        />
      </div>

      {/* Existing Images */}
      {imageManagement.images.length > 0 && (
        <ImagesGrid
          images={imageManagement.images}
          onImageReorder={handleImageReorder}
          dragHandlers={dragDropHandlers}
          escolaId={escolaId}
          headerImage={headerImage}
          drawingsImage={drawingsImage}
          onDelete={handleDeleteImage}
          onReplace={(imageId) => imageReplace.startReplace(imageId)}
          onLegendSave={handleLegendSave}
          onLegendChange={handleLegendChange}
        />
      )}

      {/* Replace Image Modal */}
      {currentReplaceImage && (
        <ReplaceImageModal
          isOpen={!!imageReplace.replacingImageId}
          currentImage={currentReplaceImage}
          onClose={imageReplace.cancelReplace}
          onReplace={async (file) => {
            imageReplace.selectReplacementFile(file);
            await handleReplaceImage(file);
          }}
          uploading={imageReplace.uploading}
        />
      )}

      {/* Empty State */}
      {imageManagement.images.length === 0 && !imageUpload.uploading && (
        <EmptyState />
      )}
    </div>
  );
};

ImageUploadSection.propTypes = {
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onImagesUpdate: PropTypes.func,
};

export default ImageUploadSection;

