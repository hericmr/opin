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
import { Share2, Link, Check, MessageCircle, Facebook, Twitter, Linkedin } from "lucide-react";

// Componente Tooltip melhorado
const Tooltip = ({ children, text, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-3",
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
          absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap
          ${positionClasses[position]}
          animate-in fade-in-0 zoom-in-95 duration-200
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
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback para navegadores mais antigos
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
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

  const shareButtons = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-green-500 hover:bg-green-600",
      component: WhatsappShareButton,
      props: { url: shareUrl, title: shareText }
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
      component: FacebookShareButton,
      props: { url: shareUrl, quote: shareText }
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      color: "bg-sky-500 hover:bg-sky-600",
      component: TwitterShareButton,
      props: { url: shareUrl, title: shareText }
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-blue-700 hover:bg-blue-800",
      component: LinkedinShareButton,
      props: { url: shareUrl, title: title, summary: description }
    }
  ];

  return (
    <div className="px-4 py-6 border-t border-green-200 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-md mx-auto">
        {/* Título da seção */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Compartilhe esta escola
          </h3>
        </div>

        {/* Botão Copiar Link - Destaque */}
        <div className="mb-4">
          <Tooltip text={copied ? "Link copiado com sucesso!" : "Copiar link para clipboard"}>
            <button
              onClick={handleCopyLink}
              className={`
                w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                transform hover:scale-105 active:scale-95
                ${copied
                  ? 'bg-green-100 border-2 border-green-300 text-green-800'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                }
              `}
              aria-label="Copiar link para clipboard"
            >
              {copied ? (
                <Check className="w-6 h-6" />
              ) : (
                <Link className="w-6 h-6" />
              )}
              <span className="font-semibold">
                {copied ? 'Link Copiado!' : 'Copiar Link'}
              </span>
            </button>
          </Tooltip>
        </div>

        {/* Botões de Redes Sociais */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {shareButtons.map((button, index) => {
            const ShareComponent = button.component;
            return (
              <Tooltip key={index} text={`Compartilhar no ${button.name}`}>
                <ShareComponent
                  {...button.props}
                  className="w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
                  aria-label={`Compartilhar no ${button.name}`}
                >
                  <div className={`
                    w-full flex items-center justify-center gap-2 p-3 rounded-lg text-white font-medium
                    ${button.color} shadow-md hover:shadow-lg
                  `}>
                    {button.icon}
                    <span className="text-sm">{button.name}</span>
                  </div>
                </ShareComponent>
              </Tooltip>
            );
          })}
        </div>

        {/* Botão Compartilhar Nativo (fallback) */}
        {navigator.share && (
          <div className="text-center">
            <Tooltip text="Compartilhar usando opções do sistema">
              <button
                onClick={onClick}
                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
                aria-label="Compartilhar usando opções do sistema"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Mais opções</span>
              </button>
            </Tooltip>
          </div>
        )}


      </div>
    </div>
  );
};

export default React.memo(ShareButton);