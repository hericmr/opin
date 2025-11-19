import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const HistoriasTab = ({ editingLocation, setEditingLocation }) => {
  // Estado local para gerenciar o valor do editor e forçar remount quando necessário
  const [historiaValue, setHistoriaValue] = useState(editingLocation['historia_da_escola'] || '');
  const [editorKey, setEditorKey] = useState(editingLocation?.id || 'new');

  // Sincronizar o valor quando editingLocation mudar (ex: ao trocar de escola)
  useEffect(() => {
    const newValue = editingLocation['historia_da_escola'] || '';
    // Só atualizar se o valor realmente mudou (evita loops infinitos)
    if (newValue !== historiaValue) {
      setHistoriaValue(newValue);
      // Forçar remount do editor quando trocar de escola ou quando o valor mudar externamente
      setEditorKey(editingLocation?.id ? `historia-${editingLocation.id}` : `new-${Date.now()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLocation?.id, editingLocation['historia_da_escola']]);

  // Handler para atualizar o valor local e propagar para o estado pai
  const handleChange = (value) => {
    setHistoriaValue(value);
    setEditingLocation({ ...editingLocation, 'historia_da_escola': value });
  };

  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="historiaEscola"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: História da Escola"
      />
      
      {/* História da Escola */}
      <RichTextEditor
        key={editorKey}
        label="História da Escola"
        value={historiaValue}
        onChange={handleChange}
        placeholder="Digite a história da escola..."
      />
    </div>
  );
};

export default HistoriasTab; 