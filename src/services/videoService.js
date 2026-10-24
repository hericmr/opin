import { supabase } from '../dbClient';

// Id do vídeo no YouTube/Vimeo (o mesmo vídeo aparece com URLs em formatos diferentes)
const idDoVideo = (url) =>
  (String(url || '').match(/(?:embed\/|v=|youtu\.be\/|shorts\/|vimeo\.com\/(?:video\/)?)([\w-]{6,})/) || [])[1] || url;

/**
 * Junta registros do mesmo vídeo: a planilha cadastra o mesmo vídeo uma vez
 * como 'geral' (título descritivo) e outra como 'lindiflix' (nome do
 * professor). Devolve um item por vídeo, na ordem da primeira ocorrência:
 * { ...registro, titulo, participantes } — titulo vem do registro 'geral'
 * (ou null) e participantes são os títulos dos demais.
 */
export function agruparVideos(videos) {
  const grupos = new Map();
  for (const video of videos || []) {
    const chave = idDoVideo(video.video_url);
    if (!grupos.has(chave)) grupos.set(chave, []);
    grupos.get(chave).push(video);
  }
  return [...grupos.values()].map((registros) => {
    const geral = registros.find((v) => v.categoria !== 'lindiflix');
    const titulo = geral?.titulo?.trim() || null;
    const participantes = [...new Set(
      registros.filter((v) => v !== geral).map((v) => v.titulo?.trim()).filter(Boolean)
    )];
    return { ...(geral || registros[0]), titulo, participantes };
  });
}

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