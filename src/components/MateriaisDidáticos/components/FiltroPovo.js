import React from 'react';
import { usePovosIndigenas } from '../../../hooks/usePovosIndigenas';

const FiltroPovo = ({ povoSelecionado, onPovoChange }) => {
  const { povos, loading } = usePovosIndigenas();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="filtro-povo">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Povo Indígena
      </label>
      <select
        value={povoSelecionado}
        onChange={(e) => onPovoChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
      >
        <option value="todos">Todos os Povos</option>
        {povos.map(povo => (
          <option key={povo.id} value={povo.id}>
            {povo.label} ({povo.escolas.length} escolas)
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltroPovo;
