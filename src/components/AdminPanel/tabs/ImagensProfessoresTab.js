import React from 'react';
import ProfessorImageUploadSection from '../../EditEscolaPanel/ProfessorImageUploadSection';

const ImagensProfessoresTab = ({ editingLocation }) => {
  const escolaId = editingLocation?.id;

  if (!escolaId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecione uma escola para gerenciar as imagens dos professores</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imagens dos Professores
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Faça upload de imagens dos professores da escola. Não há limite no número de imagens.
        </p>
        
        <ProfessorImageUploadSection 
          escolaId={escolaId}
          onImagesUpdate={() => {
            // Callback para atualizar dados se necessário
            console.log('Imagens dos professores atualizadas');
          }}
        />
      </div>
    </div>
  );
};

export default ImagensProfessoresTab; 