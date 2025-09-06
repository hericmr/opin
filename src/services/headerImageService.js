import { supabase } from '../supabaseClient';

/**
 * Serviço para gerenciar imagens de header das escolas
 */
export class HeaderImageService {
  
  /**
   * Buscar imagem atual do header de uma escola
   * @param {number} escolaId - ID da escola
   * @returns {Promise<string|null>} URL da imagem do header ou null
   */
  static async getImagemHeader(escolaId) {
    try {
      const { data, error } = await supabase
        .from('escolas_completa')
        .select('imagem_header')
        .eq('id', escolaId)
        .single();
      
      if (error) throw error;
      return data?.imagem_header || null;
    } catch (err) {
      console.error('Erro ao buscar imagem do header:', err);
      throw err;
    }
  }

  /**
   * Definir imagem como header de uma escola
   * @param {number} escolaId - ID da escola
   * @param {string} imagemUrl - URL da imagem
   * @returns {Promise<void>}
   */
  static async setImagemHeader(escolaId, imagemUrl) {
    try {
      const { error } = await supabase
        .from('escolas_completa')
        .update({ imagem_header: imagemUrl })
        .eq('id', escolaId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao definir imagem do header:', err);
      throw err;
    }
  }

  /**
   * Remover imagem do header de uma escola
   * @param {number} escolaId - ID da escola
   * @returns {Promise<void>}
   */
  static async removeImagemHeader(escolaId) {
    try {
      const { error } = await supabase
        .from('escolas_completa')
        .update({ imagem_header: null })
        .eq('id', escolaId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao remover imagem do header:', err);
      throw err;
    }
  }
}
