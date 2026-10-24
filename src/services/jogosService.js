import { supabase } from '../dbClient';
import logger from '../utils/logger';
import professores from '../data/professores.json';

class JogosService {
  constructor() {
    this.jogosCache = null;
  }

  /**
   * Carrega todos os jogos do JSON estático
   * @returns {Promise<Array>} Lista de todos os jogos
   */
  async getTodosOsJogos() {
    if (this.jogosCache) return this.jogosCache;

    try {
      const response = await fetch('/jogos_arquivos/todos_os_jogos.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const jogos = await response.json();
      
      const normalizar = (str) => {
        if (!str) return '';
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
      };

      // Anexar o autor aos jogos
      const jogosComAutor = jogos.map(jogo => {
        const autoresStr = (jogo.titulo_autores_cabecalho || []).join(' ');
        let matchProfessor = null;
        
        for (const prof of professores) {
          if (prof.nome) {
            const parts = prof.nome.split(' ').filter(p => p.length > 2);
            let matchCount = 0;
            for (const p of parts) {
              if (normalizar(autoresStr).includes(normalizar(p))) {
                matchCount++;
              }
            }
            if (matchCount >= parts.length - 1 && parts.length > 1) {
              matchProfessor = prof;
              break;
            }
          }
        }
        
        return {
          ...jogo,
          autorEncontrado: matchProfessor ? matchProfessor.nome : null
        };
      });

      this.jogosCache = jogosComAutor;
      return jogosComAutor;
    } catch (error) {
      logger.error('Erro ao carregar todos_os_jogos.json:', error);
      return [];
    }
  }

  /**
   * Busca os jogos associados a uma escola
   * @param {number} escolaId 
   * @returns {Promise<Array>} Lista de objetos { id, jogo_global_id }
   */
  async getJogosPorEscola(escolaId) {
    try {
      const { data, error } = await supabase
        .from('escola_jogos')
        .select('id, jogo_global_id')
        .eq('escola_id', escolaId);

      if (error) {
        throw error;
      }
      return data || [];
    } catch (error) {
      logger.error('Erro ao buscar jogos da escola:', error);
      return [];
    }
  }

  /**
   * Adiciona a associação de um jogo a uma escola
   * @param {number} escolaId 
   * @param {string} jogoGlobalId 
   * @returns {Promise<Object>} 
   */
  async adicionarJogoEscola(escolaId, jogoGlobalId) {
    try {
      const { data, error } = await supabase
        .from('escola_jogos')
        .insert([{ escola_id: escolaId, jogo_global_id: jogoGlobalId }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      logger.error('Erro ao adicionar jogo à escola:', error);
      throw error;
    }
  }

  /**
   * Remove a associação de um jogo com uma escola
   * @param {number} escolaId 
   * @param {string} jogoGlobalId 
   */
  async removerJogoEscola(escolaId, jogoGlobalId) {
    try {
      const { error } = await supabase
        .from('escola_jogos')
        .delete()
        .eq('escola_id', escolaId)
        .eq('jogo_global_id', jogoGlobalId);

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Erro ao remover jogo da escola:', error);
      throw error;
    }
  }

  /**
   * Retorna os dados completos dos jogos vinculados a uma escola
   * @param {number} escolaId 
   * @returns {Promise<Array>}
   */
  async getJogosCompletosPorEscola(escolaId) {
    const jogosVinculados = await this.getJogosPorEscola(escolaId);
    if (!jogosVinculados || jogosVinculados.length === 0) return [];

    const todosOsJogos = await this.getTodosOsJogos();
    
    // Mapear os ids vinculados para os objetos completos do JSON
    const vinculadosMap = new Set(jogosVinculados.map(j => j.jogo_global_id));
    
    return todosOsJogos.filter(jogo => vinculadosMap.has(jogo.global_id));
  }
}

const jogosService = new JogosService();
export default jogosService;
