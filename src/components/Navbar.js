import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddLocationButton from './AddLocationButton';
import { Leaf, ChevronDown, Shield, Menu, X, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminClick = () => {
    const enteredPassword = prompt("Digite a senha de administrador:");
    if (enteredPassword === process.env.REACT_APP_ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminPanel(false);
    }
  };

  const isConteudoPage = location.pathname === '/conteudo';
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-green-900/95 to-green-800/90 backdrop-blur-md text-white shadow-lg">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo e Título */}
        <div className="flex items-center space-x-3 group">
          <img
            src="/escolasindigenas/favicon.ico"
            alt="Ícone do mapa"
            className="h-7 sm:h-8 w-auto transform group-hover:scale-105 transition-transform duration-200"
            aria-label="Ícone do mapa"
          />
          <h1
            onClick={() => navigate('/')}
            className="text-base sm:text-lg md:text-2xl lg:text-3xl cursor-pointer truncate 
                      hover:text-amber-200 transition-colors duration-200 border-b-2 border-transparent 
                      hover:border-amber-400 font-[Caveat]"
          >
            Observatório das Escolas Indígenas
          </h1>
        </div>

        {/* Mobile - Botão */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-amber-800/50 transition-all duration-200 active:scale-95 
                      focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Menu principal"
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => navigate(isConteudoPage ? '/' : '/conteudo')}
            className="px-4 py-2 text-sm font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                       transition-all duration-200 rounded-lg hover:shadow-md active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
          </button>

          {/* Logo UNIFESP */}
          <a 
            href="https://www.unifesp.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center group transition-transform duration-200 hover:scale-105"
          >
            <img
              src="/escolasindigenas/logo.png"
              alt="Logo da Unifesp"
              className="h-8 sm:h-10 w-auto object-contain rounded-xl"
            />
            <span className="text-[10px] sm:text-xs tracking-wide font-[Caveat] text-amber-200 mt-0.5">
              Licenciatura Intercultural Indígena
            </span>
          </a>

          {/* Área de Administração */}
          {!isAdmin ? (
            <button
              onClick={handleAdminClick}
              className="p-2 rounded-full hover:bg-amber-800/50 transition-all duration-200 group
                       focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
              aria-label="Configurações de administrador"
            >
              <Leaf className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-200" />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white 
                         bg-green-800/60 hover:bg-amber-700/60 rounded-lg transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
                <motion.div
                  animate={{ rotate: showAdminPanel ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {showAdminPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  >
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                      Gerenciar Locais
                    </div>
                    <div className="py-1">
                      <AddLocationButton />
                      <button
                        onClick={() => navigate('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 
                                 transition-colors duration-200 flex items-center gap-2"
                      >
                        <LayoutGrid className="h-4 w-4" />
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

      {/* Mobile Expandido */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-gradient-to-b from-green-900/95 to-green-800/90 backdrop-blur-md border-t border-green-800/30"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation(isConteudoPage ? '/' : '/conteudo')}
                className="w-full py-2.5 text-sm font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                         rounded-lg transition-all duration-200 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
              </button>
              
              <div className="flex items-center justify-center py-2">
                <a 
                  href="https://www.unifesp.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center transform transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src="/escolasindigenas/logo.png"
                    alt="Logo da Unifesp"
                    className="h-8 w-auto object-contain rounded-xl"
                  />
                  <span className="text-[10px] tracking-wide font-[Caveat] text-amber-200 mt-0.5">
                    Licenciatura Intercultural Indígena
                  </span>
                </a>
              </div>
              
              {!isAdmin ? (
                <button
                  onClick={handleAdminClick}
                  className="w-full py-2.5 text-sm font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                           rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                           focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
                >
                  <Leaf className="w-4 h-4" />
                  Área administrativa
                </button>
              ) : (
                <>
                  <div className="w-full py-2 px-4 text-sm font-medium text-white/90 text-center border-t border-green-800/30">
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Acesso de Administrador
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <AddLocationButton />
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="w-full py-2.5 text-sm text-white bg-green-800/60 hover:bg-amber-700/60 
                               rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                               focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
                    >
                      <LayoutGrid className="h-4 w-4" />
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
