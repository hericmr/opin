import { supabase } from '../supabaseClient';

export const uploadFile = async (file, bucket = 'media') => {
  try {
    // Gera um nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Obtém a URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  return uploadFile(file, 'images');
};

export const uploadAudio = async (file) => {
  return uploadFile(file, 'audio');
}; 