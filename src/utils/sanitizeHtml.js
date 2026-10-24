import DOMPurify from 'dompurify';

// Lista de permissões usada em todo HTML que vem do banco (histórias,
// descrições). Cobre o que o editor Quill gera.
const CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'div', 'span', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'center', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead',
    'tbody', 'tr', 'th', 'td', 'u', 's', 'sub', 'sup'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'style', 'src', 'alt',
    'width', 'height', 'id', 'title', 'aria-label', 'aria-describedby'
  ],
  KEEP_CONTENT: true,
  ALLOW_DATA_ATTR: false
};

/**
 * Remove scripts, handlers (onerror, onclick...) e URLs javascript: de um HTML.
 * @param {string} html
 * @returns {string} HTML seguro para dangerouslySetInnerHTML
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, CONFIG);
}

export default sanitizeHtml;
