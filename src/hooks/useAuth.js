import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/authService';

/**
 * Hook para gerenciar autenticação
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiringSoon, setTokenExpiringSoon] = useState(false);

  // Verificar autenticação inicial
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        
        // Verificar se token está próximo do vencimento
        const expiringSoon = await AuthService.isTokenExpiringSoon();
        setTokenExpiringSoon(expiringSoon);
        
        // Tentar renovar token se necessário
        if (expiringSoon) {
          await AuthService.refreshTokenIfNeeded();
        }
      } else {
        setUser(null);
        setTokenExpiringSoon(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (password) => {
    try {
      const result = await AuthService.authenticate(password);
      
      if (result.success) {
        AuthService.setToken(result.token);
        setIsAuthenticated(true);
        setUser(result.user);
        setTokenExpiringSoon(false);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno de autenticação' };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setTokenExpiringSoon(false);
  }, []);

  // Verificar autenticação periodicamente
  useEffect(() => {
    checkAuth();
    
    // Verificar a cada 5 minutos
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAuth]);

  // Verificar expiração do token a cada minuto
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkExpiration = async () => {
      const expiringSoon = await AuthService.isTokenExpiringSoon();
      setTokenExpiringSoon(expiringSoon);
    };
    
    const interval = setInterval(checkExpiration, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    user,
    loading,
    tokenExpiringSoon,
    login,
    logout,
    checkAuth
  };
};
