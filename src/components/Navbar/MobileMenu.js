import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, Leaf, Shield, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '../LazyImage';
import AddLocationButton from '../AddLocationButton';

const MobileMenu = ({ 
  mobileMenuOpen, 
  isConteudoPage, 
  isAdmin, 
  onAdminClick, 
  isMobileLandscape,
  onNavigation 
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden bg-gradient-to-b from-green-900/95 to-green-800/90 backdrop-blur-md border-t border-green-800/30"
        >
          <div className={`container mx-auto px-4 py-6 flex flex-col space-y-5 ${isMobileLandscape ? 'py-4 space-y-3' : ''}`}>
            
            {/* Botão principal de navegação */}
            <button
              onClick={() => onNavigation(isConteudoPage ? '/' : '/conteudo')}
              className={`w-full font-medium text-white bg-green-800/80 hover:bg-amber-700/80 
                       rounded-xl transition-all duration-200 active:scale-95 shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-400 touch-manipulation
                       flex items-center justify-center gap-3 ${
                         isMobileLandscape 
                           ? 'py-3 text-sm' 
                           : 'py-4 text-base'
                       }`}
            >
              {isConteudoPage ? <MapPin className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} /> : <BookOpen className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />}
              <span className={isMobileLandscape ? "text-sm" : "text-lg"}>
                {isConteudoPage ? 'Voltar ao Mapa' : 'Ver Todo Conteúdo'}
              </span>
            </button>
            
            {/* Logos organizadas horizontalmente */}
            <div className={`flex items-center justify-center space-x-6 py-4 bg-green-800/20 rounded-xl ${isMobileLandscape ? 'py-3 space-x-4' : ''}`}>
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
                <span className={`tracking-wide font-[Caveat] text-amber-200 text-center leading-tight ${isMobileLandscape ? 'text-xs' : 'text-xs'}`}>
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
            
            {/* Área administrativa */}
            {!isAdmin ? (
              <button
                onClick={onAdminClick}
                className={`w-full font-medium text-white bg-green-800/60 hover:bg-amber-700/60 
                         rounded-xl transition-all duration-200 flex items-center justify-center gap-3
                         focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95 touch-manipulation ${
                           isMobileLandscape 
                             ? 'py-3 text-sm' 
                             : 'py-4 text-base'
                         }`}
              >
                <Leaf className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                <span>Área Administrativa</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`w-full px-4 font-medium text-white/90 text-center 
                              border-2 border-amber-400/50 rounded-xl bg-green-800/30 ${
                                isMobileLandscape ? 'py-2 text-sm' : 'py-3 text-base'
                              }`}>
                  <span className="flex items-center justify-center gap-2">
                    <Shield className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                    <span>Acesso de Administrador</span>
                  </span>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <div className="w-full">
                    <AddLocationButton />
                  </div>
                  <button
                    onClick={() => onNavigation('/admin')}
                    className={`w-full text-white bg-green-800/60 hover:bg-amber-700/60 
                             rounded-xl transition-all duration-200 flex items-center justify-center gap-3
                             focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95 touch-manipulation ${
                               isMobileLandscape 
                                 ? 'py-3 text-sm' 
                                 : 'py-4 text-base'
                             }`}
                  >
                    <LayoutGrid className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                    <span>Painel de Administração</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 