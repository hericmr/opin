import { supabase } from '../dbClient';

/**
 * Buscar documentos de uma escola
 */
export async function getDocumentosEscola(escolaId) {
  const { data, error } = await supabase
    .from('documentos_escola')
    .select('*')
    .eq('escola_id', escolaId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Criar novo documento
 */
export async function createDocumentoEscola(documento) {
  const { data, error } = await supabase
    .from('documentos_escola')
    .insert([documento])
    .select();
  if (error) throw error;
  return data?.[0];
}

/**
 * Atualizar documento existente
 */
export async function updateDocumentoEscola(id, updates) {
  const { data, error } = await supabase
    .from('documentos_escola')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

/**
 * Deletar documento
 */
export async function deleteDocumentoEscola(id) {
  const { error } = await supabase
    .from('documentos_escola')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/**
 * Validar se é um link do Google Drive/Docs
 */
export function isGoogleDriveLink(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

/**
 * Validar formato de link do Google Drive
 */
export function validateGoogleDriveLink(url) {
  if (!isGoogleDriveLink(url)) {
    return { isValid: false, error: 'URL deve ser um link do Google Drive ou Google Docs' };
  }
  
  // Verificar se é um link válido do Google Drive
  const drivePattern = /drive\.google\.com\/(file\/d\/|open\?id=)([a-zA-Z0-9-_]+)/;
  const docsPattern = /docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/;
  
  if (drivePattern.test(url) || docsPattern.test(url)) {
    return { isValid: true };
  }
  
  return { isValid: false, error: 'Formato de URL do Google Drive inválido' };
}



