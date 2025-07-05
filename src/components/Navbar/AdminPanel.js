import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Shield } from 'lucide-react';

const AdminPanel = ({ isAdmin, onAdminClick, isMobileLandscape }) => {
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <button
        onClick={onAdminClick}
        className="p-2 rounded-full hover:bg-amber-800/50 transition-all duration-200 group
                 focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
        aria-label="Acesso administrativo"
        title="Acesso administrativo"
      >
        <Leaf className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-200" />
      </button>
    );
  }

  // Botão direto para o painel admin
  return (
    <button
      onClick={() => navigate('/admin')}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white 
               bg-green-800/60 hover:bg-amber-700/60 rounded-lg transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95"
      aria-label="Painel administrativo"
    >
      <Shield className="w-5 h-5" />
      <span className="hidden xl:inline">Administração</span>
    </button>
  );
};

export default AdminPanel; 