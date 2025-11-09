import React, { useState, useEffect, useRef } from 'react';
import { Info, X, History, Trash2 } from 'lucide-react';
import { VersionamentoService } from '../../../services/versionamentoService';
import { getMetadataMemory, saveMetadataMemory, clearMetadataMemory } from '../../../services/metadataMemoryService';
import logger from '../../../utils/logger';

const MetadadosModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  escolaId,
  escolaNome,
  camposAlterados = []
}) => {
  const [fontes, setFontes] = useState([]);
  const [loadingFontes, setLoadingFontes] = useState(true);
  const [autor, setAutor] = useState(null);
  const [formData, setFormData] = useState({
    fonte_id: '',
    observacoes: ''
  });
  const [saving, setSaving] = useState(false);
  const [loadedFromMemory, setLoadedFromMemory] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const textareaRef = useRef(null);

  // Carregar fontes e autor ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const carregarDados = async () => {
        // Carregar fontes
        setLoadingFontes(true);
        const fontesResult = await VersionamentoService.buscarFontesDados();
        if (fontesResult.success) {
          setFontes(fontesResult.data);
        }
        setLoadingFontes(false);

        // Carregar autor
        const autorAtual = await VersionamentoService.obterAutorAtual();
        setAutor(autorAtual);

        // Carregar memória de metadados
        const memory = getMetadataMemory();
        if (memory) {
          setHasMemory(true);
          const memoryData = {
            fonte_id: memory.fonte_id || '',
            observacoes: memory.observacoes || ''
          };
          
          // Só carregar se houver valores salvos
          if (memoryData.fonte_id || memoryData.observacoes) {
            setFormData(memoryData);
            setLoadedFromMemory(true);
          }
        } else {
          setHasMemory(false);
          setLoadedFromMemory(false);
        }
      };

      carregarDados();
    } else {
      // Resetar formulário quando fechar (mas manter loadedFromMemory para próxima abertura)
      setFormData({ fonte_id: '', observacoes: '' });
      setLoadedFromMemory(false);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Registrar uma versão para CADA campo alterado
      const resultados = [];
      
      for (const campoAlterado of camposAlterados) {
        const result = await VersionamentoService.registrarVersaoDados({
          nomeTabela: 'escolas_completa',
          chaveLinha: escolaId.toString(),
          nomeCampo: campoAlterado.campo, // Campo específico alterado
          fonteId: formData.fonte_id || null,
          autor: autor,
          observacoes: formData.observacoes.trim() || null
        });
        
        resultados.push(result);
      }

      // Verificar se todos foram salvos com sucesso
      const todosSucesso = resultados.every(r => r.success);
      
      if (todosSucesso) {
        // Salvar valores na memória para uso futuro
        if (formData.fonte_id || formData.observacoes.trim()) {
          saveMetadataMemory({
            fonte_id: formData.fonte_id || null,
            observacoes: formData.observacoes.trim() || null
          });
        }
        
        // Chamar callback de sucesso
        if (onSave) {
          onSave(resultados);
        }
        onClose();
      } else {
        const erros = resultados.filter(r => !r.success).map(r => r.error);
        logger.error('Erro ao salvar alguns metadados:', erros);
        alert('Alguns metadados não puderam ser salvos. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      logger.error('Erro ao salvar metadados:', error);
      alert('Erro ao salvar metadados: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearMemory = () => {
    if (window.confirm('Deseja limpar a memória de metadados? Os valores salvos anteriormente não serão mais carregados automaticamente.')) {
      clearMetadataMemory();
      setHasMemory(false);
      setLoadedFromMemory(false);
      setFormData({ fonte_id: '', observacoes: '' });
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.observacoes]);

  const handleSaveWithoutMetadata = async () => {
    setSaving(true);
    try {
      const resultados = [];
      
      for (const campoAlterado of camposAlterados) {
        const result = await VersionamentoService.registrarVersaoDados({
          nomeTabela: 'escolas_completa',
          chaveLinha: escolaId.toString(),
          nomeCampo: campoAlterado.campo,
          fonteId: null,
          autor: autor,
          observacoes: null
        });
        
        resultados.push(result);
      }

      const todosSucesso = resultados.every(r => r.success);
      
      if (todosSucesso) {
        if (onSave) {
          onSave(resultados);
        }
        onClose();
      } else {
        const erros = resultados.filter(r => !r.success).map(r => r.error);
        logger.error('Erro ao salvar alguns metadados:', erros);
        alert('Alguns metadados não puderam ser salvos. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      logger.error('Erro ao salvar metadados:', error);
      alert('Erro ao salvar metadados: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && handleSaveWithoutMetadata()}
    >
      <div 
        className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 w-full max-w-lg transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-100">
              Registrar metadados da alteração
            </h2>
          </div>
          <button
            onClick={handleSaveWithoutMetadata}
            disabled={saving}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {/* Texto explicativo compacto */}
          <div className="mb-3">
            <p className="text-sm text-gray-300">
              Metadados ajudam a registrar a origem e o contexto da alteração. Se preferir, você pode salvar sem preencher.{' '}
              <button
                onClick={() => setShowFullExplanation(!showFullExplanation)}
                className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
              >
                Saiba mais
                <svg 
                  className={`w-3 h-3 transition-transform ${showFullExplanation ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </p>
            {showFullExplanation && (
              <div className="mt-2 p-3 bg-blue-900/20 border border-blue-700/30 rounded-md">
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  Metadados são informações que descrevem a origem e o contexto dos dados que você está inserindo ou modificando.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Eles ajudam a manter o site mais rigoroso, confiável e útil para quem for estudá-lo no futuro.
                </p>
              </div>
            )}
          </div>

          {/* Lista de campos alterados */}
          {camposAlterados.length > 0 && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Campos alterados:
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-800/50 rounded-md p-2 bg-gray-800/30 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {camposAlterados.map((campo, index) => (
                  <div key={index} className="text-xs text-gray-300">
                    <span className="font-medium">{campo.label || campo.campo}:</span>{' '}
                    <span className="text-gray-400">{String(campo.valorNovo).substring(0, 60)}
                      {String(campo.valorNovo).length > 60 && '...'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indicador de memória carregada */}
          {loadedFromMemory && (
            <div className="mb-3 p-2 bg-green-900/30 border border-green-700/50 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-300">
                  Valores carregados da memória anterior
                </span>
              </div>
              {hasMemory && (
                <button
                  onClick={handleClearMemory}
                  className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-800/50 transition-colors"
                  title="Limpar memória"
                >
                  <Trash2 className="w-3 h-3" />
                  Limpar
                </button>
              )}
            </div>
          )}

          {/* Fonte dos dados */}
          <div className="mb-3">
            <label htmlFor="fonte_id" className="block text-sm font-medium text-gray-300 mb-1">
              Fonte dos dados
            </label>
            <select
              id="fonte_id"
              value={formData.fonte_id}
              onChange={(e) => {
                handleChange('fonte_id', e.target.value);
                setLoadedFromMemory(false);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800/50 text-gray-200"
              disabled={saving}
            >
              <option value="" className="bg-gray-800 text-gray-200">Selecione a fonte dos dados</option>
              {loadingFontes ? (
                <option disabled className="bg-gray-800 text-gray-200">Carregando fontes...</option>
              ) : (
                fontes.map((fonte) => (
                  <option key={fonte.id} value={fonte.id} className="bg-gray-800 text-gray-200">
                    {fonte.nome} {fonte.descricao ? `- ${fonte.descricao}` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Observações */}
          <div className="mb-3">
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300 mb-1">
              Observações
            </label>
            <textarea
              ref={textareaRef}
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 1000) {
                  handleChange('observacoes', value);
                  setLoadedFromMemory(false);
                }
              }}
              rows={2}
              maxLength={1000}
              placeholder="Adicione observações sobre esta alteração..."
              className="w-full px-3 py-2 text-sm border border-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-800/50 text-gray-200 placeholder-gray-500 overflow-hidden"
              disabled={saving}
              style={{ minHeight: '2.5rem' }}
            />
            <div className="mt-1">
              <span className="text-xs text-gray-400">
                {formData.observacoes.length}/1000 caracteres
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-800/50 bg-gray-800/30 rounded-b-2xl">
          <button
            onClick={handleSaveWithoutMetadata}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-md hover:bg-gray-800 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar sem metadados
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              'Salvar e registrar metadados'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetadadosModal;

