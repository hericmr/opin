import React from 'react';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const GestaoProfessoresTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="gestaoProfessores"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Equipe"
      />
      
      {/* Gestão/Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Gestão/Nome
        </label>
        <input
          type="text"
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 min-h-[44px] text-base"
          value={editingLocation['Gestão/Nome'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Gestão/Nome': e.target.value })}
          placeholder="Digite o nome do gestor/diretor"
        />
      </div>

      {/* Professores Indígenas */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Professores Indígenas
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Quantidade de professores indígenas'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Quantidade de professores indígenas': e.target.value })}
          placeholder="Descreva os professores indígenas..."
        />
      </div>

      {/* Professores Não Indígenas */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Professores Não Indígenas
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Quantidade de professores não indígenas'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Quantidade de professores não indígenas': e.target.value })}
          placeholder="Descreva os professores não indígenas..."
        />
      </div>

      {/* Professores Falam Língua Indígena? */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Professores Falam Língua Indígena?
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-24 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Professores falam a língua indígena?'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Professores falam a língua indígena?': e.target.value })}
          placeholder="Descreva se os professores falam a língua indígena..."
        />
      </div>

      {/* Formação dos Professores */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Formação dos Professores
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Formação dos professores'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Formação dos professores': e.target.value })}
          placeholder="Descreva a formação dos professores..."
        />
      </div>

      {/* Formação Continuada */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Formação Continuada
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base"
          value={editingLocation['Formação continuada oferecida'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Formação continuada oferecida': e.target.value })}
          placeholder="Descreva a formação continuada oferecida aos professores..."
        />
      </div>
    </div>
  );
};

export default GestaoProfessoresTab; 