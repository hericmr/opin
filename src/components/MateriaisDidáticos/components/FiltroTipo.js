import React from 'react';
import { TIPOS_MATERIAL } from '../../../constants/materiaisConstants';

const FiltroTipo = ({ tipoSelecionado, onTipoChange }) => {
  return (
    <div className="filtro-tipo">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Material
      </label>
      <select
        value={tipoSelecionado}
        onChange={(e) => onTipoChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
      >
        <option value="todos">Todos os Tipos</option>
        {Object.entries(TIPOS_MATERIAL).map(([key, value]) => (
          <option key={key} value={key}>
            {value.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltroTipo;



