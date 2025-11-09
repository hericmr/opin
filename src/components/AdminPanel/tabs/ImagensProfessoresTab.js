import React from 'react';
import ProfessorImageUploadSection from '../../EditEscolaPanel/ProfessorImageUploadSection';
import logger from '../../../utils/logger';

const ImagensProfessoresTab = ({ editingLocation, setEditingLocation }) => {
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
      <ProfessorImageUploadSection 
      escolaId={escolaId}
      onImagesUpdate={() => {
        // Callback para atualizar dados se necessário
        logger.debug('Imagens dos professores atualizadas');
      }}
    />
    </div>
  );
};

export default ImagensProfessoresTab; 