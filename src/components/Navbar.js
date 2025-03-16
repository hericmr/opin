import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddLocationButton from './AddLocationButton';
import { Settings, ChevronDown, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_PASSWORD = "Política Social";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminClick = () => {
    const enteredPassword = prompt("Digite a senha de administrador:");
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminPanel(false);
    }
  };

  const isConteudoPage = location.pathname === '/conteudo';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-900/80 backdrop-blur-md text-white">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center space-x-2">
          <img
            src="/cartografiasocial/favicon.ico"
            alt="Ícone do mapa"
            className="h-6 sm:h-8 w-auto"
            aria-label="Ícone do mapa"
          />
          <h1
            onClick={() => navigate('/')}
            className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold tracking-wide cursor-pointer truncate hover:text-green-100 transition-colors"
          >
            Cartografia Social de Santos
          </h1>
        </div>

        {/* Versão Mobile - Menu Hambúrguer */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-green-800/50 transition-colors"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Links de Navegação e Logos - Versão Desktop */}
        <div className="hidden md:flex items-center">
          {/* Botão Ver Conteúdo/Voltar */}
          <button
            onClick={() => navigate(isConteudoPage ? '/' : '/conteudo')}
            className="px-4 py-2 text-sm font-medium text-white hover:text-green-100 transition-colors rounded-lg hover:bg-green-800"
          >
            {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
          </button>

          {/* Logo Unifesp */}
          <a 
            href="https://www.unifesp.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center mx-4"
          >
            <img
              src="/cartografiasocial/logo.png"
              alt="Logo da Unifesp"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <span className="text-[10px] sm:text-xs tracking-wide font-serif mt-0.5">
              Serviço Social
            </span>
          </a>

          {/* Área de Administração */}
          {!isAdmin ? (
            <button
              onClick={handleAdminClick}
              className="p-2 rounded-full hover:bg-green-800/50 transition-colors ml-2 group"
              aria-label="Configurações de administrador"
            >
              <Settings className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <div className="relative ml-2">
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-green-800/50 rounded-lg transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${showAdminPanel ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {showAdminPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
                  >
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                      Gerenciar Locais
                    </div>
                    <div className="py-1">
                      <AddLocationButton />
                      <button
                        onClick={() => navigate('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <line x1="3" y1="9" x2="21" y2="9"/>
                          <line x1="9" y1="21" x2="9" y2="9"/>
                        </svg>
                        Painel de Administração
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>

      {/* Menu Mobile Expandido */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-green-900/90 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <button
                onClick={() => handleNavigation(isConteudoPage ? '/' : '/conteudo')}
                className="w-full py-2 text-sm font-medium text-white text-center hover:bg-green-800/50 rounded-lg"
              >
                {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
              </button>
              
              <div className="flex items-center justify-center py-2">
                <a 
                  href="https://www.unifesp.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <img
                    src="/cartografiasocial/logo.png"
                    alt="Logo da Unifesp"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-[10px] tracking-wide font-serif mt-0.5 text-white">
                    Serviço Social
                  </span>
                </a>
              </div>
              
              {!isAdmin ? (
                <button
                  onClick={handleAdminClick}
                  className="w-full py-2 text-sm font-medium text-white text-center hover:bg-green-800/50 rounded-lg flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Área administrativa
                </button>
              ) : (
                <>
                  <div className="w-full py-2 px-4 text-sm font-medium text-white text-center border-t border-green-800">
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Acesso de Administrador
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 pb-2">
                    <AddLocationButton />
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-green-800/50 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                      </svg>
                      Painel de Administração
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;