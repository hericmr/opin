import React from 'react';
import { Search } from 'lucide-react';

const BuscaAvancada = ({ termoBusca, onTermoBuscaChange }) => {
  return (
    <div className="busca-avancada">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar Materiais
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por título, professor, conteúdo..."
          value={termoBusca}
          onChange={(e) => onTermoBuscaChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  );
};

export default BuscaAvancada;




