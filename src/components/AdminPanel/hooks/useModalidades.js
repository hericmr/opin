import { useState, useCallback } from 'react';
import { MODALIDADES_OPTIONS } from '../utils/modalidadesOptions';

export const useModalidades = () => {
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [outroModalidade, setOutroModalidade] = useState('');

  // Função para alternar seleção de modalidade
  const handleModalidadeChange = useCallback((modalidade) => {
    setSelectedModalidades(prev => {
      if (prev.includes(modalidade)) {
        return prev.filter(m => m !== modalidade);
      } else {
        return [...prev, modalidade];
      }
    });
  }, []);

  // Função para gerenciar campo "Outro (especificar)"
  const handleOutroModalidadeChange = useCallback((value) => {
    setOutroModalidade(value);
    
    setSelectedModalidades(prev => {
      const hasOutro = prev.some(m => m.startsWith('Outro:'));
      
      if (value.trim()) {
        if (hasOutro) {
          return prev.map(m => m.startsWith('Outro:') ? `Outro: ${value}` : m);
        } else {
          return [...prev, `Outro: ${value}`];
        }
      } else {
        return prev.filter(m => !m.startsWith('Outro:'));
      }
    });
  }, []);

  // Função para salvar modalidades no editingLocation
  const saveModalidades = useCallback(() => {
    const modalidadesText = selectedModalidades.join('; ');
    return modalidadesText;
  }, [selectedModalidades]);

  // Função para carregar modalidades existentes
  const loadExistingModalidades = useCallback((modalidadesText) => {
    if (!modalidadesText) {
      setSelectedModalidades([]);
      setOutroModalidade('');
      return;
    }

    const parts = modalidadesText.split(';').map(part => part.trim());
    const modalidades = [];
    let outro = '';

    parts.forEach(part => {
      if (part.startsWith('Outro:')) {
        outro = part.replace('Outro:', '').trim();
        modalidades.push(part);
      } else if (MODALIDADES_OPTIONS.includes(part)) {
        modalidades.push(part);
      } else if (part) {
        // Se não está na lista padrão, tratar como "outro"
        outro = part;
        modalidades.push(`Outro: ${part}`);
      }
    });

    setSelectedModalidades(modalidades);
    setOutroModalidade(outro);
  }, []);

  // Função para limpar modalidades
  const clearModalidades = useCallback(() => {
    setSelectedModalidades([]);
    setOutroModalidade('');
  }, []);

  // Função para obter preview do texto final
  const getModalidadesPreview = useCallback(() => {
    return selectedModalidades.join('; ') || 'Nenhuma modalidade selecionada';
  }, [selectedModalidades]);

  // Função para verificar se há modalidades selecionadas
  const hasSelectedModalidades = useCallback(() => {
    return selectedModalidades.length > 0;
  }, [selectedModalidades]);

  return {
    // Estado
    selectedModalidades,
    outroModalidade,
    
    // Ações
    handleModalidadeChange,
    handleOutroModalidadeChange,
    saveModalidades,
    loadExistingModalidades,
    clearModalidades,
    
    // Utilitários
    getModalidadesPreview,
    hasSelectedModalidades,
  };
}; 