import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddLocationButton from './AddLocationButton';
import { Leaf, ChevronDown, Shield, Menu, X, LayoutGrid, MapPin, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';

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
      <nav className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Logo e Título - Otimizado para mobile */}
        <div className="flex items-center space-x-2 group flex-1 min-w-0">
          <h1
            onClick={() => navigate('/')}
            className="text-sm sm:text-base md:text-lg lg:text-2xl cursor-pointer 
                      hover:text-amber-200 transition-colors duration-200 border-b-2 border-transparent 
                      hover:border-amber-400 font-[Caveat] truncate leading-tight"
          >
            Observatório das Escolas Indígenas
          </h1>
        </div>

        {/* Mobile - Botão hambúrguer maior para facilitar o toque */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-3 rounded-full hover:bg-amber-800/50 transition-all duration-200 active:scale-95 
                      focus:outline-none focus:ring-2 focus:ring-amber-400 touch-manipulation"
            aria-label="Menu principal"
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.div>
          </button>
        </div>

        {/* Desktop - Layout compacto */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <button
            onClick={() => navigate(isConteudoPage ? '/' : '/conteudo')}
            className="px-3 lg:px-4 py-2 text-sm font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                       transition-all duration-200 rounded-lg hover:shadow-md active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-amber-400 flex items-center gap-2"
          >
            {isConteudoPage ? <MapPin className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            <span className="hidden lg:inline">
              {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
            </span>
            <span className="lg:hidden">
              {isConteudoPage ? 'Mapa' : 'Conteúdo'}
            </span>
          </button>

          {/* Logos UNIFESP - Compactas no desktop */}
          <div className="flex items-center space-x-3">
            <a 
              href="https://www.unifesp.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center group transition-transform duration-200 hover:scale-105"
            >
              <LazyImage
                src={`${process.env.PUBLIC_URL}/logo.webp`}
                alt="Logo"
                className="h-8 w-auto"
              />
              <span className="text-[8px] lg:text-[10px] tracking-wide font-[Caveat] text-amber-200 mt-0.5 text-center leading-tight">
                é terra indígena!
              </span>
            </a>
            <a href="https://www.unifesp.br/lindi" target="_blank" rel="noopener noreferrer" className="group">
              <LazyImage
                src={`${process.env.PUBLIC_URL}/lindi.webp`}
                alt="LINDI"
                className="h-8 w-auto"
              />
            </a>
          </div>

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
                <span className="hidden lg:inline">Admin</span>
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

      {/* Mobile Menu - Otimizado para toque e legibilidade */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-gradient-to-b from-green-900/95 to-green-800/90 backdrop-blur-md border-t border-green-800/30"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-5">
              
              {/* Botão principal de navegação - Maior e mais visível */}
              <button
                onClick={() => handleNavigation(isConteudoPage ? '/' : '/conteudo')}
                className="w-full py-4 text-base font-medium text-white bg-green-800/80 hover:bg-amber-700/80 
                         rounded-xl transition-all duration-200 active:scale-95 shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-amber-400 touch-manipulation
                         flex items-center justify-center gap-3"
              >
                {isConteudoPage ? <MapPin className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                <span className="text-lg">
                  {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
                </span>
              </button>
              
              {/* Logos organizadas horizontalmente no mobile */}
              <div className="flex items-center justify-center space-x-6 py-4 bg-green-800/20 rounded-xl">
                <a 
                  href="https://www.unifesp.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center transform transition-transform duration-200 hover:scale-105 touch-manipulation"
                >
                  <LazyImage
                    src={`${process.env.PUBLIC_URL}/logo.webp`}
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-xs tracking-wide font-[Caveat] text-amber-200 text-center leading-tight">
                    Licenciatura<br />Intercultural Indígena
                  </span>
                </a>
                
                <a 
                  href="https://www.unifesp.br/lindi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transform transition-transform duration-200 hover:scale-105 touch-manipulation"
                >
                  <LazyImage
                    src={`${process.env.PUBLIC_URL}/lindi.webp`}
                    alt="LINDI"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
              
              {/* Área administrativa - Botões maiores e mais acessíveis */}
              {!isAdmin ? (
                <button
                  onClick={handleAdminClick}
                  className="w-full py-4 text-base font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                           rounded-xl transition-all duration-200 flex items-center justify-center gap-3
                           focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95 touch-manipulation"
                >
                  <Leaf className="w-5 h-5" />
                  <span>Área Administrativa</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="w-full py-3 px-4 text-base font-medium text-white/90 text-center 
                                border-2 border-amber-400/50 rounded-xl bg-green-800/30">
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span>Acesso de Administrador</span>
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="w-full">
                      <AddLocationButton />
                    </div>
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="w-full py-4 text-base text-white bg-green-800/60 hover:bg-amber-700/60 
                               rounded-xl transition-all duration-200 flex items-center justify-center gap-3
                               focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95 touch-manipulation"
                    >
                      <LayoutGrid className="h-5 w-5" />
                      <span>Painel de Administração</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;