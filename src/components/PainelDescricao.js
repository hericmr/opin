import React from "react";
import ReactMarkdown from "react-markdown";

// Este componente exibe o texto que sera exibido no painel

const PainelDescricao = ({ descricao }) => {
  const isHTML = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.body.innerHTML !== str;
  };

  return (
    descricao && (
      <div className="mb-6">
        {isHTML(descricao) ? (
          <div className="prose prose-sm sm:prose lg:prose-lg text-gray-800" dangerouslySetInnerHTML={{ __html: descricao }} />
        ) : (
          <ReactMarkdown className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
            {descricao}
          </ReactMarkdown>
        )}
      </div>
    )
  );
};

export default PainelDescricao;