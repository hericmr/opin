import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalAdminShortcut } from '../hooks/useGlobalAdminShortcut';
import MinimalLoginModal from './Auth/MinimalLoginModal';

/**
 * Componente global que gerencia o atalho Ctrl+Shift+A para acesso administrativo
 * Deve ser adicionado no nível raiz da aplicação (App.js) para funcionar em todas as páginas
 */
const GlobalAdminShortcut = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Usar o hook para gerenciar o atalho de teclado
  useGlobalAdminShortcut(() => {
    setShowLoginModal(true);
  });

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
    navigate('/admin');
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <MinimalLoginModal
      isOpen={showLoginModal}
      onClose={handleCloseModal}
      onSuccess={handleLoginSuccess}
    />
  );
};

export default GlobalAdminShortcut;

