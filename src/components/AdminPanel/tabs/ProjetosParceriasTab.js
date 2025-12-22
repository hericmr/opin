import React from 'react';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const ProjetosParceriasTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="projetosParcerias"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Projetos e Parcerias"
      />

      {/* Outras Informações */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Outras Informações
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-64 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation.outras_informacoes || ''}
          onChange={e => setEditingLocation({ ...editingLocation, outras_informacoes: e.target.value })}
          placeholder="Descreva projetos, parcerias, ações com ONGs, desejos da comunidade e outras informações relevantes..."
        />
      </div>
    </div>
  );
};

export default ProjetosParceriasTab; 