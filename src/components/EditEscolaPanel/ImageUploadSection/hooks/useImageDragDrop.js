import { useState, useCallback } from 'react';

/**
 * Hook for managing drag & drop reordering of images
 * @param {Function} onReorder - Callback when images are reordered (newOrder: Image[]) => void
 * @returns {Object} Drag & drop handlers and state
 */
export const useImageDragDrop = (onReorder) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e, dropIndex, images) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    
    // Remove item from original position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedItem);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    // Call callback with new order
    if (onReorder) {
      onReorder(newImages);
    }
  }, [draggedIndex, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};

