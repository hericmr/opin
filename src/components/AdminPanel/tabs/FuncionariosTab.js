import React from 'react';
import CardVisibilityToggle from '../components/CardVisibilityToggle';

const FuncionariosTab = ({ editingLocation, setEditingLocation }) => {
  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="gestaoProfessores"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Equipe"
      />
      
      {/* Outros Funcionários */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          Outros Funcionários
        </label>
        <textarea
          className="w-full border border-gray-700 bg-gray-800 rounded px-3 py-2 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-gray-100 placeholder-gray-400 text-base resize-y"
          rows={6}
          value={editingLocation['Outros funcionários'] || ''}
          onChange={e => setEditingLocation({ ...editingLocation, 'Outros funcionários': e.target.value })}
          placeholder="Descreva os outros funcionários da escola (ex: secretários, auxiliares, merendeiras, etc.)..."
        />
        <p className="mt-1 text-xs text-gray-400">
          Você pode editar o texto completo diretamente aqui. Use Enter para quebras de linha.
        </p>
      </div>
    </div>
  );
};

export default FuncionariosTab;

