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
      
      {/* Acesso à Água */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Acesso à Água
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Acesso à água'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Acesso à água': e.target.value })}
          placeholder="Descreva como é o acesso à água na escola..."
        />
      </div>

      {/* Coleta de Lixo */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Coleta de Lixo
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Tem coleta de lixo?'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Tem coleta de lixo?': e.target.value })}
          placeholder="Descreva como é feita a coleta de lixo..."
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

      {/* Modo de Acesso à Escola */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Modo de Acesso à Escola
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Modo de acesso à escola'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Modo de acesso à escola': e.target.value })}
          placeholder="Descreva como é o acesso à escola..."
        />
      </div>

      {/* Merenda Diferenciada */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Merenda Diferenciada
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation.diferenciada || ''}
          onChange={e => setEditingLocation({ ...editingLocation, diferenciada: e.target.value })}
          placeholder="Descreva se há merenda diferenciada (cultural, religiosa, etc.)..."
        />
      </div>

      {/* Merenda Diferenciada (Detalhes) */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Merenda Diferenciada (Detalhes)
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation.merenda_diferenciada || ''}
          onChange={e => setEditingLocation({ ...editingLocation, merenda_diferenciada: e.target.value })}
          placeholder="Descreva detalhes sobre a merenda diferenciada..."
        />
      </div>
    </div>
  );
};

export default InfraestruturaTab; 