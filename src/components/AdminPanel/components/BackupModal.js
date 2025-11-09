import React from 'react';
import TabelasIntegraisTab from '../tabs/TabelasIntegraisTab';

const BackupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header da Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100">Backup dos Dados do Site</h2>
              <p className="text-sm text-gray-400">Gerencie backups das tabelas e arquivos</p>
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
        <div className="flex-1 overflow-y-auto p-6">
          <TabelasIntegraisTab />
        </div>
      </div>
    </div>
  );
};

export default BackupModal;

