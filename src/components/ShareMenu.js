import React, { useEffect, useRef, useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';

/**
 * Um único botão "Compartilhar": em celulares usa o menu nativo do sistema
 * (Web Share API); nos demais abre um menu com as redes e "copiar link".
 */
const ShareMenu = ({ url, title, className = '' }) => {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const raizRef = useRef(null);

  const shareUrl = url || window.location.href;
  const shareText = title || 'OPIN - Observatório dos Professores Indígenas';

  useEffect(() => {
    if (!aberto) return undefined;
    const fecharFora = (e) => { if (!raizRef.current?.contains(e.target)) setAberto(false); };
    const fecharEsc = (e) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('mousedown', fecharFora);
    document.addEventListener('keydown', fecharEsc);
    return () => {
      document.removeEventListener('mousedown', fecharFora);
      document.removeEventListener('keydown', fecharEsc);
    };
  }, [aberto]);

  const compartilhar = async (e) => {
    e.stopPropagation();
    const toque = window.matchMedia('(pointer: coarse)').matches;
    if (toque && navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // usuário cancelou
      }
    }
    setAberto((v) => !v);
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopiado(true);
    setTimeout(() => { setCopiado(false); setAberto(false); }, 1500);
  };

  const u = encodeURIComponent(shareUrl);
  const t = encodeURIComponent(shareText);
  const opcoes = [
    { rotulo: 'WhatsApp', icone: MessageCircle, href: `https://wa.me/?text=${t}%20${u}` },
    { rotulo: 'Facebook', icone: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { rotulo: 'X (Twitter)', icone: Twitter, href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  ];
  const itemClasse = 'flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-800 rounded-md hover:bg-green-50 focus:outline-none focus-visible:bg-green-50';

  return (
    <div ref={raizRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={compartilhar}
        onMouseDown={(e) => e.stopPropagation()}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className="flex items-center p-2.5 text-green-800 hover:bg-green-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        title="Compartilhar"
      >
        <Share2 size={18} className="stroke-2" aria-hidden="true" />
        <span className="sr-only">Compartilhar</span>
      </button>

      {aberto && (
        <div role="menu" className="absolute right-0 mt-1 w-52 p-1.5 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-[1010]">
          {opcoes.map(({ rotulo, icone: Icone, href }) => (
            <a
              key={rotulo}
              role="menuitem"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAberto(false)}
              className={itemClasse}
            >
              <Icone className="w-4 h-4 text-gray-600" aria-hidden="true" />
              {rotulo}
            </a>
          ))}
          <button type="button" role="menuitem" onClick={copiarLink} className={itemClasse}>
            {copiado
              ? <Check className="w-4 h-4 text-green-700" aria-hidden="true" />
              : <LinkIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />}
            {copiado ? 'Link copiado!' : 'Copiar link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
