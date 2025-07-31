import React from 'react';
import RichTextEditor from './RichTextEditor';

const HistoriaProfessoresTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* História dos Professores */}
      <RichTextEditor
        label="História dos Professores"
        value={editingLocation['historia_do_prof'] || ''}
        onChange={(value) => setEditingLocation({ ...editingLocation, 'historia_do_prof': value })}
        placeholder="Digite a história dos professores..."
      />
    </div>
  );
};

export default HistoriaProfessoresTab; 