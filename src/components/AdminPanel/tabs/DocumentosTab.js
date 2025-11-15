import React, { useState } from 'react';
import PDFUploadSection from '../../AddLocationPanel/components/PDFUploadSection';
import CardVisibilityToggle from '../components/CardVisibilityToggle';
import logger from '../../../utils/logger';

const DocumentosTab = ({ editingLocation, setEditingLocation }) => {
  const escolaId = editingLocation?.id;
  const [documentos, setDocumentos] = useState(editingLocation?.documentos || []);

  if (!escolaId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecione uma escola para gerenciar seus documentos</p>
      </div>
    );
  }

  const handleUploadComplete = (urls) => {
    setDocumentos(urls);
    // Aqui você pode salvar os documentos no banco de dados se necessário
    logger.debug('Documentos atualizados:', urls);
  };

  const handleRemove = (urls) => {
    setDocumentos(urls);
    // Aqui você pode atualizar o banco de dados se necessário
    logger.debug('Documentos após remoção:', urls);
  };

  return (
    <div className="space-y-6">
      {/* Toggle de Visibilidade */}
      <CardVisibilityToggle
        cardId="documentos"
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        label="Visibilidade do Card: Documentos"
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Documentos da Escola
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Faça upload de documentos da escola em formato PDF. Não há limite no número de documentos.
        </p>
        
        <PDFUploadSection 
          onUploadComplete={handleUploadComplete}
          onRemove={handleRemove}
          existingUrls={documentos}
        />
      </div>
    </div>
  );
};

export default DocumentosTab; 