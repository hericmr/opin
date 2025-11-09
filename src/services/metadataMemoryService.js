/**
 * Service to manage metadata memory (last used values)
 * Stores metadata values in localStorage so administrators don't have to
 * re-enter the same metadata repeatedly when adding multiple data entries.
 */

import logger from '../utils/logger';

const STORAGE_KEY = 'opin:metadataMemory';

/**
 * Get the last used metadata values
 * @returns {Object} Object with fonte_id and observacoes, or null if no memory exists
 */
export const getMetadataMemory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    logger.warn('Error reading metadata memory:', error);
  }
  return null;
};

/**
 * Save metadata values to memory
 * @param {Object} metadata - Object with fonte_id and/or observacoes
 */
export const saveMetadataMemory = (metadata) => {
  try {
    const currentMemory = getMetadataMemory() || {};
    const newMemory = {
      ...currentMemory
    };
    
    // Only update fields that have non-null values
    if (metadata.fonte_id !== null && metadata.fonte_id !== undefined) {
      newMemory.fonte_id = metadata.fonte_id || null;
    }
    if (metadata.observacoes !== null && metadata.observacoes !== undefined) {
      newMemory.observacoes = metadata.observacoes || null;
    }
    
    // Only save if there's at least one non-empty value
    if (newMemory.fonte_id || newMemory.observacoes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMemory));
    } else {
      // If all values are empty, clear memory
      clearMetadataMemory();
    }
  } catch (error) {
    logger.warn('Error saving metadata memory:', error);
  }
};

/**
 * Clear all metadata memory
 */
export const clearMetadataMemory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logger.warn('Error clearing metadata memory:', error);
  }
};

/**
 * Get a specific field from memory
 * @param {string} field - Field name ('fonte_id' or 'observacoes')
 * @returns {string|null} The stored value or null
 */
export const getMetadataField = (field) => {
  const memory = getMetadataMemory();
  return memory?.[field] || null;
};

