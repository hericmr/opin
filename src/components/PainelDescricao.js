import React from "react";
import DOMPurify from "dompurify";

// Este componente exibe o texto que sera exibido no painel

const PainelDescricao = ({ descricao }) => {
  if (!descricao) return null;

  const formatText = (text) => {
    // Substitui \n por <br> para preservar quebras de linha
    let formattedText = text.replace(/\n/g, "<br>");
    
    // Remove espaços extras entre tags HTML
    formattedText = formattedText.replace(/>\s+</g, "><");
    
    return formattedText;
  };

  const sanitizedHTML = DOMPurify.sanitize(formatText(descricao), {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 
      'div', 'span', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'center'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'style', 'src', 'alt',
      'width', 'height', 'id'
    ],
    ADD_TAGS: ['center'],
    ADD_ATTR: ['target', 'className'],
    KEEP_CONTENT: true
  });

  return (
    <div className="mb-6 bg-white">
      <div 
        className="prose prose-sm sm:prose lg:prose-lg text-gray-800 max-w-none"
        style={{
          backgroundColor: "#ffffff",
          lineHeight: "1.8",
          opacity: 1,
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          "& p": { marginBottom: "1rem" },
          "& br": { marginBottom: "0.5rem" },
          "& b, & strong": { fontWeight: "600" },
          "& i, & em": { fontStyle: "italic" },
          "& a": { 
            color: "#059669",
            textDecoration: "underline",
            "&:hover": { color: "#047857" }
          }
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
};

export default PainelDescricao;