import React from 'react';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const InfraestruturaTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="infraestrutura"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Infraestrutura"
      />

      {/* Salas Vinculadas */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Salas Vinculadas
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation.salas_vinculadas || ''}
          onChange={e => setEditingLocation({ ...editingLocation, salas_vinculadas: e.target.value })}
          placeholder="Descreva as salas vinculadas à escola..."
        />
      </div>

      {/* Acesso à Internet */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Acesso à Internet
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Acesso à internet'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Acesso à internet': e.target.value })}
          placeholder="Descreva o acesso à internet na escola..."
        />
      </div>

      {/* Equipamentos Tecnológicos */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Equipamentos Tecnológicos
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Equipamentos Tecs'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Equipamentos Tecs': e.target.value })}
          placeholder="Descreva os equipamentos tecnológicos disponíveis..."
        />
      </div>


    </div>
  );
};

export default InfraestruturaTab; 