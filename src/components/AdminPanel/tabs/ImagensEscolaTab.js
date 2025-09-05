import React from 'react';
import ImageUploadSection from '../../EditEscolaPanel/ImageUploadSection';
import DebugLegendas from '../../DebugLegendas';

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
    <div className="space-y-6">
      {/* Debug de Legendas */}
      <DebugLegendas escolaId={escolaId} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imagens da Escola
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Faça upload de imagens da escola. Não há limite no número de imagens.
        </p>
        
        <ImageUploadSection 
          escolaId={escolaId}
          onImagesUpdate={() => {
            // Callback para atualizar dados se necessário
            console.log('Imagens da escola atualizadas');
          }}
        />
      </div>
    </div>
  );
};

export default ImagensEscolaTab; 