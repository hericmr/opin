import { SignJWT, jwtVerify } from 'jose';
import logger from '../utils/logger';

// Chave secreta para assinar os JWTs (em produção, deve vir de variável de ambiente)
const JWT_SECRET = new TextEncoder().encode(
  import.meta.env.REACT_APP_JWT_SECRET || import.meta.env.VITE_JWT_SECRET || 'opin-admin-secret-key-2024'
);

// Configurações do JWT
const JWT_CONFIG = {
  issuer: 'opin-admin',
  audience: 'opin-users',
  expiresIn: '24h' // Token expira em 24 horas
};

/**
 * Serviço de autenticação seguro usando JWT
 */
export class AuthService {
  
  /**
   * Gerar token JWT após autenticação bem-sucedida
   * @param {string} username - Nome do usuário
   * @param {string} role - Papel do usuário (admin, editor, etc.)
   * @returns {Promise<string>} Token JWT
   */
  static async generateToken(username, role = 'admin') {
    try {
      const token = await new SignJWT({ 
        username, 
        role,
        loginTime: Date.now()
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_CONFIG.expiresIn)
        .setIssuer(JWT_CONFIG.issuer)
        .setAudience(JWT_CONFIG.audience)
        .sign(JWT_SECRET);

      return token;
    } catch (error) {
      logger.error('Erro ao gerar token JWT:', error);
      throw new Error('Falha na geração do token de autenticação');
    }
  }

  /**
   * Verificar e decodificar token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<Object|null>} Payload do token ou null se inválido
   */
  static async verifyToken(token) {
    try {
      if (!token) return null;

      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience,
      });

      return payload;
    } catch (error) {
      logger.warn('Token JWT inválido ou expirado:', error.message);
      return null;
    }
  }

  /**
   * Autenticar usuário com senha
   * @param {string} password - Senha fornecida
   * @returns {Promise<Object>} Resultado da autenticação
   */
  static async authenticate(password) {
    try {
      // Verificar senha (em produção, usar hash + salt)
      const validPassword = import.meta.env.REACT_APP_ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
      
      // Debug: remover espaços em branco e comparar
      const trimmedPassword = password?.trim();
      const trimmedValidPassword = validPassword?.trim();
      
      // Log para debug (apenas em desenvolvimento)
      logger.debug('Debug auth - Password recebida:', `"${trimmedPassword}"`, 'Length:', trimmedPassword?.length);
      logger.debug('Debug auth - Password esperada:', `"${trimmedValidPassword}"`, 'Length:', trimmedValidPassword?.length);
      logger.debug('Debug auth - REACT_APP_ADMIN_PASSWORD definida?', !!(import.meta.env.REACT_APP_ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSWORD));
      
      if (trimmedPassword !== trimmedValidPassword) {
        return {
          success: false,
          error: 'Senha incorreta'
        };
      }

      // Gerar token se senha estiver correta
      const token = await this.generateToken('admin', 'admin');
      
      return {
        success: true,
        token,
        user: {
          username: 'admin',
          role: 'admin'
        }
      };
    } catch (error) {
      logger.error('Erro na autenticação:', error);
      return {
        success: false,
        error: 'Erro interno de autenticação'
      };
    }
  }

  /**
   * Verificar se usuário está autenticado
   * @returns {Promise<boolean>} True se autenticado
   */
  static async isAuthenticated() {
    try {
      const token = localStorage.getItem('opin_admin_token');
      const payload = await this.verifyToken(token);
      
      if (payload) {
        // Verificar se token não expirou
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      }
      
      return false;
    } catch (error) {
      logger.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  /**
   * Obter informações do usuário autenticado
   * @returns {Promise<Object|null>} Dados do usuário ou null
   */
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('opin_admin_token');
      const payload = await this.verifyToken(token);
      
      if (payload) {
        return {
          username: payload.username,
          role: payload.role,
          loginTime: payload.loginTime
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  /**
   * Fazer logout (remover token)
   */
  static logout() {
    localStorage.removeItem('opin_admin_token');
    // Redirecionar para página inicial (respeitando o basename)
    const basename = '/opin';
    window.location.href = `${basename}/`;
  }

  /**
   * Armazenar token no localStorage
   * @param {string} token - Token JWT
   */
  static setToken(token) {
    localStorage.setItem('opin_admin_token', token);
  }

  /**
   * Obter token do localStorage
   * @returns {string|null} Token ou null
   */
  static getToken() {
    return localStorage.getItem('opin_admin_token');
  }

  /**
   * Verificar se token está próximo do vencimento (últimas 2 horas)
   * @returns {Promise<boolean>} True se próximo do vencimento
   */
  static async isTokenExpiringSoon() {
    try {
      const token = this.getToken();
      const payload = await this.verifyToken(token);
      
      if (payload) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;
        const twoHours = 2 * 60 * 60; // 2 horas em segundos
        
        return timeUntilExpiry < twoHours;
      }
      
      return false;
    } catch (error) {
      logger.error('Erro ao verificar expiração do token:', error);
      return false;
    }
  }

  /**
   * Renovar token se necessário
   * @returns {Promise<string|null>} Novo token ou null
   */
  static async refreshTokenIfNeeded() {
    try {
      const isExpiringSoon = await this.isTokenExpiringSoon();
      
      if (isExpiringSoon) {
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
          const newToken = await this.generateToken(currentUser.username, currentUser.role);
          this.setToken(newToken);
          return newToken;
        }
      }
      
      return null;
    } catch (error) {
      logger.error('Erro ao renovar token:', error);
      return null;
    }
  }
}
