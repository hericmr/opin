import React from 'react';

const ProjetosParceriasTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Projetos em Andamento */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Projetos em Andamento
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Projetos em andamento'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Projetos em andamento': e.target.value })}
          placeholder="Descreva os projetos em andamento na escola..."
        />
      </div>

      {/* Parcerias com Universidades */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Parcerias com Universidades
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Parcerias com universidades?'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Parcerias com universidades?': e.target.value })}
          placeholder="Descreva as parcerias com universidades..."
        />
      </div>

      {/* Ações com ONGs ou Coletivos */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Ações com ONGs ou Coletivos
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Ações com ONGs ou coletivos?'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Ações com ONGs ou coletivos?': e.target.value })}
          placeholder="Descreva as ações com ONGs ou coletivos..."
        />
      </div>

      {/* Desejos da Comunidade */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Desejos da Comunidade
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Desejos da comunidade para a escola'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Desejos da comunidade para a escola': e.target.value })}
          placeholder="Descreva os desejos da comunidade para a escola..."
        />
      </div>
    </div>
  );
};

export default ProjetosParceriasTab; 