import React, { useRef, useState, useEffect } from 'react';

/**
 * DocumentViewer
 * Componente para exibir uma lista de documentos (PDFs) associados a uma escola.
 * Permite visualização via iframe (Google Drive/Docs) ou download externo, com tratamento de erros e fallback amigável.
 * Props:
 *   - documentos: Array de objetos { id, titulo, autoria, tipo, link_pdf }
 *   - title: string (opcional)
 */

// Utility function to transform Google Drive links
const transformarLinkGoogleDrive = (link) => {
  if (!link || typeof link !== 'string') return null;
  
  const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;
  
  const fileId = match[1];
  return `https://docs.google.com/gview?url=https://drive.google.com/uc?id=${fileId}&embedded=true`;
};

/**
 * Componente de troca de visualização (lista/grade) acessível e reutilizável
 */
const ViewModeToggle = ({ viewMode, setViewMode }) => (
  <div className="flex items-center gap-2" role="tablist" aria-label="Modos de visualização dos documentos">
    <button
      type="button"
      role="tab"
      aria-selected={viewMode === 'list'}
      aria-label="Visualizar em lista"
      aria-pressed={viewMode === 'list'}
      onClick={() => setViewMode('list')}
      className={`p-2 rounded-lg flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 ${
        viewMode === 'list'
          ? 'bg-green-100 text-green-800 font-semibold'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      tabIndex={0}
    >
      {/* Ícone de lista */}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span className="hidden sm:inline">Lista</span>
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={viewMode === 'grid'}
      aria-label="Visualizar em grade"
      aria-pressed={viewMode === 'grid'}
      onClick={() => setViewMode('grid')}
      className={`p-2 rounded-lg flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 ${
        viewMode === 'grid'
          ? 'bg-green-100 text-green-800 font-semibold'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      tabIndex={0}
    >
      {/* Ícone de grade */}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      <span className="hidden sm:inline">Grade</span>
    </button>
  </div>
);

const DocumentViewer = ({ documentos, title = "Documentos" }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const iframeRef = useRef(null);
  const [iframeError, setIframeError] = useState(false);
  const [useGoogleDocsViewer, setUseGoogleDocsViewer] = useState(false);

  // Reset states when selected document changes
  useEffect(() => {
    if (selectedDoc) {
      setIframeError(false);
      setUseGoogleDocsViewer(false);
    }
  }, [selectedDoc]);

  // Set first document as selected if none is selected
  useEffect(() => {
    if (!selectedDoc && documentos?.length > 0) {
      setSelectedDoc(documentos[0]);
    }
  }, [documentos, selectedDoc]);

  // Handle iframe events
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !selectedDoc) return;

    const handleLoad = () => {
      setIframeError(false);
    };

    const handleError = () => {
      setIframeError(true);
      setUseGoogleDocsViewer(true);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [selectedDoc]);

  // Early return after all hooks
  if (!documentos || documentos.length === 0) {
    return null;
  }

  const renderDocumentGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className={`
              flex flex-col justify-between h-full max-w-xs mx-auto
              rounded-2xl transition-all duration-200 cursor-pointer
              shadow-sm hover:shadow-lg
              ${selectedDoc?.id === doc.id
                ? 'bg-green-100 scale-[1.03]'
                : 'bg-white hover:bg-green-50'
              }
            `}
            onClick={() => {
              setSelectedDoc(doc);
            }}
            tabIndex={0}
            aria-label={`Selecionar documento: ${doc.titulo}`}
          >
            <div className="p-5 flex-1 flex flex-col justify-between">
              <h4 className="font-semibold text-green-800 mb-2 line-clamp-2 text-lg">{doc.titulo}</h4>
              {doc.autoria && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">Por: {doc.autoria}</p>
              )}
              {doc.tipo && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">
                  {doc.tipo}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDocumentList = () => {
    return (
      <div className="space-y-2">
        {documentos.map((doc) => (
          <button
            key={doc.id}
            onClick={() => {
              setSelectedDoc(doc);
            }}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
              selectedDoc?.id === doc.id
                ? 'bg-green-100'
                : 'hover:bg-green-50'
            }`}
          >
            <h4 className="font-medium text-green-800">{doc.titulo}</h4>
            {doc.autoria && (
              <p className="text-sm text-gray-600">Por: {doc.autoria}</p>
            )}
            {doc.tipo && (
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-200 text-green-800 rounded-full">
                {doc.tipo}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderDocumentViewer = () => {
    if (!selectedDoc) return null;

    const isGoogleDriveLink = selectedDoc.link_pdf.includes('drive.google.com/file/d/');

    return (
      <div className="rounded-lg overflow-hidden shadow-lg bg-white">
        {isGoogleDriveLink ? (
          <>
            {!useGoogleDocsViewer ? (
              <iframe 
                ref={iframeRef}
                src={selectedDoc.link_pdf.replace('/view?usp=sharing', '/preview')}
                width="100%" 
                height="500px"
                allow="autoplay"
                loading="lazy"
                title={selectedDoc.titulo}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                className="bg-white"
              />
            ) : (
              <iframe
                ref={iframeRef}
                src={transformarLinkGoogleDrive(selectedDoc.link_pdf)}
                width="100%"
                height="500px"
                allow="autoplay"
                loading="lazy"
                title={`${selectedDoc.titulo} (Google Docs Viewer)`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                className="bg-white"
              />
            )}
            {iframeError && (
              <div className="p-6 text-center text-gray-600 bg-green-100">
                <p className="mb-3 text-lg">Não foi possível carregar o documento diretamente.</p>
                <a
                  href={selectedDoc.link_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-base font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                  Abrir em nova aba
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center p-6">
            <a
              href={selectedDoc.link_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Ver documento PDF
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-green-800">{title}:</h3>
        {documentos.length > 1 && (
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}
      </div>
      
      {documentos.length > 1 && (
        <div className="mb-6">
          {viewMode === 'grid' ? renderDocumentGrid() : renderDocumentList()}
        </div>
      )}
      
      {renderDocumentViewer()}
    </div>
  );
};

export default React.memo(DocumentViewer); 