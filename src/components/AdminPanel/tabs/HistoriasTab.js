import React from 'react';
import RichTextEditor from './RichTextEditor';

const HistoriasTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
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