-- Normaliza extensões de imagem para .webp em legendas_fotos e escolas_completa.
-- Os arquivos físicos em data/storage/opin/ são todos .webp; o banco ainda tinha
-- os caminhos originais (.jpeg/.jpg/.png) do Supabase cloud.

UPDATE legendas_fotos
SET imagem_url = regexp_replace(imagem_url, '\.(jpeg|jpg|png)$', '.webp')
WHERE imagem_url ~ '\.(jpeg|jpg|png)$'
  AND imagem_url NOT LIKE 'http%';

UPDATE escolas_completa
SET imagem_header = regexp_replace(imagem_header, '\.(jpeg|jpg|png)$', '.webp')
WHERE imagem_header ~ '\.(jpeg|jpg|png)$'
  AND imagem_header NOT LIKE 'http%';
