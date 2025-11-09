import React from 'react';
import ImageUploadSection from '../../EditEscolaPanel/ImageUploadSection';
import CardVisibilityToggle from '../components/CardVisibilityToggle';
import logger from '../../../utils/logger';

const ImagensEscolaTab = ({ editingLocation, setEditingLocation }) => {
  const escolaId = editingLocation?.id;

  if (!escolaId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecione uma escola para gerenciar suas imagens</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="imagensEscola"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Imagens da Escola"
      />
      
      <ImageUploadSection 
      escolaId={escolaId}
      onImagesUpdate={() => {
        // Callback para atualizar dados se necessário
        logger.debug('Imagens da escola atualizadas');
      }}
    />
    </div>
  );
};

export default ImagensEscolaTab; 