import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownOnSquareIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

const isIOSDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Não oferecer se já instalado ou se o usuário dispensou há menos de 7 dias
const podeOferecerInstalacao = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) return false;

  const hasDismissed = localStorage.getItem('installPromptDismissed');
  const dismissedAt = hasDismissed ? new Date(hasDismissed).getTime() : 0;
  const daysSinceDismiss = (new Date().getTime() - dismissedAt) / (1000 * 3600 * 24);
  return !(hasDismissed && daysSinceDismiss < 7);
};

const InstallPrompt = () => {
  const [podeOferecer] = useState(podeOferecerInstalacao);
  const [isIOS] = useState(isIOSDevice);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  // iOS não tem beforeinstallprompt: mostra direto as instruções manuais
  const [showPrompt, setShowPrompt] = useState(() => podeOferecer && isIOS);

  useEffect(() => {
    if (!podeOferecer) return;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [podeOferecer]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // It's iOS, just dismiss since they have to do it manually
      handleDismiss();
      return;
    }

    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', new Date().toISOString());
  };

  if (!showPrompt) return null;

  const base = import.meta.env.BASE_URL;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 z-[9999] md:hidden">
      <div
        role="dialog"
        aria-labelledby="install-prompt-title"
        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-green-950/40 ring-1 ring-[#9ce66b]/30 bg-cover bg-center motion-safe:animate-[install-prompt-in_0.35s_ease-out]"
        style={{ backgroundImage: `url('${base}site_bg.webp')` }}
      >
        <div className="absolute inset-0 bg-green-950/85" />

        <div className="relative p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-green-100/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <img
              src={`${base}logo_index.webp`}
              alt=""
              className="h-10 w-auto object-contain flex-shrink-0"
            />
            <p
              id="install-prompt-title"
              className="font-semibold text-white text-base leading-tight"
            >
              Leve o Observatório com você
            </p>
          </div>

          {isIOS ? (
            <p className="mt-3 text-sm text-green-100/90 leading-snug">
              Toque em{' '}
              <ArrowUpOnSquareIcon className="inline w-5 h-5 -mt-1 text-[#9ce66b]" aria-label="Compartilhar" />{' '}
              e depois em <strong className="text-white">Adicionar à Tela de Início</strong>.
            </p>
          ) : (
            <p className="mt-3 text-sm text-green-100/90 leading-snug">
              Instale o OPIN no seu celular e acesse o site com mais facilidade.
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#9ce66b] text-green-950 font-bold text-sm px-5 py-2.5 hover:bg-[#85d15a] shadow-xl shadow-green-500/10 transition-colors"
              >
                <ArrowDownOnSquareIcon className="w-5 h-5" />
                Instalar
              </button>
            )}
            <button
              onClick={handleDismiss}
              className={`${isIOS ? 'flex-1' : ''} rounded-full border border-green-100/30 text-green-100 font-semibold text-sm px-5 py-2.5 hover:bg-white/10 transition-colors`}
            >
              {isIOS ? 'Entendi' : 'Agora não'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
