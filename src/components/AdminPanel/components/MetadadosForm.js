import React, { useState, useEffect } from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { VersionamentoService } from '../../../services/versionamentoService';
import { AuthService } from '../../../services/authService';

const MetadadosForm = ({ 
  onMetadadosChange, 
  initialMetadados = null,
  className = '' 
}) => {
  const [fontes, setFontes] = useState([]);
  const [loadingFontes, setLoadingFontes] = useState(true);
  const [autor, setAutor] = useState(null);
  const [formData, setFormData] = useState({
    fonte_id: initialMetadados?.fonte_id || '',
    observacoes: initialMetadados?.observacoes || ''
  });

  // Carregar fontes e autor ao montar
  useEffect(() => {
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
      
      // Se não houver autor inicial, usar o autor atual
      if (!initialMetadados?.autor && autorAtual) {
        onMetadadosChange({
          ...formData,
          autor: autorAtual
        });
      }
    };

    carregarDados();
  }, []);

  // Notificar mudanças nos metadados
  useEffect(() => {
    onMetadadosChange({
      ...formData,
      autor: autor
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, autor]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasData = formData.fonte_id || formData.observacoes;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-800">
          Metadados (Opcional)
        </h3>
      </div>
      
      <p className="text-xs text-gray-600 mb-4">
        Preencher os metadados ajuda a manter um histórico completo das alterações e identificar a origem dos dados.
      </p>

      {/* Autor (readonly) */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Autor
        </label>
        <div className="text-sm text-gray-600 bg-white border border-gray-200 rounded px-3 py-2">
          {autor ? (
            <span>Você está logado como: <strong>{autor}</strong></span>
          ) : (
            <span className="text-gray-400">Não identificado</span>
          )}
        </div>
      </div>

      {/* Fonte dos dados */}
      <div className="mb-4">
        <label htmlFor="fonte_id" className="block text-xs font-medium text-gray-700 mb-1">
          Fonte dos dados
        </label>
        <select
          id="fonte_id"
          value={formData.fonte_id}
          onChange={(e) => handleChange('fonte_id', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Selecione a fonte dos dados (opcional)</option>
          {loadingFontes ? (
            <option disabled>Carregando fontes...</option>
          ) : (
            fontes.map((fonte) => (
              <option key={fonte.id} value={fonte.id}>
                {fonte.nome} {fonte.descricao ? `- ${fonte.descricao}` : ''}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Observações */}
      <div className="mb-2">
        <label htmlFor="observacoes" className="block text-xs font-medium text-gray-700 mb-1">
          Observações
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
          rows={3}
          maxLength={1000}
          placeholder="Adicione observações sobre esta alteração (opcional)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {formData.observacoes.length}/1000 caracteres
          </span>
          {!hasData && (
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle className="w-3 h-3" />
              <span>Preencher metadados é recomendado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetadadosForm;

