import React, { useRef, useState, useEffect } from 'react';

// Utility function to transform Google Drive links
const transformarLinkGoogleDrive = (link) => {
  if (!link || typeof link !== 'string') return null;
  
  const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;
  
  const fileId = match[1];
  return `https://docs.google.com/gview?url=https://drive.google.com/uc?id=${fileId}&embedded=true`;
};

const DocumentViewer = ({ documentUrl, title = "Documento PDF" }) => {
  const iframeRef = useRef(null);
  const [iframeError, setIframeError] = useState(false);
  const [useGoogleDocsViewer, setUseGoogleDocsViewer] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

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
  }, [documentUrl]);

  if (!documentUrl) return null;

  const isGoogleDriveLink = documentUrl.includes('drive.google.com/file/d/');

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-green-800 mb-4">Produções e materiais:</h3>
      {isGoogleDriveLink ? (
        <div className="rounded-lg overflow-hidden shadow-lg border border-green-300 bg-white">
          {!useGoogleDocsViewer ? (
            <iframe 
              ref={iframeRef}
              src={documentUrl.replace('/view?usp=sharing', '/preview')}
              width="100%" 
              height="500px"
              allow="autoplay"
              loading="lazy"
              title={title}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              className="bg-white"
            />
          ) : (
            <iframe
              ref={iframeRef}
              src={transformarLinkGoogleDrive(documentUrl)}
              width="100%"
              height="500px"
              allow="autoplay"
              loading="lazy"
              title={`${title} (Google Docs Viewer)`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              className="bg-white"
            />
          )}
          {iframeError && (
            <div className="p-6 text-center text-gray-600 bg-gray-50">
              <p className="mb-3 text-lg">Não foi possível carregar o documento diretamente.</p>
              <a
                href={documentUrl}
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
        </div>
      ) : (
        <div className="flex justify-center">
          <a
            href={documentUrl}
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

export default React.memo(DocumentViewer); 