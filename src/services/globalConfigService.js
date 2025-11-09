import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

/**
 * Serviço para gerenciar configurações globais do sistema
 */
export class GlobalConfigService {
  /**
   * Obter configuração global de visibilidade de cards
   * @returns {Promise<Object|null>} Configuração de visibilidade ou null se não encontrada
   */
  static async getGlobalCardsVisibility() {
    try {
      const { data, error } = await supabase
        .from('configuracao_global')
        .select('valor')
        .eq('chave', 'cards_visibilidade_global')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Não encontrado - retornar null para usar padrões
          return null;
        }
        throw error;
      }

      return data?.valor || null;
    } catch (error) {
      logger.error('Erro ao buscar configuração global de visibilidade:', error);
      return null;
    }
  }

  /**
   * Salvar configuração global de visibilidade de cards
   * @param {Object} visibilityConfig - Configuração de visibilidade
   * @returns {Promise<Object>} Resultado da operação
   */
  static async saveGlobalCardsVisibility(visibilityConfig) {
    try {
      const { data, error } = await supabase
        .from('configuracao_global')
        .upsert({
          chave: 'cards_visibilidade_global',
          valor: visibilityConfig,
          descricao: 'Configuração padrão de visibilidade de cards para todas as escolas',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'chave'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      logger.error('Erro ao salvar configuração global de visibilidade:', error);
      return {
        success: false,
        error: error.message || 'Erro ao salvar configuração global'
      };
    }
  }
}

