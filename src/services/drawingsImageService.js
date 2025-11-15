import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

/**
 * Serviço para gerenciar imagens de desenhos das escolas
 */
export class DrawingsImageService {
  
  /**
   * Buscar imagens de desenhos de uma escola
   * @param {number} escolaId - ID da escola
   * @returns {Promise<string[]>} Array de URLs das imagens de desenhos
   */
  static async getDrawingsImages(escolaId) {
    try {
      const { data, error } = await supabase
        .from('escolas_completa')
        .select('imagens_desenhos')
        .eq('id', escolaId)
        .single();
      
      // Se a coluna não existir, retornar array vazio (migração não executada)
      if (error) {
        // Erro específico de coluna não encontrada
        if (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist')) {
          logger.warn('Coluna imagens_desenhos não existe. Execute a migração SQL primeiro.');
          return [];
        }
        throw error;
      }
      
      // Retornar array vazio se não houver imagens ou se for null
      if (!data?.imagens_desenhos) {
        return [];
      }
      
      // Se for string, tentar fazer parse JSON
      if (typeof data.imagens_desenhos === 'string') {
        try {
          return JSON.parse(data.imagens_desenhos);
        } catch {
          return [];
        }
      }
      
      // Se já for array, retornar diretamente
      return Array.isArray(data.imagens_desenhos) ? data.imagens_desenhos : [];
    } catch (err) {
      logger.error('Erro ao buscar imagens de desenhos:', err);
      // Retornar array vazio em caso de erro para não quebrar a aplicação
      return [];
    }
  }

  /**
   * Definir imagens de desenhos de uma escola
   * @param {number} escolaId - ID da escola
   * @param {string[]} imagensUrls - Array de URLs das imagens
   * @returns {Promise<void>}
   */
  static async setDrawingsImages(escolaId, imagensUrls) {
    try {
      // Garantir que é um array
      const urlsArray = Array.isArray(imagensUrls) ? imagensUrls : [];
      
      // Salvar como JSON string no banco
      const { error } = await supabase
        .from('escolas_completa')
        .update({ imagens_desenhos: JSON.stringify(urlsArray) })
        .eq('id', escolaId);
      
      // Se a coluna não existir, avisar mas não quebrar
      if (error) {
        if (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist')) {
          logger.error('Coluna imagens_desenhos não existe. Execute a migração SQL primeiro. Veja MIGRATION_DRAWINGS.md');
          throw new Error('Coluna imagens_desenhos não existe no banco de dados. Execute a migração SQL primeiro.');
        }
        throw error;
      }
    } catch (err) {
      logger.error('Erro ao definir imagens de desenhos:', err);
      throw err;
    }
  }

  /**
   * Adicionar uma imagem aos desenhos
   * @param {number} escolaId - ID da escola
   * @param {string} imagemUrl - URL da imagem
   * @returns {Promise<void>}
   */
  static async addDrawingImage(escolaId, imagemUrl) {
    try {
      const currentImages = await this.getDrawingsImages(escolaId);
      
      // Evitar duplicatas
      if (!currentImages.includes(imagemUrl)) {
        await this.setDrawingsImages(escolaId, [...currentImages, imagemUrl]);
      }
    } catch (err) {
      logger.error('Erro ao adicionar imagem aos desenhos:', err);
      throw err;
    }
  }

  /**
   * Remover uma imagem dos desenhos
   * @param {number} escolaId - ID da escola
   * @param {string} imagemUrl - URL da imagem
   * @returns {Promise<void>}
   */
  static async removeDrawingImage(escolaId, imagemUrl) {
    try {
      const currentImages = await this.getDrawingsImages(escolaId);
      const updatedImages = currentImages.filter(url => url !== imagemUrl);
      await this.setDrawingsImages(escolaId, updatedImages);
    } catch (err) {
      logger.error('Erro ao remover imagem dos desenhos:', err);
      throw err;
    }
  }

  /**
   * Remover todas as imagens de desenhos
   * @param {number} escolaId - ID da escola
   * @returns {Promise<void>}
   */
  static async clearDrawingsImages(escolaId) {
    try {
      const { error } = await supabase
        .from('escolas_completa')
        .update({ imagens_desenhos: null })
        .eq('id', escolaId);
      
      if (error) throw error;
    } catch (err) {
      logger.error('Erro ao limpar imagens de desenhos:', err);
      throw err;
    }
  }
}

