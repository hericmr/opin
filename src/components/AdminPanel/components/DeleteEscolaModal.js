import React from 'react';

const DeleteEscolaModal = ({ 
  isOpen, 
  onClose, 
  escolas,
  escolaToDelete,
  setEscolaToDelete,
  onConfirmDelete,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 w-full max-w-md">
        {/* Header da Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100">Remover Escola</h2>
              <p className="text-sm text-gray-400">Selecione uma escola para remover</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo da Modal */}
        <div className="p-6">
          {!escolaToDelete ? (
            <div className="space-y-4">
              <p className="text-gray-300 mb-4">
                Selecione uma escola da lista para remover:
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {escolas.map(escola => (
                  <button
                    key={escola.id}
                    onClick={() => setEscolaToDelete(escola)}
                    className="w-full text-left p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700/50 text-gray-200 hover:text-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-gray-200">
                          {escola.Escola}
                        </h3>
                        {escola['Município'] && (
                          <p className="text-sm text-gray-400 truncate mt-1">
                            {escola['Município']}
                          </p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="font-semibold text-red-200">Confirmar Remoção</h3>
                </div>
                <p className="text-red-300 text-sm">
                  Você está prestes a remover a escola <strong>"{escolaToDelete.Escola}"</strong> de <strong>"{escolaToDelete['Município']}"</strong>.
                </p>
                <p className="text-red-400 text-sm mt-2">
                  ⚠️ Esta ação é irreversível e removerá todos os dados da escola do sistema.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEscolaToDelete(null)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2 justify-center">
                      Removendo...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Confirmar Remoção
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteEscolaModal;

