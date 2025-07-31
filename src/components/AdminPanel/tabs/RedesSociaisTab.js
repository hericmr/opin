import React from 'react';

const RedesSociaisTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Escola utiliza redes sociais? */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Escola utiliza redes sociais?
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Escola utiliza redes sociais?'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Escola utiliza redes sociais?': e.target.value })}
          placeholder="Descreva se a escola utiliza redes sociais..."
        />
      </div>

      {/* Links das Redes Sociais */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Links das Redes Sociais
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Links das redes sociais'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Links das redes sociais': e.target.value })}
          placeholder="Cole aqui os links das redes sociais da escola (Facebook, Instagram, YouTube, etc.)..."
        />
      </div>
    </div>
  );
};

export default RedesSociaisTab; 