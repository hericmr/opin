import logger from '../utils/logger';

// Configurações do Token
const TOKEN_CONFIG = {
  expiresIn: 24 * 60 * 60 * 1000 // 24 horas em milissegundos
};

/**
 * Serviço de autenticação simplificado (sem JWT)
 */
export class AuthService {

  /**
   * Gerar token simples (Base64) após autenticação bem-sucedida
   * @param {string} username - Nome do usuário
   * @param {string} role - Papel do usuário (admin, editor, etc.)
   * @returns {Promise<string>} Token
   */
  static async generateToken(username, role = 'admin') {
    try {
      const payload = {
        username,
        role,
        loginTime: Date.now(),
        exp: Date.now() + TOKEN_CONFIG.expiresIn
      };

      // Codificar em Base64 simples para persistência local
      return btoa(JSON.stringify(payload));
    } catch (error) {
      logger.error('Erro ao gerar token:', error);
      throw new Error('Falha na geração do token de autenticação');
    }
  }

  /**
   * Verificar e decodificar token
   * @param {string} token - Token
   * @returns {Promise<Object|null>} Payload do token ou null se inválido
   */
  static async verifyToken(token) {
    try {
      if (!token) return null;

      // Decodificar Base64
      const payload = JSON.parse(atob(token));

      // Verificar expiração
      if (payload.exp < Date.now()) {
        return null;
      }

      return payload;
    } catch (error) {
      // Silenciosamente falhar para tokens inválidos (sem log de aviso)
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
      return !!payload;
    } catch (error) {
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
   * @param {string} token - Token
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
        const now = Date.now();
        const timeUntilExpiry = payload.exp - now;
        const twoHours = 2 * 60 * 60 * 1000; // 2 horas em ms

        return timeUntilExpiry < twoHours;
      }

      return false;
    } catch (error) {
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
      return null;
    }
  }
}
