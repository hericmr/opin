import React, { useRef, memo, useState, useEffect } from "react";
import PainelHeader from "../PainelHeader";
import usePainelVisibility from "../hooks/usePainelVisibility";
import useAudio from "../hooks/useAudio";
import { useShare } from "../hooks/useShare";
import { useDynamicURL } from "../hooks/useDynamicURL";
import { useClickOutside } from "../hooks/useClickOutside";
import { usePainelDimensions } from "../hooks/usePainelDimensions";

// Import modular components
import EscolaInfo from "./components/EscolaInfo";
import TerraIndigenaInfo from "./TerraIndigenaInfo";
import ShareSection from "./ShareSection";
import IntroPanel from "./IntroPanel";

// Função utilitária para transformar links do Google Drive
const transformarLinkGoogleDrive = (link) => {
  if (!link || typeof link !== 'string') return null;
  
  // Tenta extrair o fileId do link do Google Drive
  const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return null;
  
  const fileId = match[1];
  return `https://docs.google.com/gview?url=https://drive.google.com/uc?id=${fileId}&embedded=true`;
};

// Função utilitária para extrair ID do vídeo do YouTube
const extrairIdYoutube = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove parâmetros de query para simplificar (tudo após '?')
  const baseUrl = url.split('?')[0];

  // Padrões para pegar o ID de vídeo
  const patterns = [
    /youtube\.com\/embed\/([^/?&]+)/,                 // embed/ID
    /youtube\.com\/watch\?v=([^&]+)/,                 // watch?v=ID
    /youtu\.be\/([^?&]+)/,                            // youtu.be/ID
    /youtube\.com\/v\/([^?&]+)/                       // youtube.com/v/ID
  ];

  for (const pattern of patterns) {
    const match = baseUrl.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return videoId;
    }
  }

  return null;
};

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const painelRef = useRef(null);
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const [isMaximized, setIsMaximized] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [useGoogleDocsViewer, setUseGoogleDocsViewer] = useState(false);
  const iframeRef = useRef(null);
  
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile, isMaximized);
  
  const toggleMaximize = () => setIsMaximized(prev => !prev);
  
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, closePainel);

  // Efeito para monitorar erros do iframe
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
  }, [painelInfo?.link_para_documentos]);

  // Efeito para processar o link do vídeo
  const videoId = painelInfo?.link_para_videos ? extrairIdYoutube(painelInfo.link_para_videos) : null;

  // Efeito para monitorar mudanças no link do vídeo
  useEffect(() => {
    if (painelInfo?.link_para_videos) {
      // ... existing code ...
    }
  }, [painelInfo?.link_para_videos]);

  if (!painelInfo) {
    return null;
  }

  const baseClasses = `
    fixed top-16 right-0 sm:left-auto
    ${isMaximized ? 'sm:w-full lg:w-full px-4' : 'sm:w-3/4 lg:w-[49%]'}
    rounded-xl shadow-xl z-40 transform transition-all duration-500 ease-in-out
    bg-gradient-to-b from-green-50/95 to-green-50/90 backdrop-blur-sm
  `;
  
  const visibilityClasses = isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0";

  // Determina se é uma terra indígena, escola ou painel introdutório
  const isTerraIndigena = painelInfo.tipo === 'terra_indigena';
  const isIntro = painelInfo.titulo === 'Sobre o site';

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      aria-modal="true"
      className={`${baseClasses} ${visibilityClasses}`}
      style={{
        height: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.height,
        maxHeight: isMobile ? 'calc(100vh - 4rem)' : painelDimensions.maxHeight,
        width: painelDimensions.width,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PainelHeader 
        titulo={painelInfo.titulo} 
        closePainel={closePainel}
        toggleMaximize={toggleMaximize}
        isMaximized={isMaximized}
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/40 scrollbar-track-green-50/20">
        <div className="p-6 space-y-8">
          <div className="prose prose-lg lg:prose-xl max-w-none">
            {isIntro ? (
              <IntroPanel painelInfo={painelInfo} />
            ) : isTerraIndigena ? (
              <TerraIndigenaInfo terraIndigena={painelInfo} />
            ) : (
              <>
                <EscolaInfo 
                  escola={painelInfo} 
                  shouldUseGrid={painelDimensions.shouldUseGrid}
                />
                {painelInfo.link_para_documentos && (
                  <div className="mt-8 max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">Produções e materiais da escola:</h3>
                    {painelInfo.link_para_documentos.includes('drive.google.com/file/d/') ? (
                      <div className="rounded-lg overflow-hidden shadow-lg border border-green-300 bg-white">
                        {!useGoogleDocsViewer ? (
                          <iframe 
                            ref={iframeRef}
                            src={painelInfo.link_para_documentos.replace('/view?usp=sharing', '/preview')}
                            width="100%" 
                            height="500px"
                            allow="autoplay"
                            loading="lazy"
                            title="Documento PDF da escola"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            className="bg-white"
                          />
                        ) : (
                          <iframe
                            ref={iframeRef}
                            src={transformarLinkGoogleDrive(painelInfo.link_para_documentos)}
                            width="100%"
                            height="500px"
                            allow="autoplay"
                            loading="lazy"
                            title="Documento PDF da escola (Google Docs Viewer)"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            className="bg-white"
                          />
                        )}
                        {iframeError && (
                          <div className="p-6 text-center text-gray-600 bg-gray-50">
                            <p className="mb-3 text-lg">Não foi possível carregar o documento diretamente.</p>
                            <a
                              href={painelInfo.link_para_documentos}
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
                          href={painelInfo.link_para_documentos}
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
                          Ver documento PDF da escola
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {painelInfo.link_para_videos && (
                  <div className="mt-8 max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">Vídeo da escola:</h3>
                    {(() => {
                      const videoId = extrairIdYoutube(painelInfo.link_para_videos);
                      
                      return videoId ? (
                        <div className="rounded-lg overflow-hidden shadow-lg border border-green-300 bg-white">
                          <div className="relative pb-[56.25%] h-0">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title="Vídeo da escola"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="origin"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
                          <p className="mb-3 text-lg">Link do vídeo inválido ou não suportado.</p>
                          <a
                            href={painelInfo.link_para_videos}
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
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            Tentar abrir no YouTube
                          </a>
                        </div>
                      );
                    })()}
                    <div className="mt-4 text-center">
                      <a
                        href={painelInfo.link_para_videos}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-700 hover:text-green-800 hover:underline"
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
                        Ver vídeo no YouTube
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
        </div>
      </div>
    </div>
  );
};

export default memo(PainelInformacoes); 