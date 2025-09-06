import React from 'react';
import { TURMAS } from '../../../constants/materiaisConstants';

const FiltroTurma = ({ turmaSelecionada, onTurmaChange }) => {
  return (
    <div className="filtro-turma">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Turma
      </label>
      <select
        value={turmaSelecionada}
        onChange={(e) => onTurmaChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
      >
        {Object.entries(TURMAS).map(([key, value]) => (
          <option key={key} value={key}>
            {value.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltroTurma;




