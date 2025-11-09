import { supabase } from '../supabaseClient';
import { AuthService } from './authService';

/**
 * Serviço para gerenciar versionamento de metadados
 */
export class VersionamentoService {
  
  /**
   * Obter o autor atual (usuário autenticado)
   * @returns {Promise<string|null>} Nome do usuário ou null se não autenticado
   */
  static async obterAutorAtual() {
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        return null;
      }
      
      const currentUser = await AuthService.getCurrentUser();
      return currentUser?.username || 'admin';
    } catch (error) {
      console.warn('Erro ao obter autor atual:', error);
      return null;
    }
  }

  /**
   * Registrar uma nova versão de dados
   * @param {Object} params - Parâmetros da versão
   * @param {string} params.nomeTabela - Nome da tabela onde ocorreu a alteração
   * @param {string} params.chaveLinha - Chave primária da linha afetada (convertida para string)
   * @param {string|null} params.fonteId - ID da fonte de dados (opcional)
   * @param {string|null} params.autor - Nome do autor (opcional, será obtido automaticamente se não fornecido)
   * @param {string|null} params.observacoes - Observações sobre a alteração (opcional)
   * @returns {Promise<Object>} Resultado da operação { success: boolean, data?: Object, error?: string }
   */
  static async registrarVersaoDados({
    nomeTabela,
    chaveLinha,
    fonteId = null,
    autor = null,
    observacoes = null
  }) {
    try {
      // Validar parâmetros obrigatórios
      if (!nomeTabela || nomeTabela.trim() === '') {
        throw new Error('nomeTabela é obrigatório');
      }
      
      if (!chaveLinha || chaveLinha.toString().trim() === '') {
        throw new Error('chaveLinha é obrigatório');
      }

      // Obter autor se não fornecido
      let autorFinal = autor;
      if (!autorFinal) {
        autorFinal = await this.obterAutorAtual();
      }

      // Preparar dados para inserção
      const dadosVersao = {
        nome_tabela: nomeTabela.trim(),
        chave_linha: chaveLinha.toString().trim(),
        autor: autorFinal,
        criado_em: new Date().toISOString()
      };

      // Adicionar campos opcionais se fornecidos
      if (fonteId) {
        dadosVersao.fonte_id = fonteId;
      }

      if (observacoes && observacoes.trim() !== '') {
        dadosVersao.observacoes = observacoes.trim();
      }

      // Inserir registro de versão
      const { data, error } = await supabase
        .from('versoes_dados')
        .insert(dadosVersao)
        .select()
        .single();

      if (error) {
        console.error('Erro ao registrar versão de dados:', error);
        throw error;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro no serviço de versionamento:', error);
      return {
        success: false,
        error: error.message || 'Erro ao registrar versão de dados'
      };
    }
  }

  /**
   * Buscar todas as fontes de dados disponíveis
   * @returns {Promise<Object>} Resultado com lista de fontes
   */
  static async buscarFontesDados() {
    try {
      const { data, error } = await supabase
        .from('fontes_dados')
        .select('id, nome, descricao')
        .order('nome', { ascending: true });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Erro ao buscar fontes de dados:', error);
      return {
        success: false,
        error: error.message || 'Erro ao buscar fontes de dados',
        data: []
      };
    }
  }

  /**
   * Buscar histórico de versões para uma linha específica
   * @param {string} nomeTabela - Nome da tabela
   * @param {string} chaveLinha - Chave primária da linha
   * @returns {Promise<Object>} Resultado com lista de versões
   */
  static async buscarVersoesPorLinha(nomeTabela, chaveLinha) {
    try {
      const { data, error } = await supabase
        .from('versoes_dados')
        .select(`
          id,
          nome_tabela,
          chave_linha,
          autor,
          observacoes,
          criado_em,
          fonte_id,
          fontes_dados:nome,
          fontes_dados:descricao
        `)
        .eq('nome_tabela', nomeTabela)
        .eq('chave_linha', chaveLinha.toString())
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Erro ao buscar versões:', error);
      return {
        success: false,
        error: error.message || 'Erro ao buscar versões',
        data: []
      };
    }
  }
}

