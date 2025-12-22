import React from 'react';

const PovosLinguasTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Povos Indígenas */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Povos Indígenas
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Povos indigenas'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Povos indigenas': e.target.value })}
          placeholder="Descreva os povos indígenas atendidos pela escola..."
        />
        <p className="text-xs text-gray-400 mt-1">
          Ex: Guarani, Kaingang, Terena, etc.
        </p>
      </div>


    </div>
  );
};

export default PovosLinguasTab; 