import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { Facebook, Twitter, MessageCircle, Copy as LinkIcon, Check } from 'lucide-react';

const MinimalShareButtons = ({ url, title, description = '' }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = title || 'OPIN - Observatório Dos Professores Indígenas';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback para navegadores mais antigos
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <span className="shareBtns flex items-center">
      <FacebookShareButton
        url={shareUrl}
        quote={shareText}
        className="shareIcon blackHover"
        aria-label="Compartilhar no Facebook"
      >
        <Facebook className="w-4 h-4" />
      </FacebookShareButton>
      
      <TwitterShareButton
        url={shareUrl}
        title={shareText}
        className="shareIcon blackHover"
        aria-label="Compartilhar no Twitter"
      >
        <Twitter className="w-4 h-4" />
      </TwitterShareButton>
      
      <WhatsappShareButton
        url={shareUrl}
        title={shareText}
        className="shareIcon blackHover"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </WhatsappShareButton>
      
      <button
        onClick={handleCopyLink}
        className="shareIcon blackHover"
        aria-label={copied ? 'Link copiado' : 'Copiar link'}
        title={copied ? 'Link copiado!' : 'Copiar link'}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
      </button>
    </span>
  );
};

export default MinimalShareButtons;

