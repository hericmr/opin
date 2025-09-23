import React from 'react';
import ImageUploadSection from '../../EditEscolaPanel/ImageUploadSection';

const ImagensEscolaTab = ({ editingLocation }) => {
  const escolaId = editingLocation?.id;

  if (!escolaId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecione uma escola para gerenciar suas imagens</p>
      </div>
    );
  }

  return (
    <ImageUploadSection 
      escolaId={escolaId}
      onImagesUpdate={() => {
        // Callback para atualizar dados se necessário
        console.log('Imagens da escola atualizadas');
      }}
    />
  );
};

export default ImagensEscolaTab; 