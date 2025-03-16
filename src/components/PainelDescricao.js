import React, { useMemo } from "react";
import DOMPurify from "dompurify";

/**
 * Componente PainelDescricao - Exibe conteúdo formatado com sanitização HTML
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.descricao - Texto HTML ou texto puro a ser exibido
 * @param {string} props.className - Classes CSS adicionais (opcional)
 * @returns {React.ReactElement|null} - Componente renderizado ou null
 */
const PainelDescricao = ({ descricao, className = "" }) => {
  // Função para formatar o texto com quebras de linha
  const formatText = (text) => {
    if (!text) return "";
    
    // Preserva parágrafos convertendo linhas duplas em tags <p>
    let formattedText = text.replace(/\n\n+/g, "</p><p>");
    
    // Substitui quebras de linha simples por <br>
    formattedText = formattedText.replace(/\n/g, "<br>");
    
    // Adiciona tags <p> no início e fim se não existirem
    if (!formattedText.startsWith("<p>")) {
      formattedText = "<p>" + formattedText;
    }
    if (!formattedText.endsWith("</p>")) {
      formattedText = formattedText + "</p>";
    }
    
    // Remove espaços extras entre tags HTML
    formattedText = formattedText.replace(/>\s+</g, "><");
    
    return formattedText;
  };

  // Usa useMemo para evitar sanitização redundante em re-renders
  // Todos os hooks devem ser chamados no nível superior, antes de qualquer retorno condicional
  const sanitizedHTML = useMemo(() => {
    if (!descricao) return "";
    
    return DOMPurify.sanitize(formatText(descricao), {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
        'div', 'span', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'center', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead', 
        'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'class', 'style', 'src', 'alt',
        'width', 'height', 'id', 'title', 'aria-label', 'aria-describedby'
      ],
      ADD_TAGS: ['center', 'blockquote'],
      ADD_ATTR: ['target', 'className', 'title'],
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false
    });
  }, [descricao]);

  // Retorna null se não houver descrição após executar todos os Hooks
  if (!descricao) return null;

  return (
    <div className={`mb-6 ${className}`}>
      <div
        className="prose prose-lg lg:prose-xl max-w-none bg-white rounded-lg p-4"
        style={{
          lineHeight: "1.8",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          color: "#1f2937", // text-gray-800 equivalente
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        aria-live="polite"
      />
    </div>
  );
};

export default React.memo(PainelDescricao);