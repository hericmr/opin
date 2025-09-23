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
    <ProfessorImageUploadSection 
      escolaId={escolaId}
      onImagesUpdate={() => {
        // Callback para atualizar dados se necessário
        console.log('Imagens dos professores atualizadas');
      }}
    />
  );
};

export default ImagensProfessoresTab; 