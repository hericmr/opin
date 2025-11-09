import React from 'react';
import RichTextEditor from './RichTextEditor';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const HistoriasTab = ({ editingLocation, setEditingLocation }) => {
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
        label="História da Escola"
        value={editingLocation['historia_da_escola'] || ''}
        onChange={(value) => setEditingLocation({ ...editingLocation, 'historia_da_escola': value })}
        placeholder="Digite a história da escola..."
      />
    </div>
  );
};

export default HistoriasTab; 