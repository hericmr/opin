import React from 'react';
import { Menu } from 'lucide-react';
import { useEscolas } from './hooks/useEscolas';
import { UI_CONFIG } from './constants/adminConstants';

const AdminSidebar = ({ 
  isMobile, 
  sidebarOpen, 
  setSidebarOpen, 
  editingLocation, 
  onEscolaSelect 
}) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredEscolas 
  } = useEscolas();

  return (
    <>
      {/* Botão de menu para mobile */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-gray-900 rounded-full shadow-lg p-2 border border-gray-800"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-6 h-6 text-gray-200" />
        </button>
      )}

      {/* Menu lateral */}
      {(!isMobile || sidebarOpen) && (
        <aside
          className={`bg-gray-900 border-r border-gray-700 rounded-r-2xl shadow-lg p-4 overflow-y-auto h-screen sticky top-0 z-40 transition-transform duration-300 ${
            isMobile ? `fixed left-0 top-0 ${UI_CONFIG.SIDEBAR_WIDTH_MOBILE} shadow-2xl` : UI_CONFIG.SIDEBAR_WIDTH
          }`}
          style={{
            transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
            top: isMobile ? 0 : UI_CONFIG.SIDEBAR_TOP_OFFSET,
          }}
        >
          {/* Botão de fechar para mobile */}
          {isMobile && (
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu lateral"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Título */}
          <h2 className="text-xl font-bold tracking-wide text-green-400 uppercase mb-6 sticky top-0 bg-gray-900 pb-2">
            Escolas
          </h2>

          {/* Busca no menu lateral */}
          <div className="mb-4 sticky top-24 mt-8 bg-gray-900 pb-2">
            <input
              type="text"
              placeholder="Buscar escola..."
              className="w-full px-3 py-2 border border-gray-700 rounded text-sm bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Lista de escolas */}
          <ul className="space-y-1">
            {filteredEscolas.map(escola => (
              <li key={escola.id}>
                <button
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-green-800 text-sm text-gray-200 ${
                    editingLocation?.id === escola.id ? 'bg-green-700 font-bold text-white' : ''
                  }`}
                  onClick={() => {
                    onEscolaSelect(escola);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  {escola.Escola}
                </button>
              </li>
            ))}
          </ul>

          {/* Mensagem quando não há resultados */}
          {filteredEscolas.length === 0 && searchTerm && (
            <div className="text-gray-400 text-sm text-center py-4">
              Nenhuma escola encontrada
            </div>
          )}
        </aside>
      )}
    </>
  );
};

export default AdminSidebar; 