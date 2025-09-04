import React from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Leaf, Shield, LayoutGrid, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenu = ({ 
  mobileMenuOpen, 
  isConteudoPage, 
  isSearchPage,
  isAdminPage,
  isAdmin, 
  onAdminClick, 
  isMobileLandscape,
  onNavigation 
}) => {
  const location = useLocation();

  const getActiveStyle = (isActive) => 
    isActive 
      ? 'bg-amber-600 text-white' 
      : 'text-white hover:bg-[#215A36]';

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden bg-[#1a4a2d] border-t border-[#215A36]"
        >
          <div className={`container mx-auto px-4 py-4 ${isMobileLandscape ? 'py-3' : ''}`}>
            
            {/* Navegação Principal */}
            <div className="space-y-2 mb-6">
              <h3 className={`text-amber-200 font-semibold ${isMobileLandscape ? 'text-sm' : 'text-base'} mb-3`}>
                Navegação
              </h3>
              
              <button
                onClick={() => onNavigation('/')}
                className={`w-full text-left px-4 py-3 font-medium rounded transition-colors ${getActiveStyle(location.pathname === '/')}`}
              >
                <div className="flex items-center gap-3">
                  <Map className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                  <span>Mapa das Escolas</span>
                </div>
              </button>
              
              <button
                onClick={() => onNavigation('/conteudo')}
                className={`w-full text-left px-4 py-3 font-medium rounded transition-colors ${getActiveStyle(isConteudoPage)}`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                  <span>Materiais Didáticos</span>
                </div>
              </button>
            </div>
            
            {/* Área Administrativa */}
            <div className="space-y-2">
              <h3 className={`text-amber-200 font-semibold ${isMobileLandscape ? 'text-sm' : 'text-base'} mb-3`}>
                Administração
              </h3>
              
              {!isAdmin ? (
                <button
                  onClick={onAdminClick}
                  className="w-full text-left px-4 py-3 font-medium text-white hover:bg-[#215A36] rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Leaf className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                    <span>Acesso Administrativo</span>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="px-4 py-3 bg-[#215A36]/30 border border-amber-400/50 rounded text-center">
                    <div className="flex items-center justify-center gap-2 text-white/90">
                      <Shield className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                      <span className="text-sm">Acesso de Administrador Ativo</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onNavigation('/admin')}
                    className={`w-full text-left px-4 py-3 font-medium rounded transition-colors ${getActiveStyle(isAdminPage)}`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutGrid className={isMobileLandscape ? "w-4 h-4" : "w-5 h-5"} />
                      <span>Gerenciar Conteúdo</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 