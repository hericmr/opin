// Central slug utility for the project
export const criarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
    .trim();
};

// Gera URL legível para página de escola: "42-eei-nome-da-escola"
// O ID no prefixo garante unicidade; o nome torna a URL legível
export const escolaUrlSlug = (id, nome) => {
  if (!id || !nome) return String(id);
  return `${id}-${criarSlug(nome)}`;
};

// Extrai o ID numérico de um slug de escola ("42-eei-nome" → 42)
export const idFromEscolaSlug = (slug) => {
  if (!slug) return null;
  const id = parseInt(slug.split('-')[0], 10);
  return isNaN(id) ? null : id;
}; 