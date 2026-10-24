import React, { useState, useEffect } from 'react';
import PDFUploadSection from '../../AddLocationPanel/components/PDFUploadSection';
import CardVisibilityToggle from '../components/CardVisibilityToggle';
import { getDocumentosEscola, createDocumentoEscola, deleteDocumentoEscola, updateDocumentoEscola, isGoogleDriveLink } from '../../../services/documentoService';
import { Edit2, Save, X } from 'lucide-react';
import logger from '../../../utils/logger';

const DocumentosTab = ({ editingLocation, setEditingLocation }) => {
  const escolaId = editingLocation?.id;
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTitulo, setEditingTitulo] = useState(null);
  const [tituloValue, setTituloValue] = useState('');

  // Carregar documentos existentes
  useEffect(() => {
    const loadDocumentos = async () => {
      if (!escolaId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const docs = await getDocumentosEscola(escolaId);
        setDocumentos(docs);
      } catch (err) {
        logger.error('Erro ao carregar documentos:', err);
        setError('Erro ao carregar documentos');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentos();
  }, [escolaId]);

  if (!escolaId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecione uma escola para gerenciar seus documentos</p>
      </div>
    );
  }

  const handleUploadComplete = async (urls) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Identificar novos URLs que não estão no banco
      const existingUrls = documentos.map(doc => doc.link_pdf);
      const newUrls = urls.filter(url => !existingUrls.includes(url));
      
      // Criar documentos para novos URLs
      for (const url of newUrls) {
        await createDocumentoEscola({
          escola_id: escolaId,
          titulo: isGoogleDriveLink(url) ? 'Documento do Google Drive' : 'Documento PDF',
          autoria: null,
          tipo: isGoogleDriveLink(url) ? 'Google Drive' : 'PDF',
          link_pdf: url
        });
      }
      
      // Recarregar documentos
      const updatedDocs = await getDocumentosEscola(escolaId);
      setDocumentos(updatedDocs);
      
      logger.debug('Documentos atualizados:', updatedDocs);
    } catch (err) {
      logger.error('Erro ao salvar documentos:', err);
      setError('Erro ao salvar documentos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (urls) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Identificar documentos que foram removidos
      const urlsToKeep = new Set(urls);
      const docsToDelete = documentos.filter(doc => !urlsToKeep.has(doc.link_pdf));
      
      // Deletar documentos removidos
      for (const doc of docsToDelete) {
        await deleteDocumentoEscola(doc.id);
      }
      
      // Recarregar documentos
      const updatedDocs = await getDocumentosEscola(escolaId);
      setDocumentos(updatedDocs);
      
      logger.debug('Documentos após remoção:', updatedDocs);
    } catch (err) {
      logger.error('Erro ao remover documentos:', err);
      setError('Erro ao remover documentos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
          Faça upload de documentos da escola em formato PDF ou adicione links do Google Drive/Docs. 
          Os documentos aparecerão na seção "Produções e materiais da escola" no painel de informações.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
            Processando...
          </div>
        )}
        
        <PDFUploadSection 
          onUploadComplete={handleUploadComplete}
          onRemove={handleRemove}
          existingUrls={documentos.map(doc => doc.link_pdf)}
        />
        
        {/* Lista de documentos com edição de título */}
        {documentos.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Editar títulos dos documentos:</h4>
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    {editingTitulo === doc.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tituloValue}
                          onChange={(e) => setTituloValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Digite o título do documento"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await updateDocumentoEscola(doc.id, { titulo: tituloValue.trim() || doc.titulo });
                              const updatedDocs = await getDocumentosEscola(escolaId);
                              setDocumentos(updatedDocs);
                              setEditingTitulo(null);
                              setTituloValue('');
                            } catch (err) {
                              logger.error('Erro ao atualizar título:', err);
                              setError('Erro ao atualizar título');
                            }
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTitulo(null);
                            setTituloValue('');
                          }}
                          className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex-1 text-sm text-gray-700">{doc.titulo}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTitulo(doc.id);
                            setTituloValue(doc.titulo);
                          }}
                          className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                          title="Editar título"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentosTab; 