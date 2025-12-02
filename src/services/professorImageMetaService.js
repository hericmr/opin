import { supabase } from '../dbClient';

export const addProfessorImageMeta = async (meta) => {
  const { data, error } = await supabase
    .from('imagens_professores')
    .insert([meta])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProfessorImageMeta = async (id, updates) => {
  const { data, error } = await supabase
    .from('imagens_professores')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getProfessorImageMetaByUrl = async (imagem_url, escola_id) => {
  const { data, error } = await supabase
    .from('imagens_professores')
    .select('*')
    .eq('imagem_url', imagem_url)
    .eq('escola_id', escola_id)
    .eq('ativo', true)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}; 