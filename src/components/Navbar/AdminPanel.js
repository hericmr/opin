import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ChevronDown, Shield, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddLocationButton from '../AddLocationButton';

const AdminPanel = ({ isAdmin, onAdminClick, isMobileLandscape }) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <button
        onClick={onAdminClick}
        className="p-2 rounded-full hover:bg-amber-800/50 transition-all duration-200 group
                 focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
        aria-label="Configurações de administrador"
      >
        <Leaf className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-200" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowAdminPanel(!showAdminPanel)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white 
                 bg-green-800/60 hover:bg-amber-700/60 rounded-lg transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden xl:inline">Admin</span>
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
  );
};

export default AdminPanel; 