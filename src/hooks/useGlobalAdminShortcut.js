import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook para gerenciar o atalho global Ctrl+Shift+A para acesso administrativo
 * Funciona de qualquer página da aplicação
 */
export const useGlobalAdminShortcut = (onOpenLoginModal) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Verificar se é Ctrl+Shift+A (ou Cmd+Shift+A no Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        // Prevenir comportamento padrão
        e.preventDefault();
        
        // Evitar conflito quando usuário está digitando em campos de input
        const target = e.target;
        const isInputField = target.tagName === 'INPUT' || 
                            target.tagName === 'TEXTAREA' || 
                            target.isContentEditable;
        
        // Se estiver em um campo de input, não fazer nada (evitar abrir modal acidentalmente)
        if (isInputField) {
          return;
        }

        // Se já estiver autenticado, navegar para o painel admin
        if (isAuthenticated) {
          navigate('/admin');
        } else {
          // Se não estiver autenticado, abrir modal de login
          if (onOpenLoginModal) {
            onOpenLoginModal();
          }
        }
      }
    };

    // Adicionar listener global
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated, navigate, onOpenLoginModal]);
};

