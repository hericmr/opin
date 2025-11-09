import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

/**
 * Serviço para gerenciar fotos dos professores
 * Usa o bucket 'avatar' do Supabase Storage
 */
export class FotoProfessorService {
  
  /**
   * Faz upload da foto do professor para o Supabase Storage
   * @param {File} arquivo - Arquivo da foto
   * @param {string} nomeProfessor - Nome do professor (para nomear o arquivo)
   * @param {number} escolaId - ID da escola
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  static async uploadFotoProfessor(arquivo, nomeProfessor, escolaId) {
    try {
      // Validar arquivo
      if (!arquivo) {
        throw new Error('Arquivo não fornecido');
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!tiposPermitidos.includes(arquivo.type)) {
        throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.');
      }

      // Validar tamanho (máximo 5MB)
      const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
      if (arquivo.size > tamanhoMaximo) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB');
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const extensao = arquivo.name.split('.').pop().toLowerCase();
      
      // Sanitizar nome do professor para evitar caracteres inválidos
      const nomeSanitizado = nomeProfessor
        .toLowerCase()
        .replace(/[áàâãä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòôõö]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '_') // Substitui espaços por underscore
        .substring(0, 50); // Limita tamanho
      
      const nomeArquivo = `${nomeSanitizado}_${timestamp}.${extensao}`;
      const caminhoArquivo = `${escolaId}/${nomeArquivo}`;

      // Validar se o nome do arquivo é válido
      if (!nomeArquivo || nomeArquivo.length === 0) {
        throw new Error('Nome do arquivo inválido gerado');
      }

      logger.debug('Upload da foto:', {
        nomeOriginal: arquivo.name,
        nomeSanitizado,
        nomeArquivo,
        caminhoArquivo,
        escolaId,
        nomeProfessor
      });

      // Fazer upload para o Supabase Storage
      const { error } = await supabase.storage
        .from('avatar')
        .upload(caminhoArquivo, arquivo, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatar')
        .getPublicUrl(caminhoArquivo);
      
      return {
        success: true,
        url: publicUrl,
        caminho: caminhoArquivo
      };

    } catch (error) {
      logger.error('Erro no upload da foto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza a URL da foto do professor na tabela historia_professor
   * @param {number} historiaId - ID da história do professor
   * @param {string} fotoUrl - URL da foto
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async atualizarFotoProfessor(historiaId, fotoUrl) {
    try {
      const { error } = await supabase
        .from('historias_professor')
        .update({ foto_rosto: fotoUrl })
        .eq('id', historiaId);

      if (error) {
        throw new Error(`Erro ao atualizar foto: ${error.message}`);
      }

      return { success: true };

    } catch (error) {
      logger.error('Erro ao atualizar foto do professor:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove a foto do professor do storage e atualiza a tabela
   * @param {string} caminhoArquivo - Caminho do arquivo no storage
   * @param {number} historiaId - ID da história do professor
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async removerFotoProfessor(caminhoArquivo, historiaId) {
    try {
      // Remover do storage
      const { error: storageError } = await supabase.storage
        .from('avatar')
        .remove([caminhoArquivo]);

      if (storageError) {
        logger.warn('Erro ao remover arquivo do storage:', storageError);
      }

      // Atualizar tabela (remover URL)
      const { error: dbError } = await supabase
        .from('historias_professor')
        .update({ foto_rosto: null })
        .eq('id', historiaId);

      if (dbError) {
        throw new Error(`Erro ao atualizar banco de dados: ${dbError.message}`);
      }

      return { success: true };

    } catch (error) {
      logger.error('Erro ao remover foto do professor:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca a foto do professor pela URL
   * @param {string} fotoUrl - URL da foto
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  static async buscarFotoProfessor(fotoUrl) {
    try {
      if (!fotoUrl) {
        return { success: false, error: 'URL da foto não fornecida' };
      }

      // Verificar se a URL é válida
      const urlValida = fotoUrl.startsWith('http') || fotoUrl.startsWith('data:');
      if (!urlValida) {
        return { success: false, error: 'URL da foto inválida' };
      }

      return {
        success: true,
        url: fotoUrl
      };

    } catch (error) {
      logger.error('Erro ao buscar foto do professor:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Lista todas as fotos de professores de uma escola
   * @param {number} escolaId - ID da escola
   * @returns {Promise<{success: boolean, fotos?: Array, error?: string}>}
   */
  static async listarFotosProfessores(escolaId) {
    try {
      const { data, error } = await supabase.storage
        .from('avatar')
        .list(`${escolaId}/`);

      if (error) {
        throw new Error(`Erro ao listar fotos: ${error.message}`);
      }

      // Gerar URLs públicas para cada arquivo
      const fotosComUrl = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('avatar')
          .getPublicUrl(`${escolaId}/${file.name}`);
        
        return {
          nome: file.name,
          url: publicUrl,
          tamanho: file.metadata?.size || 0,
          criadoEm: file.created_at
        };
      });

      return {
        success: true,
        fotos: fotosComUrl
      };

    } catch (error) {
      logger.error('Erro ao listar fotos dos professores:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Valida se uma imagem pode ser carregada
   * @param {string} url - URL da imagem
   * @returns {Promise<boolean>}
   */
  static async validarImagem(url) {
    return new Promise((resolve) => {
      if (!url) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}

export default FotoProfessorService;
