import React, { useState, useEffect } from 'react';
import { Info, AlertCircle, CheckCircle, X } from 'lucide-react';
import { VersionamentoService } from '../../../services/versionamentoService';

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
      };

      carregarDados();
    } else {
      // Resetar formulário quando fechar
      setFormData({ fonte_id: '', observacoes: '' });
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
        // Chamar callback de sucesso
        if (onSave) {
          onSave(resultados);
        }
        onClose();
      } else {
        const erros = resultados.filter(r => !r.success).map(r => r.error);
        console.error('Erro ao salvar alguns metadados:', erros);
        alert('Alguns metadados não puderam ser salvos. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      console.error('Erro ao salvar metadados:', error);
      alert('Erro ao salvar metadados: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Registrar versão mínima (sem metadados) para cada campo alterado
    camposAlterados.forEach(campoAlterado => {
      VersionamentoService.registrarVersaoDados({
        nomeTabela: 'escolas_completa',
        chaveLinha: escolaId.toString(),
        nomeCampo: campoAlterado.campo,
        fonteId: null,
        autor: autor,
        observacoes: null
      }).catch(err => {
        console.warn(`Erro ao registrar versão mínima para campo ${campoAlterado.campo}:`, err);
      });
    });
    
    onClose();
  };

  if (!isOpen) return null;

  const hasData = formData.fonte_id || formData.observacoes.trim();

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && handleSkip()}
    >
      <div 
        className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 w-full max-w-lg transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100">
                Metadados da Alteração
              </h2>
              <p className="text-sm text-gray-400">
                {escolaNome ? `Escola: ${escolaNome}` : 'Registre informações sobre esta alteração'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <p className="text-sm text-gray-200 mb-2">
              <strong>Deseja registrar metadados sobre esta alteração?</strong>
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Metadados são informações que descrevem a origem e o contexto dos dados que você está inserindo ou modificando.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed mt-2">
              Eles ajudam a manter o site mais rigoroso, confiável e útil para quem for estudá-lo no futuro.
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">
              Se quiser, você pode deixar essa informação agora — mas não é obrigatório.
            </p>
          </div>

          {/* Lista de campos alterados */}
          {camposAlterados.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campos alterados ({camposAlterados.length}):
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-800/50 rounded-md p-3 bg-gray-800/30 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                {camposAlterados.map((campo, index) => (
                  <div key={index} className="text-xs bg-gray-800/50 p-2 rounded border border-gray-700/50">
                    <div className="font-medium text-gray-200">
                      {campo.label || campo.campo}
                    </div>
                    {campo.valorAntigo && (
                      <div className="text-gray-500 mt-1">
                        <span className="line-through">Antigo: {String(campo.valorAntigo).substring(0, 50)}</span>
                      </div>
                    )}
                    <div className="text-gray-300 mt-1">
                      <span className="font-medium">Novo:</span> {String(campo.valorNovo).substring(0, 50)}
                      {String(campo.valorNovo).length > 50 && '...'}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Os metadados abaixo serão aplicados a todos os campos alterados listados acima.
              </p>
            </div>
          )}

          {/* Fonte dos dados */}
          <div className="mb-4">
            <label htmlFor="fonte_id" className="block text-sm font-medium text-gray-300 mb-1">
              Fonte dos dados <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <select
              id="fonte_id"
              value={formData.fonte_id}
              onChange={(e) => handleChange('fonte_id', e.target.value)}
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
          <div className="mb-4">
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300 mb-1">
              Observações <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 1000) {
                  handleChange('observacoes', value);
                }
              }}
              rows={4}
              maxLength={1000}
              placeholder="Adicione observações sobre esta alteração..."
              className="w-full px-3 py-2 text-sm border border-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-800/50 text-gray-200 placeholder-gray-500"
              disabled={saving}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">
                {formData.observacoes.length}/1000 caracteres
              </span>
              {!hasData && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Preencher metadados é recomendado</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800/50 bg-gray-800/30 rounded-b-2xl">
          <button
            onClick={handleSkip}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700/50 rounded-md hover:bg-gray-800 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pular
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                'Salvar Metadados'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadadosModal;

