import React, { useRef, useState, useEffect } from 'react';

// Utility function to transform Google Drive links
const transformarLinkGoogleDrive = (link) => {
  if (!link || typeof link !== 'string') return null;
  
  const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;
  
  const fileId = match[1];
  return `https://docs.google.com/gview?url=https://drive.google.com/uc?id=${fileId}&embedded=true`;
};

const DocumentViewer = ({ documentos, title = "Documentos" }) => {
  console.log('📚 DocumentViewer recebeu documentos:', documentos);
  
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const iframeRef = useRef(null);
  const [iframeError, setIframeError] = useState(false);
  const [useGoogleDocsViewer, setUseGoogleDocsViewer] = useState(false);

  // Reset states when selected document changes
  useEffect(() => {
    console.log('🔄 useEffect - Reset states, selectedDoc:', selectedDoc);
    if (selectedDoc) {
      setIframeError(false);
      setUseGoogleDocsViewer(false);
    }
  }, [selectedDoc]);

  // Set first document as selected if none is selected
  useEffect(() => {
    console.log('🔄 useEffect - Set first document, documentos:', documentos);
    if (!selectedDoc && documentos?.length > 0) {
      console.log('📄 Selecionando primeiro documento:', documentos[0]);
      setSelectedDoc(documentos[0]);
    }
  }, [documentos, selectedDoc]);

  // Handle iframe events
  useEffect(() => {
    console.log('🔄 useEffect - Handle iframe, selectedDoc:', selectedDoc);
    const iframe = iframeRef.current;
    if (!iframe || !selectedDoc) return;

    const handleLoad = () => {
      console.log('✅ iframe carregado com sucesso');
      setIframeError(false);
    };

    const handleError = () => {
      console.log('❌ Erro ao carregar iframe');
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
    console.log('⚠️ DocumentViewer: Nenhum documento para renderizar');
    return null;
  }

  console.log('🎨 Renderizando DocumentViewer com:', {
    documentosCount: documentos.length,
    selectedDoc,
    iframeError,
    useGoogleDocsViewer,
    viewMode
  });

  const renderDocumentGrid = () => {
    console.log('📋 Renderizando grid de documentos');
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className={`
              rounded-lg border-2 transition-all duration-200 cursor-pointer
              ${selectedDoc?.id === doc.id
                ? 'bg-green-100 border-green-300 shadow-lg scale-[1.02]'
                : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
              }
            `}
            onClick={() => {
              console.log('🖱️ Documento selecionado:', doc);
              setSelectedDoc(doc);
            }}
          >
            <div className="p-4">
              <h4 className="font-medium text-green-800 mb-2 line-clamp-2">{doc.titulo}</h4>
              {doc.autoria && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">Por: {doc.autoria}</p>
              )}
              {doc.tipo && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
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
    console.log('📋 Renderizando lista de documentos');
    return (
      <div className="space-y-2">
        {documentos.map((doc) => (
          <button
            key={doc.id}
            onClick={() => {
              console.log('🖱️ Documento selecionado:', doc);
              setSelectedDoc(doc);
            }}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
              selectedDoc?.id === doc.id
                ? 'bg-green-100 border-green-300'
                : 'hover:bg-green-50 border-transparent'
            } border-2`}
          >
            <h4 className="font-medium text-green-800">{doc.titulo}</h4>
            {doc.autoria && (
              <p className="text-sm text-gray-600">Por: {doc.autoria}</p>
            )}
            {doc.tipo && (
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {doc.tipo}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderDocumentViewer = () => {
    console.log('📄 Renderizando visualizador de documento:', selectedDoc);
    if (!selectedDoc) return null;

    const isGoogleDriveLink = selectedDoc.link_pdf.includes('drive.google.com/file/d/');
    console.log('🔗 Link do documento:', {
      link: selectedDoc.link_pdf,
      isGoogleDriveLink
    });

    return (
      <div className="rounded-lg overflow-hidden shadow-lg border border-green-300 bg-white">
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
              <div className="p-6 text-center text-gray-600 bg-gray-50">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Visualização em lista"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Visualização em grade"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
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