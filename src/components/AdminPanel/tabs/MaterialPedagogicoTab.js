import React from 'react';

const MaterialPedagogicoTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* PPP elaborado com a comunidade? */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          PPP elaborado com a comunidade?
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['PPP elaborado com a comunidade?'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'PPP elaborado com a comunidade?': e.target.value })}
          placeholder="Descreva se o PPP foi elaborado com a comunidade..."
        />
      </div>
    </div>
  );
};

export default MaterialPedagogicoTab; 