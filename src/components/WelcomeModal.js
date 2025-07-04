import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Função para limpar o localStorage (para teste)
  const clearWelcomeModal = () => {
    localStorage.removeItem('hasSeenWelcomeModal');
    console.log('WelcomeModal - localStorage limpo');
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

          {/* Footer com botão */}
          <div className="bg-gray-100 px-6 py-4 flex justify-end">
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