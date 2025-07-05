import React, { useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

// Componente Tooltip simples
const Tooltip = ({ children, text, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap
          ${positionClasses[position]}
        `}>
          {text}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const ShareButton = ({ onClick, url, title, description = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback para navegadores mais antigos
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Frases de compartilhamento mais atrativas
  const shareTextOptions = [
    `Conheça a escola indígena: ${title}`,
    `Descubra esta escola indígena: ${title}`,
    `Escola indígena incrível: ${title}`,
    `Educação indígena em destaque: ${title}`,
    `Conheça esta escola: ${title}`,
    `Escola indígena que inspira: ${title}`,
    `Educação que transforma: ${title}`,
    `Escola indígena de referência: ${title}`
  ];

  // Seleciona uma frase aleatória para variar o conteúdo
  const randomIndex = Math.floor(Math.random() * shareTextOptions.length);
  const shareText = shareTextOptions[randomIndex];
  const shareUrl = url || window.location.href;

  return (
    <div className="px-2 pb-2 border-t border-green-200 bg-white">
      <div className="mt-2 space-y-1">
        {/* Botão Copiar Link */}
        <Tooltip text={copied ? "Link copiado!" : "Copiar link para clipboard"}>
          <button
            onClick={handleCopyLink}
            className={`
              w-full flex items-start gap-2 p-1.5 rounded-md transition-colors
              focus:outline-none focus:ring-1 focus:ring-green-500
              ${copied
                ? 'bg-green-100'
                : 'bg-green-100 hover:bg-green-200'
              }
            `}
            aria-label="Copiar link para clipboard"
          >
            <svg 
              className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-700">
                {copied ? 'Link Copiado' : 'Copiar Link'}
              </div>
            </div>
          </button>
        </Tooltip>

        {/* Botão WhatsApp */}
        <Tooltip text="Compartilhar no WhatsApp">
          <WhatsappShareButton
            url={shareUrl}
            title={shareText}
            className="w-full transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 rounded-md"
            aria-label="Compartilhar no WhatsApp"
          >
            <div className="flex items-start gap-2 p-1.5 bg-green-100 hover:bg-green-200 rounded-md">
              <WhatsappIcon size={20} round={false} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">WhatsApp</div>
              </div>
            </div>
          </WhatsappShareButton>
        </Tooltip>

        {/* Botão Facebook */}
        <Tooltip text="Compartilhar no Facebook">
          <FacebookShareButton
            url={shareUrl}
            quote={shareText}
            className="w-full transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 rounded-md"
            aria-label="Compartilhar no Facebook"
          >
            <div className="flex items-start gap-2 p-1.5 bg-green-100 hover:bg-green-200 rounded-md">
              <FacebookIcon size={20} round={false} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">Facebook</div>
              </div>
            </div>
          </FacebookShareButton>
        </Tooltip>

        {/* Botão Twitter */}
        <Tooltip text="Compartilhar no Twitter">
          <TwitterShareButton
            url={shareUrl}
            title={shareText}
            className="w-full transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 rounded-md"
            aria-label="Compartilhar no Twitter"
          >
            <div className="flex items-start gap-2 p-1.5 bg-green-100 hover:bg-green-200 rounded-md">
              <TwitterIcon size={20} round={false} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">Twitter</div>
              </div>
            </div>
          </TwitterShareButton>
        </Tooltip>

        {/* Botão LinkedIn */}
        <Tooltip text="Compartilhar no LinkedIn">
          <LinkedinShareButton
            url={shareUrl}
            title={title}
            summary={description}
            className="w-full transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 rounded-md"
            aria-label="Compartilhar no LinkedIn"
          >
            <div className="flex items-start gap-2 p-1.5 bg-green-100 hover:bg-green-200 rounded-md">
              <LinkedinIcon size={20} round={false} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">LinkedIn</div>
              </div>
            </div>
          </LinkedinShareButton>
        </Tooltip>

        {/* Botão Compartilhar Nativo (fallback) */}
        {navigator.share && (
          <Tooltip text="Compartilhar usando opções do sistema">
            <button
              onClick={onClick}
              className="w-full flex items-start gap-2 p-1.5 bg-green-100 hover:bg-green-200 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-green-500"
              aria-label="Compartilhar usando opções do sistema"
            >
              <svg 
                className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" 
                />
              </svg>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">Compartilhar</div>
              </div>
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default React.memo(ShareButton);