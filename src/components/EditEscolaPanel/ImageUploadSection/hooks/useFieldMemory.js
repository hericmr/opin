import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'opin_legend_field_memory';
const MAX_SUGGESTIONS = 10;

/**
 * Hook to manage field memory/autocomplete for legend fields
 * Stores previous values in localStorage and provides suggestions
 */
export const useFieldMemory = () => {
  const [memory, setMemory] = useState({
    legenda: [],
    autor_foto: [],
    data_foto: [],
    descricao_detalhada: [],
    categoria: []
  });

  // Load memory from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMemory(parsed);
      }
    } catch (err) {
      console.warn('[useFieldMemory] Error loading memory:', err);
    }
  }, []);

  // Save a value to memory for a specific field
  const saveToMemory = useCallback((field, value) => {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return;
    }

    const trimmedValue = value.trim();
    
    setMemory(prev => {
      const fieldMemory = prev[field] || [];
      
      // Remove if already exists (to avoid duplicates)
      const filtered = fieldMemory.filter(v => v.toLowerCase() !== trimmedValue.toLowerCase());
      
      // Add to beginning and limit to MAX_SUGGESTIONS
      const updated = [trimmedValue, ...filtered].slice(0, MAX_SUGGESTIONS);
      
      const newMemory = {
        ...prev,
        [field]: updated
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMemory));
      } catch (err) {
        console.warn('[useFieldMemory] Error saving memory:', err);
      }

      return newMemory;
    });
  }, []);

  // Get suggestions for a field based on input
  const getSuggestions = useCallback((field, input = '') => {
    const fieldMemory = memory[field] || [];
    
    if (!input || input.trim() === '') {
      return fieldMemory.slice(0, 5); // Return top 5 if no input
    }

    const lowerInput = input.toLowerCase();
    return fieldMemory
      .filter(value => value.toLowerCase().includes(lowerInput))
      .slice(0, 5); // Max 5 suggestions
  }, [memory]);

  // Clear memory for a specific field or all fields
  const clearMemory = useCallback((field = null) => {
    if (field) {
      setMemory(prev => {
        const newMemory = {
          ...prev,
          [field]: []
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newMemory));
        } catch (err) {
          console.warn('[useFieldMemory] Error clearing memory:', err);
        }
        return newMemory;
      });
    } else {
      // Clear all
      const emptyMemory = {
        legenda: [],
        autor_foto: [],
        data_foto: [],
        descricao_detalhada: [],
        categoria: []
      };
      setMemory(emptyMemory);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyMemory));
      } catch (err) {
        console.warn('[useFieldMemory] Error clearing all memory:', err);
      }
    }
  }, []);

  return {
    memory,
    saveToMemory,
    getSuggestions,
    clearMemory
  };
};




