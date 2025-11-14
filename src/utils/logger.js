/**
 * Utilitário de logging para o projeto OPIN
 * 
 * Fornece uma API consistente para logging que pode ser desabilitada em produção.
 * Substitui console.log direto por uma solução mais controlada.
 * 
 * @module utils/logger
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Níveis de log disponíveis
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * Configuração de logging
 * Pode ser alterada para controlar quais logs são exibidos
 */
const LOG_LEVEL = isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR;

/**
 * Logger principal do sistema
 * 
 * @example
 * import logger from '../utils/logger';
 * 
 * logger.debug('Informação de debug');
 * logger.info('Informação geral');
 * logger.warn('Aviso');
 * logger.error('Erro crítico');
 */
export const logger = {
  /**
   * Log de debug - apenas em desenvolvimento
   * @param {...any} args - Argumentos a serem logados
   */
  debug: (...args) => {
    if (LOG_LEVEL <= LogLevel.DEBUG) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Log de informação - apenas em desenvolvimento
   * @param {...any} args - Argumentos a serem logados
   */
  info: (...args) => {
    if (LOG_LEVEL <= LogLevel.INFO) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log de aviso - sempre exibido (mas pode ser filtrado)
   * @param {...any} args - Argumentos a serem logados
   */
  warn: (...args) => {
    if (LOG_LEVEL <= LogLevel.WARN) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log de erro - sempre exibido
   * @param {...any} args - Argumentos a serem logados
   */
  error: (...args) => {
    if (LOG_LEVEL <= LogLevel.ERROR) {
      console.error('[ERROR]', ...args);
    }
  },

  /**
   * Grupo de logs - útil para organizar logs relacionados
   * @param {string} label - Label do grupo
   */
  group: (label) => {
    if (LOG_LEVEL <= LogLevel.DEBUG) {
      console.group(label);
    }
  },

  /**
   * Fecha um grupo de logs
   */
  groupEnd: () => {
    if (LOG_LEVEL <= LogLevel.DEBUG) {
      console.groupEnd();
    }
  },
};

export default logger;
























