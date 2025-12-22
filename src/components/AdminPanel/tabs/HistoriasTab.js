import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const HistoriasTab = ({ editingLocation, setEditingLocation }) => {
  // Estado local para gerenciar o valor do editor e forçar remount quando necessário
  const [historiaValue, setHistoriaValue] = useState(editingLocation['historia_da_escola'] || '');
  const [historiaTIValue, setHistoriaTIValue] = useState(editingLocation['historia_terra_indigena'] || '');

  const [editorKey, setEditorKey] = useState(editingLocation?.id || 'new');
  const [editorTIKey, setEditorTIKey] = useState(editingLocation?.id ? `ti-${editingLocation.id}` : `new-ti-${Date.now()}`);

  // Sincronizar o valor quando editingLocation mudar (ex: ao trocar de escola)
  useEffect(() => {
    // História da Escola
    const newValue = editingLocation['historia_da_escola'] || '';
    if (newValue !== historiaValue) {
      setHistoriaValue(newValue);
      setEditorKey(editingLocation?.id ? `historia-${editingLocation.id}` : `new-${Date.now()}`);
    }

    // História da Terra Indígena
    const newTIValue = editingLocation['historia_terra_indigena'] || '';
    if (newTIValue !== historiaTIValue) {
      setHistoriaTIValue(newTIValue);
      setEditorTIKey(editingLocation?.id ? `ti-${editingLocation.id}` : `new-ti-${Date.now()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLocation?.id, editingLocation['historia_da_escola'], editingLocation['historia_terra_indigena']]);

  // Handler para atualizar o valor local e propagar para o estado pai
  const handleChange = (value) => {
    setHistoriaValue(value);
    setEditingLocation({ ...editingLocation, 'historia_da_escola': value });
  };

  const handleChangeTI = (value) => {
    setHistoriaTIValue(value);
    setEditingLocation({ ...editingLocation, 'historia_terra_indigena': value });
  };

  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="historiaEscola"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Histórias"
      />

      {/* História da Terra Indígena */}
      <div className="border-b border-gray-700 pb-6 mb-6">
        <RichTextEditor
          key={editorTIKey}
          label="História da Terra Indígena"
          value={historiaTIValue}
          onChange={handleChangeTI}
          placeholder="Digite a história da terra indígena..."
        />
      </div>

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