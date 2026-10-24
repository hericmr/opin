import logger from '../utils/logger';
import { supabase } from '../dbClient';
import { ADMIN_TOKEN_KEY, ADMIN_TOKEN_EVENT, getAdminTokenPayload } from '../utils/adminToken';

/**
 * Autenticação do admin.
 * A senha é conferida no servidor (função SQL public.login, via PostgREST),
 * que devolve um JWT assinado com "admin": true. Sem esse token o PostgREST
 * (privado.verificar_jwt) e o storage só permitem leitura.
 */
export class AuthService {

  /**
   * Autenticar usuário com senha
   * @param {string} password - Senha fornecida
   * @returns {Promise<Object>} Resultado da autenticação
   */
  static async authenticate(password) {
    const senha = password?.trim();
    if (!senha) {
      return { success: false, error: 'Senha incorreta' };
    }

    const { data, error } = await supabase.rpc('login', { senha });

    if (error) {
      if (error.code === '28P01') {
        return { success: false, error: 'Senha incorreta' };
      }
      logger.error('Erro na autenticação:', error);
      return { success: false, error: 'Erro interno de autenticação' };
    }

    return {
      success: true,
      token: data.token,
      user: {
        username: data.username,
        role: data.role
      }
    };
  }

  /**
   * Verificar se usuário está autenticado
   * @returns {Promise<boolean>} True se autenticado
   */
  static async isAuthenticated() {
    return !!getAdminTokenPayload();
  }

  /**
   * Obter informações do usuário autenticado
   * @returns {Promise<Object|null>} Dados do usuário ou null
   */
  static async getCurrentUser() {
    const payload = getAdminTokenPayload();
    if (!payload) return null;

    return {
      username: payload.username,
      role: payload.role,
      loginTime: payload.iat ? payload.iat * 1000 : null
    };
  }

  /**
   * Fazer logout (remover token)
   */
  static logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    // Redirecionar para página inicial (respeitando o basename)
    window.location.href = '/';
  }

  /**
   * Armazenar token no localStorage
   * @param {string} token - Token
   */
  static setToken(token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    window.dispatchEvent(new Event(ADMIN_TOKEN_EVENT));
  }

  /**
   * Obter token do localStorage
   * @returns {string|null} Token ou null
   */
  static getToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }

  /**
   * Verificar se token está próximo do vencimento (últimas 2 horas)
   * @returns {Promise<boolean>} True se próximo do vencimento
   */
  static async isTokenExpiringSoon() {
    const payload = getAdminTokenPayload();
    if (!payload) return false;

    const twoHours = 2 * 60 * 60 * 1000;
    return payload.exp * 1000 - Date.now() < twoHours;
  }
}
