import { supabase } from '../dbClient';

// Buscar todos os vídeos de uma escola
export async function getVideosEscola(escolaId) {
  const { data, error } = await supabase
    .from('titulos_videos')
    .select('*')
    .eq('escola_id', escolaId)
    .eq('ativo', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Criar novo vídeo
export async function createVideoEscola(video) {
  const { data, error } = await supabase
    .from('titulos_videos')
    .insert([video])
    .select();
  if (error) throw error;
  return data?.[0];
}

// Atualizar vídeo existente
export async function updateVideoEscola(id, updates) {
  const { data, error } = await supabase
    .from('titulos_videos')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

// Remover vídeo
export async function deleteVideoEscola(id) {
  const { error } = await supabase
    .from('titulos_videos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 