import React from 'react';
import { useEscolas } from './hooks/useEscolas';

const AdminToolbar = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedType, 
  setSelectedType, 
  onNovaEscola 
}) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow mb-6 border border-gray-800">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de busca */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Ícone de busca */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className="relative">
          <select
            className="pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="indigena">Indígena</option>
            <option value="urbana">Urbana</option>
            <option value="rural">Rural</option>
          </select>
          {/* Ícone de filtro */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
        </div>

        {/* Botão Nova Escola */}
        <button
          onClick={onNovaEscola}
          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          + Nova Escola
        </button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Total de escolas: <span className="font-semibold text-green-400">0</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Escolas indígenas: <span className="font-semibold text-blue-400">0</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Em edição: <span className="font-semibold text-yellow-400">0</span></span>
        </div>
      </div>
    </div>
  );
};

export default AdminToolbar; 