import React from 'react';
import { Plus, School, Search, X } from 'lucide-react';

const AdminSidebar = ({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  topOffset,
  editingLocation,
  onEscolaSelect,
  onNovaEscola,
  searchTerm,
  setSearchTerm,
  filteredEscolas
}) => {
  if (isMobile && !sidebarOpen) return null;

  const fechar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-30"
          style={{ top: topOffset }}
          onClick={fechar}
        />
      )}

      <aside
        className={`flex flex-col bg-gray-900 border-r border-gray-800 ${
          isMobile ? 'fixed left-0 bottom-0 z-40 w-80 max-w-[85vw] shadow-2xl' : 'w-72 flex-shrink-0'
        }`}
        style={isMobile ? { top: topOffset } : undefined}
        aria-label="Lista de escolas"
      >
        {/* Cabeçalho */}
        <div className="p-4 space-y-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold text-gray-100">Escolas</h2>
              <span className="text-xs text-gray-500 tabular-nums">{filteredEscolas.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onNovaEscola();
                  fechar();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-300 rounded-md hover:bg-emerald-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova
              </button>
              {isMobile && (
                <button
                  type="button"
                  className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md"
                  onClick={fechar}
                  aria-label="Fechar lista de escolas"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar por nome ou município"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-950 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de escolas */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {filteredEscolas.length > 0 ? (
            <ul>
              {filteredEscolas.map(escola => {
                const ativa = editingLocation?.id === escola.id;
                return (
                  <li key={escola.id}>
                    <button
                      type="button"
                      aria-current={ativa ? 'true' : undefined}
                      className={`w-full text-left pl-4 pr-3 py-2 border-l-2 transition-colors focus:outline-none focus-visible:bg-gray-800 ${
                        ativa
                          ? 'border-emerald-400 bg-emerald-500/10'
                          : 'border-transparent hover:bg-gray-800/60'
                      }`}
                      onClick={() => {
                        onEscolaSelect(escola);
                        fechar();
                      }}
                    >
                      <span className={`block text-sm truncate ${ativa ? 'text-emerald-200 font-medium' : 'text-gray-200'}`}>
                        {escola.Escola}
                      </span>
                      {escola['Município'] && (
                        <span className="block text-xs text-gray-500 truncate">
                          {escola['Município']}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-10 text-center">
              {searchTerm ? (
                <Search className="w-6 h-6 text-gray-600 mx-auto mb-3" />
              ) : (
                <School className="w-6 h-6 text-gray-600 mx-auto mb-3" />
              )}
              <p className="text-sm text-gray-400">
                {searchTerm ? 'Nenhuma escola encontrada' : 'Nenhuma escola disponível'}
              </p>
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-1">Tente ajustar sua busca</p>
              )}
            </div>
          )}
        </nav>

        {/* Rodapé */}
        <div className="px-4 py-3 border-t border-gray-800">
          <p className="text-gray-600 text-xs text-center">
            Opin - desenvolvido por <a href="https://hericmr.github.io/me/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Heric mr</a>
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
