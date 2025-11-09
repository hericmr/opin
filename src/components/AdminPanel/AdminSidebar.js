import React from 'react';
import { Menu, Search, X } from 'lucide-react';
import { UI_CONFIG } from './constants/adminConstants';

const AdminSidebar = ({ 
  isMobile, 
  sidebarOpen, 
  setSidebarOpen, 
  editingLocation, 
  onEscolaSelect,
  searchTerm,
  setSearchTerm,
  filteredEscolas
}) => {

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Botão de menu para mobile */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg p-3 border border-gray-800/50 hover:bg-gray-800/90 transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-6 h-6 text-gray-200" />
        </button>
      )}

      {/* Menu lateral */}
      {(!isMobile || sidebarOpen) && (
        <aside
          className={`bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 rounded-r-2xl shadow-2xl p-6 overflow-y-auto h-screen sticky top-0 z-40 transition-all duration-300 ${
            isMobile ? `fixed left-0 top-0 w-80 max-w-[85vw] shadow-2xl` : 'w-80'
          }`}
          style={{
            transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
            top: isMobile ? 0 : UI_CONFIG.SIDEBAR_TOP_OFFSET,
          }}
        >
          {/* Header do sidebar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 uppercase">
                Escolas
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {filteredEscolas.length} escola{filteredEscolas.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Botão de fechar para mobile */}
            {isMobile && (
              <button
                className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg p-2 transition-colors"
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar menu lateral"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Busca no menu lateral */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar escola..."
                className="w-full pl-10 pr-4 py-3 border border-gray-700/50 rounded-xl text-sm bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de escolas */}
          <div className="space-y-2">
            {filteredEscolas.length > 0 ? (
              filteredEscolas.map(escola => (
                <button
                  key={escola.id}
                  className={`w-full text-left p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700/50 ${
                    editingLocation?.id === escola.id 
                      ? 'bg-gradient-to-r from-green-600/20 to-green-700/20 border-green-500/50 text-white shadow-lg' 
                      : 'text-gray-200 hover:text-white'
                  }`}
                  onClick={() => {
                    onEscolaSelect(escola);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${
                        editingLocation?.id === escola.id ? 'text-green-300' : 'text-gray-200'
                      }`}>
                        {escola.Escola}
                      </h3>
                      {escola['Município'] && (
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {escola['Município']}
                        </p>
                      )}
                    </div>
                    {editingLocation?.id === escola.id && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : searchTerm ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">
                  Nenhuma escola encontrada
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Tente ajustar sua busca
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">
                  Nenhuma escola disponível
                </p>
              </div>
            )}
          </div>

          {/* Footer do sidebar */}
          <div className="mt-auto pt-6 border-t border-gray-800/50">
            <div className="text-center">
              <p className="text-gray-500 text-xs">
                Opin - desenvolvido por <a href="https://hericmr.github.io/me/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Heric mr</a>
              </p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default AdminSidebar; 