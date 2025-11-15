import { useState, useCallback } from 'react';
import { identificarCamposAlterados } from '../../../utils/campoComparator';
import logger from '../../../utils/logger';

/**
 * Hook customizado para gerenciar a lógica de salvamento de escolas no AdminPanel
 * 
 * @param {Function} saveEscola - Função do hook useEscolas para salvar escola
 * @param {Object} editingLocation - Objeto com dados da escola sendo editada
 * @param {Function} setEditingLocation - Função para atualizar o estado de edição
 * @param {Function} setEscolaSalvaId - Função para definir ID da escola salva
 * @param {Function} setEscolaSalvaNome - Função para definir nome da escola salva
 * @param {Function} setCamposAlterados - Função para definir campos alterados
 * @param {Function} setShowMetadadosModal - Função para mostrar/ocultar modal de metadados
 * @param {Object} dadosOriginais - Dados originais da escola para comparação
 * @param {Function} setDadosOriginais - Função para atualizar dados originais
 * 
 * @returns {Object} Objeto com estados e função de salvamento
 */
export const useAdminSave = ({
  saveEscola,
  editingLocation,
  setEditingLocation,
  setEscolaSalvaId,
  setEscolaSalvaNome,
  setCamposAlterados,
  setShowMetadadosModal,
  dadosOriginais,
  setDadosOriginais
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /**
   * Função para salvar escola
   * Identifica campos alterados e prepara dados para o modal de metadados
   */
  const handleSaveEscola = useCallback(async () => {
    if (!editingLocation) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Identificar campos modificados
      let camposModificados = [];
      if (editingLocation.id && dadosOriginais) {
        // É uma atualização - comparar dados
        camposModificados = identificarCamposAlterados(dadosOriginais, editingLocation);
      } else {
        // É uma criação - todos os campos preenchidos são "alterados"
        camposModificados = Object.keys(editingLocation)
          .filter(key => {
            const camposIgnorar = ['id', 'created_at', 'updated_at', 'activeTab', 'imagem_header'];
            return !camposIgnorar.includes(key) && editingLocation[key];
          })
          .map(campo => ({
            campo,
            valorAntigo: '',
            valorNovo: editingLocation[campo],
            label: campo
          }));
      }

      // Salvar escola SEM metadados primeiro (metadados serão salvos depois no modal)
      const result = await saveEscola(editingLocation, null);
      
      if (result.success) {
        setSaveSuccess(true);
        // Atualizar o editingLocation com os dados salvos
        setEditingLocation(result.data);
        
        // Preparar dados para o modal de metadados
        setEscolaSalvaId(result.data.id);
        setEscolaSalvaNome(result.data.Escola || 'Escola');
        setCamposAlterados(camposModificados);
        
        // Mostrar modal de metadados apenas se houver campos alterados
        if (camposModificados.length > 0) {
          setShowMetadadosModal(true);
        }
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      logger.error('Erro ao salvar escola:', error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingLocation,
    dadosOriginais,
    saveEscola,
    setEditingLocation,
    setEscolaSalvaId,
    setEscolaSalvaNome,
    setCamposAlterados,
    setShowMetadadosModal
  ]);

  return {
    isSaving,
    saveError,
    saveSuccess,
    setSaveError,
    setSaveSuccess,
    handleSaveEscola
  };
};








