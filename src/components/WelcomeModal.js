import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

const WelcomeModal = ({ onStartTutorial }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Função para limpar o localStorage (para teste)
  const clearWelcomeModal = () => {
    localStorage.removeItem('hasSeenWelcomeModal');
    console.log('WelcomeModal - localStorage limpo');
  };

  // Função para detectar se é dispositivo móvel
  const checkIsMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileDevice || isSmallScreen;
  };

  // Detectar dispositivo móvel
  useEffect(() => {
    setIsMobile(checkIsMobile());
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verificar se o app já foi instalado
  useEffect(() => {
    // Verifica se está rodando como PWA instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // Verifica se está no iOS e foi adicionado à tela inicial
    const isIOSStandalone = window.navigator.standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
    }

    // Listener para quando o app for instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Verificar se já foi instalado anteriormente
    const wasInstalled = localStorage.getItem('pwa-installed');
    if (wasInstalled === 'true') {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Capturar evento beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Previne o prompt automático do browser
      e.preventDefault();
      // Armazena o evento para uso posterior
      setDeferredPrompt(e);
      console.log('WelcomeModal - beforeinstallprompt capturado');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Função para instalar o app
  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      console.log('WelcomeModal - deferredPrompt não disponível');
      return;
    }

    try {
      // Mostra o prompt de instalação
      deferredPrompt.prompt();
      
      // Espera pela escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('WelcomeModal - Usuário escolheu:', outcome);
      
      if (outcome === 'accepted') {
        console.log('WelcomeModal - App será instalado');
      } else {
        console.log('WelcomeModal - Instalação cancelada pelo usuário');
      }
      
      // Limpa o prompt após uso
      setDeferredPrompt(null);
    } catch (error) {
      console.error('WelcomeModal - Erro ao chamar prompt:', error);
      setDeferredPrompt(null);
    }
  };

  // Adicionar função global para teste
  useEffect(() => {
    window.clearWelcomeModal = clearWelcomeModal;
    return () => {
      delete window.clearWelcomeModal;
    };
  }, []);

  useEffect(() => {
    // Verificar se estamos na página inicial (com ou sem barra)
    const isHomePage = location.pathname === '/' || location.pathname === '';
    
    console.log('WelcomeModal - pathname:', location.pathname, 'isHomePage:', isHomePage);
    
    if (isHomePage) {
      // Verificar se o usuário já viu o modal antes
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
      
      console.log('WelcomeModal - hasSeenWelcome:', hasSeenWelcome);
      
      if (!hasSeenWelcome) {
        // Pequeno delay para garantir que a página carregou completamente
        const timer = setTimeout(() => {
          console.log('WelcomeModal - Abrindo modal');
          setIsOpen(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Se não estamos na página inicial, fechar o modal
      console.log('WelcomeModal - Não é página inicial, fechando modal');
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    // Marcar que o usuário já viu o modal
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
      role="dialog"
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-description"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header com padrão decorativo */}
          <div className="relative bg-gradient-to-r from-green-900 to-green-800 p-6">
            {/* Elementos decorativos sutis */}
            <div className="absolute top-2 right-5 w-8 h-8 border-2 border-green-700/30 rounded-full"></div>
            <div className="absolute bottom-2 left-5 w-4 h-4 border border-green-700/20 rounded-full"></div>
            
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Dialog.Title 
                  id="welcome-modal-title"
                  className="text-2xl font-bold text-white font-['Nunito'] leading-tight"
                >
                  Bem-vindo ao OPIN
                </Dialog.Title>
                <p className="text-amber-100 text-sm mt-1 font-['Nunito']">
                  Observatório dos Professores Indígenas no Estado de São Paulo
                </p>
              </div>
              
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Fechar modal de boas-vindas"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="p-6 space-y-4">
            <div className="text-gray-700 leading-relaxed font-['Nunito'] text-base">
              <p className="mb-4">
                O OPIN (Observatório da Educação Escolar Indígena) é um espaço dedicado aos professores indígenas do estado de São Paulo. Aqui, sistematizamos dados educacionais e disponibilizamos materiais pedagógicos, registros e ferramentas...
              </p>
            </div>

            {/* Elementos visuais sutis */}
            <div className="flex justify-center space-x-2 py-2">
              <div className="w-2 h-2 bg-green-800 rounded-full"></div>
              <div className="w-2 h-2 bg-green-700 rounded-full"></div>
              <div className="w-2 h-2 bg-green-900 rounded-full"></div>
            </div>
          </div>

          {/* Footer com botões */}
          <div className="bg-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
            {/* Botão de Tutorial */}
            {onStartTutorial && (
              <button
                onClick={() => {
                  handleClose();
                  // Pequeno delay para garantir que o modal feche antes de iniciar o tutorial
                  setTimeout(() => {
                    onStartTutorial();
                  }, 300);
                }}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-['Nunito'] flex items-center justify-center gap-2"
                aria-label="Ver tutorial do mapa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Ver Tutorial
              </button>
            )}
            
            {/* Botão de instalação (apenas em mobile e se não foi instalado) */}
            {isMobile && deferredPrompt && !isInstalled && (
              <button
                onClick={handleInstallApp}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-['Nunito'] flex items-center gap-2"
                aria-label="Instalar aplicativo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Instalar App
              </button>
            )}
            
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-green-900 to-green-700 text-white px-6 py-2 rounded-lg font-medium hover:from-green-800 hover:to-green-900 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-['Nunito']"
              id="welcome-modal-description"
            >
              Entrar no site
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default WelcomeModal; 