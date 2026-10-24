import React from 'react';
import ProfessorImageUploadSection from '../../EditEscolaPanel/ProfessorImageUploadSection';
import logger from '../../../utils/logger';
import { useRefresh } from '../../../contexts/RefreshContext';

const ImagensProfessoresTab = ({ editingLocation, setEditingLocation }) => {
  const escolaId = editingLocation?.id;
  const { triggerRefresh } = useRefresh();

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
        logger.debug('Imagens dos professores atualizadas, disparando refresh...');
        triggerRefresh();
      }}
    />
    </div>
  );
};

export default ImagensProfessoresTab; 